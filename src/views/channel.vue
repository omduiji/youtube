<template>
  <div>
    <main class="channelWrapper">
      <header class="channelWrapper__header">
        <img src="https://unsplash.it" alt="" />
      </header>
      <section class="channelWrapper__body">
        <div class="channelWrapper__body__logo">
          <img src="../assets/logo.png" alt="" />
        </div>
        <div class="channelWrapper__body__details">
          <h1 class="channelWrapper__body__details__title">
            Spongebob Square Pants
          </h1>
          <div class="channelWrapper__body__details__subscripeBtn">
            <button>SUBSCRIBE</button>
            <p>23000</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/',
        part: 'snippet,contentDetails,statistics',
        key: 'AIzaSyCszfMFfakNsBScdp2QxYCWThQY-aO9MZI',
        nextPageTokenSearch: '',
        maxResults: 25,
      },
      channelData: {},
    };
  },
  async created() {
    const cahnnels = `${this.api.baseUrl}channels?part=${this.api.part}&key=${this.api.key}&id=${this.$route.params.id}`;
    const cahnnelsSections = `${this.api.baseUrl}channelSections?part=snippet,contentDetails&key=${this.api.key}&channelId=${this.$route.params.id}`;
    let res = await Promise.all([fetch(cahnnels), fetch(cahnnelsSections)]);
    const [channelData, ownedChannels] = await Promise.all(
      res.map((r) => r.json())
    );
    this.channelData = channelData.items[0];
    console.log(ownedChannels);
  },
};
</script>

<style lang="sass">
.channelWrapper
  &__header
    background-color: yellow
    width: 100vw
    height: 100px
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
