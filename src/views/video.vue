<template>
<div>
  <article class="videoContainer">
    <video
      controls
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
      class="videoContainer__video"
    ></video>
    <main class="videoContainer__details">
        <header class="videoContainer__details__header">
            <div class="videoContainer__details__header__data">
                <h1 class="videoContainer__details__header__title">Spongebob In Real Life</h1>
                <p class="videoContainer__details__header__owner">Nickelodean .<span class="videoContainer__details__header__views">10001000 views</span></p>
            </div>
            <div class="videoContainer__details__header__btn"> ^ </div>
        </header>
        <footer class="videoContainer__details__footer">
            <ul class="videoContainer__details__footer__reactions">
                <li>149K</li>
                <li>25K</li>
            </ul>
            <ul class="videoContainer__details__footer__actions">
                <li>wl</li>
                <li>sh</li>
                <li>re</li>
            </ul>
        </footer>
    </main>
  </article>
  <VideosList v-for="i in 10" :key="i"></VideosList>
</div>
</template>

<script>
import VideosList from '@/components/videosList.vue';

export default {components: {VideosList}};
</script>

<style lang="sass">
.videoContainer
    &__video
        width: 100vw
    &__details
        display: flex
        flex-direction: column
        border-bottom: 1px solid red
        padding: 1em
        &__header
            display: flex
            align-items: center
            justify-content: space-between
            margin-bottom: .25em
            &__title
                font-size: 1.2rem
                color: #4c4c4c
                font-weight: 500
                width: 30ch
                margin-bottom: .25em
            &__owner
                font-size: 1rem
                color: #4c4c4c
                font-weight: 300
                width: 15ch
                display: inline
            &__views
                font-size: .75rem
                color: #4c4c4c
                font-weight: 300
        &__footer
            display: flex
            align-items: center
            justify-content: space-between
            &__reactions
                display: inline-flex
                align-items: center
                list-style-type: none
                li + li
                    margin-left: .25em
            &__actions
                display: inline-flex
                align-items: center
                list-style-type: none
                li + li
                    margin-left: .25em



</style>
