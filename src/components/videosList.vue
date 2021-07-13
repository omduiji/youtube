<template>
<div>
  <article class="videos" v-for="video in videos" :key="video.id">
    <div class="videos__img" :data-duration="video.duration">
      <picture>
        <source :srcset='video.thumpnails.default.url' media="(min-width: 360px) and (max-width: 679px)">
        <source :srcset='video.thumpnails.medium.url' media="(min-width: 679px) and (max-width: 1027px)">
        <source :srcset='video.thumpnails.high.url' media="(min-width: 1028px) and (max-width: 1480px)">
        <img :src='video.thumpnails.default.url' alt="">
      </picture>
       
    </div>
    <div class="videos__details">
      <p class="videos__details__name">{{video.videoTitle}}</p>
      <p class="videos__details__owner">{{video.channelTitle}}</p>
      <p class="videos__details__views">{{video.views | viewsFilter}} views</p>
      
    </div>
  </article>
</div>
</template>

<script>
export default {
  props: {
    videos: []
  },
  filters: {
    viewsFilter: function(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

<style lang="sass">
.videos
  display: flex
  align-items: stretch
  padding: .75em
  margin-bottom: .5em
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
