<template>
  <div>
    <main class="channelWrapper">
      <header class="channelWrapper__header">
        <img
          :src="channelData.snippet.thumbnails.medium.url"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </header>
      <section class="channelWrapper__body">
        <div class="channelWrapper__body__logo">
          <img
            :src="channelData.snippet.thumbnails.default.url"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="channelWrapper__body__details">
          <h1 class="channelWrapper__body__details__title">
            {{ channelData.snippet.title }}
          </h1>
          <div class="channelWrapper__body__details__subscripeBtn">
            <button>SUBSCRIBE</button>
            <p>
              {{ channelData.statistics.subscriberCount | viewsFilter }}
              <span>{{
                channelData.statistics.subscriberCount > 1
                  ? 'Subscriber'
                  : 'Subscribers'
              }}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
    <section class="playlistWrapper" v-if="Playlists[0]">
      <h2 class="playlistWrapper__title">Playlists</h2>
      <VideosList
        v-for="(playlist, index) in Playlists"
        :key="index"
        :smallScreenThumb="playlist.thumbnails.default.url"
        :mediumScreenThumb="playlist.thumbnails.medium.url"
        :largeScreenThumb="playlist.thumbnails.medium.url"
        :channelTitle="playlist.title"
        :playlistVideoCount="playlist.itemCount"
        :playlistId="playlist.id"
        type="playlist"
      ></VideosList>
    </section>
    <section class="videoWrapper" v-if="Videos[0]">
      <h2 class="videoWrapper__title">Videos</h2>
      <VideosList
        v-for="(video, index) in Videos"
        :key="index"
        :duration="video.duration"
        :smallScreenThumb="video.thumpnails.default.url"
        :mediumScreenThumb="video.thumpnails.medium.url"
        :largeScreenThumb="video.thumpnails.medium.url"
        :title="video.videoTitle"
        :channelTitle="video.channelTitle"
        :viewsCount="video.views"
        :videoId="video.id"
        :type="video.type"
        :videoDescription="video.description"
      ></VideosList>
    </section>
  </div>
</template>

<script>
import VideosList from '@/components/videosList.vue';

export default {
  components: { VideosList },

  data() {
    return {
      loaderCompStatus: false,
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet,contentDetails,statistics',
        key: 'AIzaSyAlc0f_0RHg4B0eeu3e47v9AM0_LIriNI4',
        nextPageTokenSearch: '',
        maxResults: 25,
      },
      channelData: {
        statistics: {
          subscriberCount: '',
        },
        snippet: {
          thumbnails: {
            medium: {
              url: '',
            },
            default: {
              url: '',
            },
          },
        },
      },
      playlistToken: '',
      searchToken: '',
      Playlists: [],
      Videos: [],
    };
  },
  async created() {
    this.loaderCompStatus = true;
    const urlParams = new URLSearchParams();
    urlParams.append('maxResults', this.api.maxResults);
    urlParams.append('key', this.api.key);
    urlParams.append('channelId', this.$route.params.id);

    const requests = [
      {
        name: 'channelSections',
        part: 'snippet,contentDetails',
      },
      {
        name: 'search',
        part: 'snippet',
        type: 'video',
      },
      {
        name: 'playlists',
        part: 'snippet,contentDetails,player',
      },
    ];
    let urls = [];

    requests.forEach((item) => {
      urls.push(
        `${this.api.baseUrl}${item.name}?part=${item.part}&type=${item.type}&${urlParams}`
      );
    });
    const channels = `${this.api.baseUrl}channels?part=${this.api.part}&key=${this.api.key}&id=${this.$route.params.id}`;
    urls.push(channels);

    let res = await Promise.all(urls.map((item) => fetch(item)));
    let [sections, searching, playlists, channelData] = await Promise.all(
      res.map((r) => r.json())
    );
    this.channelData = channelData.items[0];
    console.log(sections);
    console.log(channelData.items[0], 'chdata');
    // console.log(playlists);
    this.Playlists = playlists.items.map((item) => {
      return {
        itemCount: item.contentDetails.itemCount,
        title: item.snippet.title,
        thumbnails: item.snippet.thumbnails,
        id: item.id,
        type: 'playlist',
      };
    });
    let videosIds = searching.items.map((item) => item.id.videoId).join(',');
    const videosUrl = `${this.api.baseUrl}videos?part=${this.api.part}&key=${this.api.key}&id=${videosIds}`;
    let videosReq = await fetch(videosUrl);
    let videosRes = await videosReq.json();
    this.Videos = videosRes.items.map((item) => {
      return {
        duration: this.convertTime(item.contentDetails.duration),
        id: item.id,
        channelTitle: item.snippet.channelTitle,
        videoTitle: item.snippet.title,
        thumpnails: item.snippet.thumbnails,
        views: item.statistics.viewCount,
        type: 'video',
        description: item.snippet.description,
      };
    });
    console.log(this.Playlists, 'playlists');
    this.playlistToken = playlists.nextPageToken;
    this.searchToken = searching.nextPageToken;
    this.loaderCompStatus = false;
  },
  methods: {
    getPlaylists() {},
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
  filters: {
    viewsFilter: function (value) {
      return typeof value !== String
        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : '';
    },
  },
};
</script>

<style lang="sass">
$medium: 900px
.channelWrapper
  @media (min-width: $medium)
    padding: 8em 14em
  &__header
    width: 100vw
    @media (min-width: $medium)
      width: 100%
    img
      width: 100%
      display: block
  &__body
    position: relative
    &__logo
      width: 50px
      height: 50px
      border-radius: 50%
      position: absolute
      top: -30%
      left: .75em
      img
        width: 50px
        height: 50px
        border-radius: 50%
    &__details
      padding: 1.5em
      padding-left: 3em
      display: flex
      flex-direction: column
      align-items: flex-start
      justify-content: center
      background-color: #EDEDED
      &__title
        color: #4c4c4c
        font-weight: 400

      &__subscripeBtn
        display: flex
        padding-top: .5em
        button
          border: none
          margin-right: .25em
          font-size: 1rem
          color: red
        p
          color: #4c4c4c
        span
          font-size: .75em
.playlistWrapper
  padding: .5em
  @media (min-width: $medium)
    padding: 1em 14em
  h2
    font-size: 2rem
    color: #4c4c4c
    padding: 0 .25em
.videoWrapper
  padding: .5em
  @media (min-width: $medium)
    padding: 1em 14em
  h2
    font-size: 2rem
    color: #4c4c4c
    padding: 0 .25em
</style>
