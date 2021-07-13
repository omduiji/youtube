<template>
  <div>
    <Filters></Filters>
    <Channel></Channel>
    <VideosList v-for="i in 10" :key="i"></VideosList>
    <LoadMore></LoadMore>
  </div>
</template>

<script>
import Filters from '@/components/filters.vue';
import Channel from '@/components/channel.vue';
import VideosList from '@/components/videosList.vue';
import LoadMore from '@/components/loadMore.vue';

export default {
  name: 'Main',
  data() {
    return {
      api: {
        baseUrl: 'https://www.googleapis.com/youtube/v3/search?',
        part: 'snippet',
        type: 'channel',
        order: 'viewCount',
        maxResults: 12,
        q: 'messi',
        key: 'AIzaSyAgSOCGHxMsWtd0Dj7Mj6g8Dkg8ey0EQ3c',
        prevPageToken: '',
        nextPageToken: '',
      },
    };
  },
  components: {
    Filters,
    Channel,
    VideosList,
    LoadMore,
  },
  async created() {
    const apiUrl = `${this.api.baseUrl}part=${this.api.part}&type=${this.api.type}&order=${this.api.order}&q=${this.api.q}&maxResults=${this.api.maxResults}&key=${this.api.key}&pageToken=${this.api.nextPageToken}`;
    let list = await fetch(apiUrl);
    console.log(await list.json());
  },
};
</script>

<style></style>
