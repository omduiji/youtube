<template>
  <div>
    <Filters
      @typeSearch="searchByType"
      @timeSearch="searchByTime"
      @orderSearch="searchByOrder"
      :searchingResults="resultsCount"
    ></Filters>
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
      <!-- <Filters v-if="notAvailabale" :searchResultsCount="resultsCount"></Filters> -->
    </div>
  </div>
</template>

<script>
// import Channel from '@/components/channel.vue';
import VideosList from "@/components/videosList.vue";
import LoadMore from "@/components/loadMore.vue";
import Loader from "@/components/loader.vue";
import Observer from "@/components/observer.vue";
import Filters from "@/components/searchFilters.vue";

// import { EventBus } from "../eventBus";

export default {
  name: "Search",
  data() {
    return {
      typeValue: "",
      orderValue: "",
      searchQuery: "",
      timeValue: {},
      resultsCount: "",
      searchingParams: "",
      observer: null,
      loaderCompStatus: true,
      notAvailabale: false,
      searchResults: [],
      api: {
        baseUrl: process.env.VUE_APP_BASE_URL,
        part: "snippet",
        maxResults: 10,
        regionCode: "US",
        key: process.env.VUE_APP_API_KEY,
        channelToken: "",
        videoToken: "",
        playlistToken: "",
        q: "",
        searchPageToken: "",
        listResultsToken: "",
        order: "",
      },
    };
  },

  components: {
    // Channel,
    VideosList,
    LoadMore,
    Loader,
    Observer,
    Filters,
  },

  async created() {
    // console.log(this.$route.params.searchObject, 'apaarasm');
    await this.searching();
    this.$watch(
      () => this.$route.params.query,
      () => {
        this.searchResults = [];
        this.searching();
      }
    );
    this.searchQuery = this.$route.params.query;
  },

  methods: {
    startSearch() {
      console.log("start search started");
    },
    searchByType(value) {
      this.typeValue = value;
      this.searching();
    },

    searchByOrder(value) {
      this.orderValue = value;
      this.searching();
    },
    searchByTime(value) {
      this.timeValue = value;
      this.searching();
    },

    async getMoreData() {
      await this.searching();
    },
    async searching() {
      this.loaderCompStatus = false;

      let types = this.typeValue
        ? this.typeValue.split(",")
        : ["channel", "video", "playlist"];

      let dynamicTokens = {
        channel: this.api.channelToken,
        video: this.api.videoToken,
        playlist: this.api.playlistToken,
      };

      let urls = [];
      let urlParams = new URLSearchParams();
      // console.log(this.$route.params.searchObject.query);
      urlParams.append("q", this.$route.params.query);
      urlParams.append("regionCode", this.api.regionCode);
      urlParams.append("maxResults", this.api.maxResults);
      urlParams.append("part", this.api.part);
      urlParams.append("key", this.api.key);

      if (this.orderValue) urlParams.append("order", this.orderValue);

      if (this.timeValue.start) {
        urlParams.append("publishedBefore", this.timeValue.end);
        urlParams.append("publishedAfter", this.timeValue.start);
      }
      types.forEach((type) => {
        urls.push(
          `${this.api.baseUrl}/search?&type=${type}&pageToken=${
            dynamicTokens[`${type}`]
          }&${urlParams}`
        );
      });

      try {
        let result = await Promise.all(urls.map((item) => fetch(item)));
        let resultArr = await Promise.all(result.map((item) => item.json()));
        if (resultArr.length > 1) {
          this.api.channelToken = resultArr[0].nextPageToken;
          this.api.playlistToken = resultArr[1].nextPageToken;
          this.api.videoToken = resultArr[2].nextPageToken;
        }
        this.api.searchToken = resultArr[0].nextPageToken;
        this.resultsCount = resultArr.reduce(
          (acc, i) => acc + i.pageInfo.totalResults,
          0
        );
        // console.log(this.resultsCount);
        // window.localStorage.setItem('count', this.resultsCount);
        let arr = await this.getSearchResults(resultArr, types);
        // console.log(arr);

        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        this.loaderCompStatus = false;

        this.searchResults = [...this.searchResults, ...arr];
        // console.log(this.searchResults, 'resss');
        if (this.typeValue || this.orderValue || this.timeValue.start) {
          this.searchResults = [...arr];
        }
      } catch (err) {
        console.log(err);
        this.$router.push({ name: "notFound" });
      }
      this.loaderCompStatus = true;
    },
    async getSearchResults(list, types) {
      const { baseUrl, key } = this.api;
      const parts = {
        channel: "snippet,contentDetails,statistics",
        playlist: "snippet,contentDetails",
        video: "snippet,contentDetails,statistics",
      };

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
      types.forEach((type) => {
        if (type === "channel") {
          urls.push(
            `${baseUrl}/${type}s?part=${
              parts[type]
            }&key=${key}&id=${channelIds.join(",")}`
          );
        }
        if (type === "video") {
          urls.push(
            `${baseUrl}/${type}s?part=${
              parts[type]
            }&key=${key}&id=${videoIds.join(",")}`
          );
        }
        if (type === "playlist") {
          urls.push(
            `${baseUrl}/${type}s?part=${
              parts[type]
            }&key=${key}&id=${playlistIds.join(",")}`
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
              type: obj.kind.split("#")[1],
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
            item.duration !== undefined ? this.convertTime(item.duration) : "",
          ...item,
        };
      });

      return finaSearchArray;
    },

    async intersected() {
      this.searching();
    },

    convertTime(duration) {
      if (duration === undefined) {
        return "";
      }
      let a = duration.match(/\d+/g);

      if (
        duration.indexOf("M") >= 0 &&
        duration.indexOf("H") == -1 &&
        duration.indexOf("S") == -1
      ) {
        a = [0, a[0], 0];
      }

      if (duration.indexOf("H") >= 0 && duration.indexOf("M") == -1) {
        a = [a[0], 0, a[1]];
      }
      if (
        duration.indexOf("H") >= 0 &&
        duration.indexOf("M") == -1 &&
        duration.indexOf("S") == -1
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
      let hDisplay = h > 0 ? (h < 10 ? `0${h} :` : `${h} :`) : "";
      let mDisplay = m > 0 ? (m < 10 ? `0${m} :` : `${m} :`) : "";
      let sDisplay = s > 0 ? (s < 10 ? `0${s}` : `${s}`) : "00";
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
