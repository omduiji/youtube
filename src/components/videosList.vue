<template>
  <article class="videos">
    <div class="videos__img"></div>
    <div class="videos__details">
      <p class="videos__details__name">video first</p>
      <p class="videos__details__owner">mohamed awad</p>
      <p class="videos__details__views">10000000 views</p>
    </div>
  </article>
</template>

<script>
export default {};
</script>

<style lang="sass">
.videos
  display: flex
  align-items: stretch
  padding: .75em
  margin-bottom: .5em
  &__img
    width: 170px
    height: 100px
    border: 1px solid red
    position: relative
    &::after
      content: '12:20'
      position: absolute
      bottom: 5px
      right: 5px
      color: white
      background-color: #4c4c4c
      font-size: 8px
      padding: .25em
  &__details
    font-size: 1rem
    margin-left: .75em
    &__name
      width: 15ch
      color: #4c4c4c
      font-size: 1.2em
      font-weight: 400
    &__owner
      font-size: .75em
      font-weight: 300
    &__views
      font-size: .75em
      font-weight: 300
</style>
