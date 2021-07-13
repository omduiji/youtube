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
export default {};
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
