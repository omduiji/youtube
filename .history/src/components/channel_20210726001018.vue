<template>
  <article class="channel">
    <div class="channel__img"></div>
    <div class="channel__details">
      <h1 class="channel__details__name">el zero channel</h1>
      <p class="channel__details__videos">123 Videos</p>
      <p class="channel__details__subscripers">212121212 subscrip</p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'channelComponent',
};
</script>

<style lang="sass">
.channel
  display: flex
  align-items: center
  padding: 1.5em .75em
  font-size: 1rem
  &__img
    border-radius: 50%
    width: 100px
    height: 100px
    border: 1px solid red
    margin-right: .5em
  &__details
    &__name
      font-size: 1.2em
      font-weight: 400
      color: #4c4c4c
    &__videos
      font-size: .75em
      font-weight: 300
    &__subscripers
      font-size: .75em
      font-weight: 300
</style>
