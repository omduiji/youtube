<template>
  <div>
    <article class="videos" @click="routeToParent">
      <div
        class="videos__img"
        :data-duration="duration"
        v-if="type === 'video'"
      >
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
          <img
            :src="smallScreenThumb"
            class="video__img--video"
            alt=""
            decoding="async"
            loading="lazy"
            v-if="type === 'video'"
          />
        </picture>
      </div>
      <div class="videos__imgChannel" v-if="type === 'channel'">
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

          <img
            :src="smallScreenThumb"
            class="video__img--channel"
            alt=""
            decoding="async"
            loading="lazy"
            v-if="type === 'channel'"
          />
        </picture>
      </div>
      <div
        class="videos__imgPlaylist"
        :data-playlistVideoCount="playlistVideoCount"
        v-if="type === 'playlist'"
      >
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

          <img
            :src="smallScreenThumb"
            class="video__img--playlist"
            alt=""
            decoding="async"
            loading="lazy"
            v-if="type === 'playlist'"
          />
        </picture>
      </div>
      <div class="videos__details">
        <p
          class="videos__details__name videos__details__nameChannel"
          v-if="type == 'channel'"
        >
          {{ listChannelTitle }}
        </p>
        <p class="video__details__channelVideos" v-if="type === 'channel'">
          {{ channelVideos }} Videos
        </p>
        <p class="video__details__subscripers" v-if="type === 'channel'">
          {{ channelSubscribers }} Subscribers
        </p>

        <p
          class="videos__details__name videos__details__namePlaylist"
          v-if="type == 'playlist'"
        >
          {{ playListTitle }}
        </p>

        <p class="videos__details__name" v-if="type == 'video'">{{ title }}</p>
        <p class="videos__details__viewsDate" v-if="type == 'video'">
          {{ viewsCount | viewsFilter }} views.{{ publishDate | publishFilter }}
        </p>
        <p class="videos__details__owner">{{ channelTitle }}</p>
        <p class="videos__details__description" v-if="type == 'video'">
          {{ videoDescription }}
        </p>
        <p class="videos__details__views" v-if="type == 'video'">
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
    'videoDescription',
    'publishDate',
    'listChannelTitle',
    'channelSubscribers',
    'channelVideos',
    'playListTitle',
    'playlistVideoCount',
    'type',
    'playlistId',
  ],

  methods: {
    routeToParent() {
      if (this.type === 'video') {
        if (this.$route.name === 'Video') {
          this.$router.replace({ name: 'Video', params: { id: this.videoId } });
          this.$router.go();
        }
        this.$router.push({ name: 'Video', params: { id: this.videoId } });
      }
      if (this.type === 'channel') {
        this.$router.push({ name: 'Channel', params: { id: this.videoId } });
      }
      if (this.type === 'playlist') {
        this.$router.push({
          name: 'Video',
          params: { playlistId: this.playlistId },
        });
      }
    },
  },
};
</script>

<style lang="sass">
$medium: 900px

.videos
  display: flex
  align-items: stretch
  padding: .75em
  margin-bottom: .5em
  cursor: pointer
  &__imgChannel
    img
      border-radius: 50%
      width: 100px
  &__imgPlaylist
    position: relative
    &::after
      content: attr(data-playlistVideoCount)
      position: absolute
      bottom: 5px;
      top: 0px;
      right: 0px;
      left: 68px
      color: white
      background-color: #4c4c4c
      font-size: 1rem
      display: flex
      align-items: center
      justify-content: center
      opacity: .93
    &::before
      content: 'TTT'
      position: absolute
      top: 50%
    @media (min-width: $medium)
      &::after
        content: attr(data-playlistVideoCount)
        position: absolute
        bottom: 4px;
        top: 0px;
        right: 0px;
        left: 206px
        color: white
        background-color: #4c4c4c
        font-size: 28px
        display: flex
        align-items: center
        justify-content: center
        opacity: .93
      &::before
        content: 'TTT'
        position: absolute
        top: 50%
  &__img
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
      min-width: 10px

  &__details
    font-size: 1rem
    margin-left: .75em
    display: flex
    flex-direction: column
    align-items: flex-start
    justify-content: stretch
    &__name
      width: 27ch
      color: #4c4c4c
      font-size: .8em
      font-weight: 400
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: .25em
      @media (min-width: $medium)
        font-size: 1.5em
        width: clamp(30vw, 50vw, 60vw)
    &__nameChannel
      margin-top: .5em
    &__namePlaylist
      margin-top: .5em
    &__channelVideos
        font-size: .75em
    &__viewsDate
      display: none
      @media (min-width: $medium)
        display: block
        margin-bottom: 1.5em
    &__owner
      font-size: .75em
      font-weight: 300
      margin-bottom: .25em
      @media (min-width: $medium)
        margin-bottom: 1.5em
        font-size: 1em
    &__description
      display: none
      @media (min-width: $medium)
        display: block
        width: 55ch
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    &__views
      font-size: .75em
      font-weight: 300
      @media (min-width: $medium)
        display: none
</style>
