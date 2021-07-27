<template>
  <div id="app">
    <!-- <MainPage></MainPage> -->
    <appHeader
      @getSearchParams="getParams"
      v-if="this.$route.name !== 'notFound'"
    ></appHeader>
    <router-view />
  </div>
</template>
<script>
// @ is an alias to /src
// import MainPage from '@/components/mainPage.vue';
import appHeader from "./components/header.vue";
// import { EventBus } from './eventBus';

export default {
  data() {
    return {
      typeFilter: "",
      timeFilter: "",
      orderFilter: "",
    };
  },
  // name: 'Home',
  components: {
    // MainPage,
    appHeader,
  },
  methods: {
    getParams(params) {
      if (this.$route.name === "Search") {
        this.$router.replace({ params: { query: params } });
        return;
      }
      this.$router.push({ name: "Search", params: { query: params } });
    },
  },
};
</script>
<style lang="sass">
@import '/src/assets/styles/app.sass';
@import '/src/assets/styles/variables.sass';
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
#app
  font-family: 'Roboto', sans-serif
</style>
