<template>
  <div class="searchPage">
    <VideosList
      v-for="(video, index) in searchResults"
      :key="index"
      :duration="video.duration"
      :smallScreenThumb="video.thumbnails.default.url"
      :mediumScreenThumb="video.thumbnails.medium.url"
      :largeScreenThumb="video.thumbnails.medium.url"
      :title="video.videoTitle"
      :channelTitle="video.videoChannelTitle"
      :viewsCount="video.videoViews"
      :videoId="video.id"
      :videoDescription="video.description"
      :publishDate="video.publishDate"
      :type="video.type"
      :listChannelTitle="video.listChannelTitle"
      :channelSubscribers="video.videoCountChannel"
      :channelVideos="video.subscriberCount"
      :playListTitle="video.playListTitle"
      :playlistVideoCount="video.playlistVideoCount"
    ></VideosList>

    <LoadMore @getMoreData="getMoreData" v-show="loaderCompStatus"></LoadMore>
    <Loader v-show="!loaderCompStatus"></Loader>
    <Observer @intersect="intersected" />
  </div>
</template>

<script>
// import Channel from '@/components/channel.vue';
import VideosList from '@/components/videosList.vue';
import LoadMore from '@/components/loadMore.vue';
import Loader from '@/components/loader.vue';
import Observer from '@/components/observer.vue';
// import { EventBus } from "../eventBus";

export default {
  name: 'Main',
  data() {
    return {
      searchingParams: '',
      observer: null,
      loaderCompStatus: true,
      searchResults: [],
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet',
        maxResults: 7,
        regionCode: 'US',
        key: 'AIzaSyBZbmbE5IBh--vtmyyVJYHYQsZZO4e_nf4',
        channelToken: '',
        videoToken: '',
        playlistToken: '',
        q: '',
      },
    };
  },

  components: {
    // Channel,
    VideosList,
    LoadMore,
    Loader,
    Observer,
  },

  async created() {
    await this.searching();
  },

  methods: {
    async getMoreData() {
      await this.searching();
    },
    async searching() {
      this.loaderCompStatus = false;

      let dynamicParams = [
        { type: 'channel', token: this.api.channelToken },
        { type: 'playlist', token: this.api.playlistToken },
        { type: 'video', token: this.api.videoToken },
      ];
      let urls = [];
      dynamicParams.forEach((item) => {
        urls.push(
          `${this.api.baseUrl}search?part=${this.api.part}&q=${this.$route.params.query}&type=${item.type}&regionCode=${this.api.regionCode}&maxResults=${this.api.maxResults}&key=${this.api.key}&pageToken=${item.token}`
        );
      });
      try {
        let result = await Promise.all(urls.map((item) => fetch(item)));
        let [channelsDetails, playlistsDetails, videosDetails] =
          await Promise.all(result.map((item) => item.json()));
        this.api.channelToken = channelsDetails.nextPageToken;
        this.api.playlistToken = playlistsDetails.nextPageToken;
        this.api.videoToken = videosDetails.nextPageToken;
        let res = [
          ...(await this.getVideos(videosDetails)),
          ...(await this.getChannels(channelsDetails)),
          ...(await this.getPlaylists(playlistsDetails)),
        ];
        for (let i = res.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [res[i], res[j]] = [res[j], res[i]];
        }
        this.loaderCompStatus = false;
        this.searchResults = [...this.searchResults, ...res];
      } catch (err) {
        console.log(err);
      }
      this.loaderCompStatus = true;
    },
    async getChannels(channels) {
      const { baseUrl, key } = this.api;
      const part = 'snippet,contentDetails,statistics';
      let channelIds = channels.items
        .map((channels) => channels.id.channelId)
        .join(',');
      const apiUrl = `${baseUrl}channels?part=${part}&key=${key}&id=${channelIds}`;
      let gettingChannels = await fetch(apiUrl);
      let res = await gettingChannels.json();
      return res.items.map((item) => {
        return {
          listChannelTitle: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          type: 'channel',
          videoCountChannel: item.statistics.videoCount,
          subscriberCount: item.statistics.subscriberCount,
        };
      });
    },
    async getPlaylists(playlists) {
      const { baseUrl, key } = this.api;
      const part = 'snippet,contentDetails';
      let playlistsIds = playlists.items
        .map((playlists) => playlists.id.playlistId)
        .join(',');
      const apiUrl = `${baseUrl}playlists?part=${part}&key=${key}&id=${playlistsIds}`;
      let gettingPlaylists = await fetch(apiUrl);
      let res = await gettingPlaylists.json();
      return res.items.map((item) => {
        return {
          playListTitle: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          playlistVideoCount: item.contentDetails.itemCount,
          type: 'playlist',
        };
      });
    },
    async getVideos(videos) {
      const { baseUrl, key } = this.api;
      const part = 'snippet,contentDetails,statistics';
      let videosIds = videos.items.map((video) => video.id.videoId).join(',');
      const apiUrl = `${baseUrl}videos?part=${part}&key=${key}&id=${videosIds}`;
      let gettingVideos = await fetch(apiUrl);
      let res = await gettingVideos.json();
      return this.hydrate(res.items, 'video');
    },
    hydrate(videos, type) {
      let result = videos.map((item) => {
        return {
          duration: this.convertTime(item.contentDetails.duration),
          id: item.id,
          videoChannelTitle: item.snippet.channelTitle,
          videoTitle: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          videoViews: item.statistics.viewCount,
          type: type,
          description: item.snippet.description,
          publishDate: item.snippet.publishedAt,
        };
      });
      return result;
    },
    async intersected() {
      this.searching();
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
};
</script>

<style lang="sass">
$medium: 900px
.searchPage
  @media (min-width: $medium)
    padding: 0em 14em
    padding-top: 8em
</style>
