<template>
  <div>
    <article class="videos" @click="routeToVideo">
      <div class="videos__img" :data-duration="duration">
        <picture>
          <source
            :srcset="smallScreenThumb"
            media="(min-width: 360px) and (max-width: 679px)"
          />
          <source
            :srcset="mediumScreenThumb"
            media="(min-width: 679px) and (max-width: 1027px)"
          />
          <source
            :srcset="mediumScreenThumb"
            media="(min-width: 1028px) and (max-width: 2000px)"
          />
          <img :src="smallScreenThumb" alt="" decoding="async" loading="lazy" />
        </picture>
      </div>
      <div class="videos__details">
        <p class="videos__details__name">{{ title }}</p>
        <p class="videos__details__owner">{{ channelTitle }}</p>
        <p class="videos__details__views">
          {{ viewsCount | viewsFilter }} views
        </p>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: [
    'duration',
    'smallScreenThumb',
    'mediumScreenThumb',
    'largeScreenThumb',
    'title',
    'channelTitle',
    'viewsCount',
    'videoId',
  ],
  filters: {
    viewsFilter: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  methods: {
    routeToVideo() {
      if (this.$route.name === 'Video') {
        this.$route.params.id = this.videoId;
        setTimeout(() => {
          window.location.reload();
        }, 0);
        console.log(this.$route.params.id, 'sss');
      }
      this.$router.push({ name: 'Video', params: { id: this.videoId } });
    },
  },
};
</script>

<style lang="sass">
.videos
  display: flex
  align-items: stretch
  padding: .75em
  margin-bottom: .5em
  cursor: pointer
  &__img

    // border: 1px solid red
    position: relative
    &::after
      content: attr(data-duration)
      position: absolute
      bottom: 5px
      right: 5px
      color: white
      background-color: #4c4c4c
      font-size: 12px
      padding: .25em
      picture
        width: 100%
  &__details
    font-size: 1rem
    margin-left: .75em
    &__name
      width: clamp(30vw, 50vw, 60vw)
      color: #4c4c4c
      font-size: 1.2em
      font-weight: 400
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: .25em
    &__owner
      font-size: .75em
      font-weight: 300
      margin-bottom: .25em
    &__views
      font-size: .75em
      font-weight: 300
</style>
