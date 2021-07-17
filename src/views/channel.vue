<template>
  <div>
    <Loader v-if="loaderCompStatus"></Loader>
    <main class="channelWrapper" v-else>
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
            <p>{{ channelData.statistics.subscriberCount }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Loader from '@/components/loader.vue';

export default {
  components: { Loader },

  data() {
    return {
      loaderCompStatus: false,
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet,contentDetails,statistics',
        key: 'AIzaSyDoGaVf9MN-JswI8VvddPMMlHsIt3TfEdI',
        nextPageTokenSearch: '',
        maxResults: 25,
      },
      channelData: {},
    };
  },
  async mounted() {
    this.loaderCompStatus = true;
    const cahnnels = `${this.api.baseUrl}channels?part=${this.api.part}&key=${this.api.key}&id=${this.$route.params.id}`;
    const cahnnelsSections = `${this.api.baseUrl}channelSections?part=snippet,contentDetails&key=${this.api.key}&channelId=${this.$route.params.id}`;
    let res = await Promise.all([fetch(cahnnels), fetch(cahnnelsSections)]);
    let [channelData, ownedChannels] = await Promise.all(
      res.map((r) => r.json())
    );
    this.channelData = channelData.items[0];
    console.log(ownedChannels);

    this.loaderCompStatus = false;
  },
};
</script>

<style lang="sass">
.channelWrapper
  &__header
    background-color: yellow
    width: 100vw
  &__body
    position: relative
    &__logo
      width: 50px
      height: 50px
      border-radius: 50%
      border: 3px solid blue
      position: absolute
      top: -30%
      left: .75em
      img
        width: 50px
        height: 50px
        border-radius: 50%
    &__details
      padding: 1.5em
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
          padding: 0 .5em
          font-size: 1rem
          color: red
        p
          color: #4c4c4c
</style>
