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
            <h1 class="videoContainer__details__header__title">
              Spongebob In Real Life
            </h1>
            <p class="videoContainer__details__header__owner">
              Nickelodean .<span class="videoContainer__details__header__views"
                >10001000 views</span
              >
            </p>
          </div>
          <div
            class="videoContainer__details__header__btn"
            @click="showFooter = !showFooter"
          >
            <Arrow></Arrow>
          </div>
        </header>
        <footer class="videoContainer__details__footer" v-if="showFooter">
          <ul class="videoContainer__details__footer__reactions">
            <li><ThumpsUpIcon></ThumpsUpIcon>149K</li>
            <li><ThumpsDownIcon></ThumpsDownIcon>55K</li>
          </ul>
          <ul class="videoContainer__details__footer__actions">
            <li><PlusIcon></PlusIcon></li>
            <li><ShareIcon></ShareIcon></li>
            <li><FlagIcon></FlagIcon></li>
          </ul>
        </footer>
      </main>
    </article>
    <VideosList v-for="i in 10" :key="i"></VideosList>
  </div>
</template>

<script>
import VideosList from '@/components/videosList.vue';
import FlagIcon from '@/assets/flag.svg';
import PlusIcon from '@/assets/plus.svg';
import ShareIcon from '@/assets/share.svg';
import ThumpsUpIcon from '@/assets/thumps-up.svg';
import ThumpsDownIcon from '@/assets/thumps-down.svg';
import Arrow from '@/assets/arrow-down.svg';

export default {
  data() {
    return {
      showFooter: false,
    };
  },
  components: {
    VideosList,
    FlagIcon,
    PlusIcon,
    ShareIcon,
    ThumpsUpIcon,
    ThumpsDownIcon,
    Arrow,
  },
};
</script>

<style lang="sass">
.videoContainer
    &__video
        width: 100vw
    &__details
        display: flex
        flex-direction: column
        border-bottom: 1px solid #7C7C7C
        padding: 1em
        &__header
            display: flex
            align-items: center
            justify-content: space-between
            margin-bottom: .5em
            &__title
                font-size: 1.2rem
                color: #4c4c4c
                font-weight: 500
                width: 30ch
                margin-bottom: .5em
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
            &__btn
                color: #7C7C7C
        &__footer
            display: flex
            align-items: center
            justify-content: space-between
            &__reactions
                display: inline-flex
                align-items: center
                list-style-type: none
                li
                    display: flex
                    align-items: center
                    color:#7C7C7C

                li + li
                    margin-left: 1em
            &__actions
                display: inline-flex
                align-items: center
                list-style-type: none
                li
                    color: #7C7C7C

                li + li
                    margin-left: 1em
</style>
