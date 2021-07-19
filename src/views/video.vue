<template>
  <div>
    <article class="videoContainer">
      <div
        v-html="videoDetails.player.embedHtml"
        class="videoContainer__video"
      ></div>
      <main class="videoContainer__details">
        <header class="videoContainer__details__header">
          <div class="videoContainer__details__header__data">
            <h1 class="videoContainer__details__header__title">
              {{ videoDetails.snippet.title }}
            </h1>
            <p
              class="videoContainer__details__header__owner"
              @click="routeToChannel"
            >
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
              >{{ videoDetails.statistics.likeCount | likesFilter }}
            </li>
            <li>
              <ThumpsDownIcon></ThumpsDownIcon
              >{{ videoDetails.statistics.dislikeCount | likesFilter }}
            </li>
          </ul>
          <ul class="videoContainer__details__footer__actions">
            <li><PlusIcon></PlusIcon></li>
            <li><ShareIcon></ShareIcon></li>
            <li><FlagIcon></FlagIcon></li>
          </ul>
        </footer>
        <footer class="videoContainer__details__footerDesktop">
          <p class="videoContainer__details__footerDesktop__views">
            {{ videoDetails.statistics.viewCount | viewsFilter }} views .
            {{ videoDetails.snippet.publishedAt | publishFilter }} ago
          </p>
          <ul class="videoContainer__details__footerDesktop__actions">
            <li>
              <ThumpsUpIcon></ThumpsUpIcon
              >{{ videoDetails.statistics.likeCount | likesFilter }}
            </li>
            <li>
              <ThumpsDownIcon></ThumpsDownIcon
              >{{ videoDetails.statistics.dislikeCount | likesFilter }}
            </li>
            <li><ShareIcon></ShareIcon> Share</li>
            <li><Playlist></Playlist></li>
            <li><More></More></li>
          </ul>
        </footer>
      </main>
      <div class="videoContainer__channel">
        <p class="videoContainer__channel__title" @click="routeToChannel">
          {{ videoDetails.snippet.channelTitle }}
        </p>
        <p class="videoContainer__channel__desc" v-if="videoShortDescription">
          {{ videoDescription }} ...
        </p>
        <p class="videoContainer__channel__desc" v-else>
          {{ videoDetails.snippet.description }}
        </p>
        <button
          @click="videoShortDescription = !videoShortDescription"
          v-if="videoDescription"
        >
          Show {{ videoShortDescription ? 'More' : 'Less' }}
        </button>
        <ul>
          <li v-for="tag in videoDetails.snippet.tags" :key="tag">
            #{{ tag }}
          </li>
        </ul>
      </div>
    </article>
    <div class="videoContainer__listVideos">
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
        :videoDescription="video.videoDescription"
      ></VideosList>
    </div>
    <Observer @intersect="intersected" />
  </div>
</template>

<script>
import VideosList from '@/components/videosList.vue';
import FlagIcon from '@/assets/flag.svg';
import PlusIcon from '@/assets/plus.svg';
import ShareIcon from '@/assets/share.svg';
import Playlist from '@/assets/playlist.svg';
import ThumpsUpIcon from '@/assets/thumps-up.svg';
import ThumpsDownIcon from '@/assets/thumps-down.svg';
import Arrow from '@/assets/arrow-down.svg';
import More from '@/assets/more.svg';
import Observer from '@/components/observer.vue';

export default {
  data() {
    return {
      relatedVideos: [],
      videoDetails: {
        player: {
          embedHtml: '',
        },
        snippet: {
          title: '',
        },
        statistics: {
          viewCount: '',
        },
      },
      showFooter: false,
      videoDescription: '',
      videoShortDescription: true,
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet,contentDetails,statistics,player',
        key: 'AIzaSyDoGaVf9MN-JswI8VvddPMMlHsIt3TfEdI',
        nextPageTokenSearch: '',
        maxResults: 25,
      },
    };
  },
  async created() {
    console.log(this.$route.params);
    let playlistsResult;
    if (this.$route.params.playlistId) {
      const playList = `${this.api.baseUrl}playlistItems?part=snippet,contentDetails,status&key=${this.api.key}&playlistId=${this.$route.params.playlistId}`;
      let getPlayList = await fetch(playList);
      playlistsResult = await getPlayList.json();
      console.log(playlistsResult);
    }
    const apiUrl = `${this.api.baseUrl}videos?part=${this.api.part}&key=${
      this.api.key
    }&id=${
      this.$route.params.playlistId
        ? playlistsResult.items
            .map((item) => item.snippet.resourceId.videoId)
            .join(',')
        : this.$route.params.id
    }`;
    try {
      let list = await fetch(apiUrl);
      let response = await list.json();
      this.videoDetails = await response.items[0];
      if (response.items[0].snippet.description.length > 400) {
        this.videoDescription = response.items[0].snippet.description.substring(
          0,
          400
        );
        this.videoShortDescription = true;
      }
      this.videoShortDescription = false;

      this.relatedVideos = response.items.map((item) => {
        return {
          duration: this.convertTime(item.contentDetails.duration),
          id: item.id,
          channelTitle: item.snippet.channelTitle,
          videoTitle: item.snippet.title,
          thumpnails: item.snippet.thumbnails,
          views: item.statistics.viewCount,
          videoDescription: item.snippet.description,
        };
      });
      // console.log(response.items[0]);
    } catch (err) {
      console.log(err);
    }
  },
  async mounted() {
    if (!this.$route.params.playlistId) await this.getRelatedVideos();
  },
  methods: {
    routeToChannel() {
      this.$router.push({
        name: 'Channel',
        params: { id: this.videoDetails.snippet.channelId },
      });
    },
    async intersected() {
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
            videoDescription: item.snippet.description,
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
    Playlist,
    More,
  },
  filters: {
    viewsFilter: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    likesFilter: function (value) {
      if (Math.abs(value) > 999)
        return Math.sign(value) * (Math.abs(value) / 1000).toFixed(1) + 'k';
      if (Math.abs(value) > 999999)
        return Math.sign(value) * (Math.abs(value) / 1000000).toFixed(1) + 'M';
      if (Math.abs(value) > 999999999)
        return (
          Math.sign(value) * (Math.abs(value) / 1000000000).toFixed(1) + 'B'
        );
      return Math.sign(value) * Math.abs(value);
    },
    publishFilter: function (value) {
      let d = new Date(value);
      let currentYear = new Date().getFullYear();
      let years = d.getFullYear();
      let months = d.getMonth();
      let hours = d.getHours();
      let minutes = d.getMinutes();
      if (years < currentYear && currentYear - years > 1)
        return `${currentYear - years} years`;
      if (years < currentYear) return `${currentYear - years} year`;
      if (months === 1) {
        return `${months} month`;
      }
      if (months > 1) {
        return `${months} months`;
      }
      if (hours === 1) {
        return `${hours} hour`;
      }
      if (hours > 1) {
        return `${hours} hours`;
      }
      if (minutes > 0) {
        return `${months} minutes`;
      }
    },
  },
};
</script>

<style lang="sass">
$medium: 900px
.videoContainer
  padding: 0 2em
  margin-top: 2em
  padding: 0
  &__listVideos
    @media (min-width: $medium)
      padding: 1em 14em
  @media (min-width: $medium)
    padding: 0 15em
    padding-top: 2em
  &__video
      width: 100%
      iframe
        width: 100%
        height: 500px
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
          @media (min-width: $medium)
            display: none
      &__views
          font-size: .75rem
          color: #4c4c4c
          font-weight: 300
      &__btn
          color: #7C7C7C
          @media (min-width: $medium)
            display: none
    &__footer
      display: flex
      align-items: center
      justify-content: space-between
      @media (min-width: $medium)
        display: none
      &__reactions
        display: inline-flex
        align-items: center
        list-style-type: none
        li
          display: flex
          align-items: center
          color:#7C7C7C
          svg
            margin-right: .25em

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
    &__footerDesktop
      display: none
      @media (min-width: $medium)
        display: flex
        align-items: center
        justify-content: space-between
        ul
          display: inline-flex
          align-items: center
          list-style-type: none
          li
            display: flex
            align-items: center
            color:#7C7C7C
            svg
              margin-right: .25em

          li + li
              margin-left: 1em
  &__channel
      display: none
      @media (min-width: $medium)
        display: flex
        flex-direction: column
        padding: 2em 0
        border-bottom: 1px solid #7C7C7C
        &__title
          cursor: pointer
          font-size: 1.5rem
          margin-bottom: 1em
          &:hover
            color: blue
        &__desc
          line-height: 1.7
          margin-bottom: .75em
        button
          background-color: transparent
          padding: .25em
          font-size: 1rem
          border: none
          outline: none
          cursor: pointer
          align-self: flex-start
          transition: all 100ms linear
          margin-bottom: .75em
          &:hover
            color: blue
        ul
          display: flex
          flex-wrap: wrap
          align-items: center
          list-style: none
          li
            padding: .25em
            color: blue
            cursor: pointer
            &:hover
              color: red
</style>
