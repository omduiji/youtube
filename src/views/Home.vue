<template>
  <div>
    <Filters></Filters>
    <!-- <Channel></Channel> -->
    <VideosList :videos="videosList"></VideosList>
    <LoadMore @getMoreData="getMoreData" v-show="loaderCompStatus"></LoadMore>
    <Loader v-show="!loaderCompStatus"></Loader>
  </div>
</template>

<script>
import Filters from '@/components/filters.vue';
// import Channel from '@/components/channel.vue';
import VideosList from '@/components/videosList.vue';
import LoadMore from '@/components/loadMore.vue';
import Loader from '@/components/loader.vue';

export default {
  name: 'Main',
  data() {
    return {
      loaderStatus: false,
      loaderCompStatus: true,
      videosList: [],
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/videos?',
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        order: 'viewCount',
        maxResults: 20,
        regionCode: 'US',
        key: 'AIzaSyAgSOCGHxMsWtd0Dj7Mj6g8Dkg8ey0EQ3c',
        prevPageToken: '',
        nextPageToken: '',
      },
    };
  },
  components: {
    Filters,
    // Channel,
    VideosList,
    LoadMore,
    Loader,
  },
  async created() {
    const apiUrl = `${this.api.baseUrl}part=${this.api.part}&chart=${this.api.chart}&order=${this.api.order}&regionCode=${this.api.regionCode}&maxResults=${this.api.maxResults}&key=${this.api.key}&pageToken=${this.api.nextPageToken}`;
    try {
      let list = await fetch(apiUrl);
      let response = await list.json();
      let hydratedArray = response.items.map((item) => {
        return {
          duration: this.convertTime(item.contentDetails.duration),
          id: item.id,
          channelTitle: item.snippet.channelTitle,
          videoTitle: item.snippet.title,
          thumpnails: item.snippet.thumbnails,
          views: item.statistics.viewCount,
        };
      });
      this.api.nextPageToken = response.nextPageToken;
      this.videosList = hydratedArray;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
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
    async getMoreData() {
      this.loaderCompStatus = false;
      // console.log(this.loaderStatus, 'worked');
      const apiUrl = `${this.api.baseUrl}part=${this.api.part}&chart=${this.api.chart}&order=${this.api.order}&regionCode=${this.api.regionCode}&maxResults=${this.api.maxResults}&key=${this.api.key}&pageToken=${this.api.nextPageToken}`;
      try {
        let list = await fetch(apiUrl);
        let response = await list.json();
        let hydratedArray = response.items.map((item) => {
          return {
            duration: this.convertTime(item.contentDetails.duration),
            id: item.id,
            channelTitle: item.snippet.channelTitle,
            videoTitle: item.snippet.title,
            thumpnails: item.snippet.thumbnails,
            views: item.statistics.viewCount,
          };
        });
        this.api.nextPageToken = response.nextPageToken;
        this.videosList = [...this.videosList, ...hydratedArray];
      } catch (err) {
        console.log(err);
      }
      this.loaderCompStatus = true;
    },
  },
};
</script>

<style></style>
