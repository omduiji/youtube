<template>
  <div>
    <article class="videoContainer">
      <div v-html="videoDetails.player.embedHtml"></div>
      <main class="videoContainer__details">
        <header class="videoContainer__details__header">
          <div class="videoContainer__details__header__data">
            <h1 class="videoContainer__details__header__title">
              {{ videoDetails.snippet.title }}
            </h1>
            <p class="videoContainer__details__header__owner">
              {{ videoDetails.snippet.channelTitle }} .<span
                class="videoContainer__details__header__views"
                >{{
                  videoDetails.statistics.viewCount | viewsFilter
                }}
                views</span
              >
            </p>
          </div>
          <div
            class="videoContainer__details__header__btn"
            @click="showFooter = !showFooter"
          >
            <Arrow></Arrow>
          </div>
        </header>
        <footer class="videoContainer__details__footer" v-if="showFooter">
          <ul class="videoContainer__details__footer__reactions">
            <li>
              <ThumpsUpIcon></ThumpsUpIcon
              >{{ videoDetails.statistics.likeCount }}
            </li>
            <li>
              <ThumpsDownIcon></ThumpsDownIcon
              >{{ videoDetails.statistics.dislikeCount }}
            </li>
          </ul>
          <ul class="videoContainer__details__footer__actions">
            <li><PlusIcon></PlusIcon></li>
            <li><ShareIcon></ShareIcon></li>
            <li><FlagIcon></FlagIcon></li>
          </ul>
        </footer>
      </main>
    </article>
    <VideosList
      v-for="(video, index) in relatedVideos"
      :key="index"
      :duration="video.duration"
      :smallScreenThumb="video.thumpnails.default.url"
      :mediumScreenThumb="video.thumpnails.medium.url"
      :largeScreenThumb="video.thumpnails.medium.url"
      :title="video.videoTitle"
      :channelTitle="video.channelTitle"
      :viewsCount="video.views"
      :videoId="video.id"
    ></VideosList>
    <Observer @intersect="intersected" />
  </div>
</template>

<script>
import VideosList from '@/components/videosList.vue';
import FlagIcon from '@/assets/flag.svg';
import PlusIcon from '@/assets/plus.svg';
import ShareIcon from '@/assets/share.svg';
import ThumpsUpIcon from '@/assets/thumps-up.svg';
import ThumpsDownIcon from '@/assets/thumps-down.svg';
import Arrow from '@/assets/arrow-down.svg';
import Observer from '@/components/observer.vue';

export default {
  data() {
    return {
      relatedVideos: [],
      videoDetails: {},
      showFooter: false,
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet,contentDetails,statistics,player',
        key: 'AIzaSyCszfMFfakNsBScdp2QxYCWThQY-aO9MZI',
        nextPageTokenSearch: '',
        maxResults: 25,
      },
    };
  },
  async created() {
    const apiUrl = `${this.api.baseUrl}videos?part=${this.api.part}&key=${this.api.key}&id=${this.$route.params.id}`;
    try {
      let list = await fetch(apiUrl);
      let response = await list.json();
      this.videoDetails = response.items[0];
    } catch (err) {
      console.log(err);
    }
  },
  async mounted() {
    await this.getRelatedVideos();
  },
  methods: {
    async intersected() {
      console.log('enter');
      await this.getRelatedVideos();
    },
    async getRelatedVideos() {
      const { baseUrl, key, nextPageTokenSearch, maxResults } = this.api;
      const part = 'snippet';
      const type = 'video';
      const apiUrl = `${baseUrl}search?part=${part}&key=${key}&relatedToVideoId=${this.$route.params.id}&type=${type}&pageToken=${nextPageTokenSearch}&maxResults=${maxResults}`;
      try {
        let list = await fetch(apiUrl);
        let response = await list.json();
        let relatedVideosIds = response.items
          .map((item) => item.id.videoId)
          .join(',');
        this.relatedVideos = [
          ...this.relatedVideos,
          ...(await this.listRelatedVideos(relatedVideosIds)),
        ];
        this.api.nextPageTokenSearch = response.nextPageToken;
      } catch (err) {
        console.log(err);
      }
    },
    async listRelatedVideos(ids) {
      const { baseUrl, key, part } = this.api;
      const apiUrl = `${baseUrl}videos?part=${part}&key=${key}&id=${ids}`;
      let relatedVideos = [];
      try {
        let list = await fetch(apiUrl);
        let response = await list.json();
        relatedVideos = response.items.map((item) => {
          return {
            duration: this.convertTime(item.contentDetails.duration),
            id: item.id,
            channelTitle: item.snippet.channelTitle,
            videoTitle: item.snippet.title,
            thumpnails: item.snippet.thumbnails,
            views: item.statistics.viewCount,
          };
        });
      } catch (err) {
        console.log(err);
      }
      return relatedVideos;
    },
    convertTime(duration) {
      let a = duration.match(/\d+/g);

      if (
        duration.indexOf('M') >= 0 &&
        duration.indexOf('H') == -1 &&
        duration.indexOf('S') == -1
      ) {
        a = [0, a[0], 0];
      }

      if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
      }
      if (
        duration.indexOf('H') >= 0 &&
        duration.indexOf('M') == -1 &&
        duration.indexOf('S') == -1
      ) {
        a = [a[0], 0, 0];
      }

      duration = 0;

      if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
      }

      if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
      }

      if (a.length == 1) {
        duration = duration + parseInt(a[0]);
      }

      duration = Number(duration);
      let h = Math.floor(duration / 3600);
      let m = Math.floor((duration % 3600) / 60);
      let s = Math.floor((duration % 3600) % 60);

      let hDisplay = h > 0 ? (h < 10 ? `0${h} :` : `${h} :`) : '';
      let mDisplay = m > 0 ? (m < 10 ? `0${m} :` : `${m} :`) : '';
      let sDisplay = s > 0 ? (s < 10 ? `0${s}` : `${s}`) : '00';
      return hDisplay + mDisplay + sDisplay;
    },
  },
  components: {
    VideosList,
    FlagIcon,
    PlusIcon,
    ShareIcon,
    ThumpsUpIcon,
    ThumpsDownIcon,
    Arrow,
    Observer,
  },
  filters: {
    viewsFilter: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>

<style lang="sass">
.videoContainer
  padding: 0 2em
  &__video
      width: 100vw
  &__details
      display: flex
      flex-direction: column
      border-bottom: 1px solid #7C7C7C
      padding: 1em
      &__header
          display: flex
          align-items: center
          justify-content: space-between
          margin-bottom: .5em
          &__title
              font-size: 1.2rem
              color: #4c4c4c
              font-weight: 500
              margin-bottom: .5em
          &__owner
              font-size: 1rem
              color: #4c4c4c
              font-weight: 300
              width: 15ch
              display: inline
          &__views
              font-size: .75rem
              color: #4c4c4c
              font-weight: 300
          &__btn
              color: #7C7C7C
      &__footer
          display: flex
          align-items: center
          justify-content: space-between
          &__reactions
              display: inline-flex
              align-items: center
              list-style-type: none
              li
                  display: flex
                  align-items: center
                  color:#7C7C7C

              li + li
                  margin-left: 1em
          &__actions
              display: inline-flex
              align-items: center
              list-style-type: none
              li
                  color: #7C7C7C

              li + li
                  margin-left: 1em
</style>
