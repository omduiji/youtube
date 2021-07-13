<template>
  <div>
    <!-- <Header></Header> -->
    <Filters></Filters>
    <!-- <Channel></Channel> -->
    <VideosList v-for="i in 10" :key="i"></VideosList>
    <LoadMore></LoadMore>
  </div>
</template>

<script>
// import Header from '@/components/header.vue';
import Filters from '@/components/filters.vue';
// import Channel from '@/components/channel.vue';
import VideosList from '@/components/videosList.vue';
import LoadMore from '@/components/loadMore.vue';

export default {
  name: 'Main',
  components: {
    // Header,
    Filters,
    // Channel,
    VideosList,
    LoadMore,
  },
};
</script>

<style></style>
