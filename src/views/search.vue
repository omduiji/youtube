<template>
  <div class="searchPage">
    <VideosList
      v-for="(video, index) in searchResults"
      :key="index"
      :duration="video.videoDuration"
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
        maxResults: 10,
        regionCode: 'US',
        key: 'AIzaSyDoGaVf9MN-JswI8VvddPMMlHsIt3TfEdI',
        channelToken: '',
        videoToken: '',
        playlistToken: '',
        q: '',
        searchPageToken: '',
        listResultsToken: '',
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
    console.log(this.$route.params, 'ppppppp');
    await this.searching();
  },

  methods: {
    async getMoreData() {
      await this.searching();
    },
    async searching() {
      this.loaderCompStatus = false;

      let types = this.$route.params.searchObject.type
        ? this.$route.params.searchObject.type.split(',')
        : ['channel', 'video', 'playlist'];
      // let time = this.$route.params.searchObject.time
      //   ? this.$route.params.searchObject.time.split(',')
      //   : { start: '', end: '' };
      console.log(types);
      // let dynamicParams = [
      //   { type: 'channel', token: this.api.channelToken },
      //   { type: 'playlist', token: this.api.playlistToken },
      //   { type: 'video', token: this.api.videoToken },
      // ];
      let urls = [];
      // let url = `${this.api.baseUrl}search?part=${this.api.part}&q=${
      //   this.$route.params.searchObject.query
      // }&type=${
      //   this.$route.params.searchObject.type || 'channel,video,playlist'
      // }&regionCode=${this.api.regionCode}&maxResults=${
      //   this.api.maxResults
      // }&key=${this.api.key}&pageToken=${
      //   this.api.searchPageToken
      // }&publishedAfter=${
      //   this.$route.params.searchObject.time.start || ''
      // }&publishedBefore=${this.$route.params.searchObject.time.end || ''}`;
      types.forEach((item) => {
        urls.push(
          `${this.api.baseUrl}search?part=${this.api.part}&q=${this.$route.params.searchObject.query}&type=${item}&regionCode=${this.api.regionCode}&maxResults=${this.api.maxResults}&key=${this.api.key}&pageToken=${this.api.searchPageToken}`
        );
      });

      try {
        // let searchQuery = await fetch(url);
        // let searchQueryRes = await searchQuery.json();
        // this.api.searchPageToken = searchQueryRes.nextPageToken;
        // let res = await this.getSearchResults(searchQueryRes.items);
        // console.log(res);
        let result = await Promise.all(urls.map((item) => fetch(item)));
        let resultArr = await Promise.all(result.map((item) => item.json()));
        // console.log(...resultArr, 'ressss');
        if (resultArr.length > 1) {
          this.api.channelToken = resultArr[0].nextPageToken;
          this.api.playlistToken = resultArr[1].nextPageToken;
          this.api.videoToken = resultArr[2].nextPageToken;
        }
        this.api.searchToken = resultArr.nextPageToken;
        // let arr = resultArr.forEach((item) => {
        //   this.getSearchResults(item.items, types);
        // });
        let arr = await this.getSearchResults(resultArr, types);
        console.log(arr);
        // let res = [
        //   ...(await this.getVideos(videosDetails)),
        //   ...(await this.getChannels(channelsDetails)),
        //   ...(await this.getPlaylists(playlistsDetails)),
        // ];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        // this.loaderCompStatus = false;
        this.searchResults = [...this.searchResults, ...arr];
      } catch (err) {
        console.log(err);
      }
      this.loaderCompStatus = true;
    },
    async getSearchResults(list, types) {
      console.log(list, 'lisssss');
      console.log(types, 'ss');
      const { baseUrl, key } = this.api;
      const parts = {
        channel: 'snippet,contentDetails,statistics',
        playlist: 'snippet,contentDetails',
        video: 'snippet,contentDetails,statistics',
      };
      // let listIds = list
      //   .map((list) => list.id[`${this.$route.params.searchObject.type}Id`])
      //   .join(',');
      // let urlLists = list.map((item) => {
      //   types.map((element) => {
      //     return {
      //       url: `${baseUrl}${element}s?part=${
      //         parts[`${element}`]
      //       }&key=${key}&id=${item.id[`${element}Id`]}`,
      //     };
      //   });
      // });

      // let urlLists = list.map((listItem) =>
      //   listItem.items.map((item) => {
      //     types.map((element) => {
      //       return {
      //         url: `${baseUrl}${element}s?part=${
      //           parts[`${element}`]
      //         }&key=${key}&id=${item.id[`${element}Id`]}`,
      //       };
      //     });
      //   })
      // );
      let channelIds = [];
      let playlistIds = [];
      let videoIds = [];
      let urls = [];
      list.forEach((listItem) =>
        listItem.items.forEach((item) => {
          if (item.id.channelId) channelIds.push(item.id.channelId);
          if (item.id.playlistId) playlistIds.push(item.id.playlistId);
          if (item.id.videoId) videoIds.push(item.id.videoId);
        })
      );
      // console.log(channelIds, playlistIds, videoIds, 'ooooooooooo');
      types.forEach((type) => {
        if (type === 'channel') {
          urls.push(
            `${baseUrl}${type}s?part=${
              parts[type]
            }&key=${key}&id=${channelIds.join(',')}`
          );
        }
        if (type === 'video') {
          urls.push(
            `${baseUrl}${type}s?part=${
              parts[type]
            }&key=${key}&id=${videoIds.join(',')}`
          );
        }
        if (type === 'playlist') {
          urls.push(
            `${baseUrl}${type}s?part=${
              parts[type]
            }&key=${key}&id=${playlistIds.join(',')}`
          );
        }
      });

      let result = await Promise.all(urls.map((item) => fetch(item)));
      let resultArr = await Promise.all(result.map((item) => item.json()));
      let finalMap = resultArr
        .map((item) => {
          return item.items.reduce(function (acc, obj) {
            acc.push({
              listChannelTitle: obj.snippet.title,
              thumbnails: obj.snippet.thumbnails,
              type: obj.kind.split('#')[1],
              id: obj.id,
              videoCountChannel: obj.statistics?.videoCount,
              subscriberCount: obj.statistics?.subscriberCount,
              playListTitle: obj.snippet.title,
              playlistVideoCount: obj.contentDetails.itemCount,
              duration: obj.contentDetails.duration,
              videoChannelTitle: obj.snippet.channelTitle,
              videoTitle: obj.snippet.title,
              videoViews: obj.statistics?.viewCount,
              description: obj.snippet.description,
              publishDate: obj.snippet.publishedAt,
            });
            return acc;
          }, []);
        })
        .flat();
      let finaSearchArray = finalMap.map((item) => {
        return {
          videoDuration:
            item.duration !== undefined ? this.convertTime(item.duration) : '',
          ...item,
        };
      });

      return finaSearchArray;
      // const apiUrl = `${baseUrl}${this.$route.params.searchObject.type}s?part=${parts.this.$route.params.searchObject.type}&key=${key}&id=${listIds}`;
      // let listQuery = await fetch(apiUrl);
      // // let listQueryResult = await listQuery.json();
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
      console.log(h, m, s, 'wwww');
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
