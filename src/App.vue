<template>
  <div id="app">
    <!-- <MainPage></MainPage> -->
    <Header></Header>
    <router-view/>
  </div>
</template>
<script>
// @ is an alias to /src
// import MainPage from '@/components/mainPage.vue';
import Header from './components/header.vue';

export default {
  name: 'Home',
  components: {
    // MainPage,
    Header,
  },
};
</script>
<style lang="scss">
@import '/src/assets/styles/app.sass';
@import '/src/assets/styles/variables.sass';
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
#app {
  font-family: 'Roboto', sans-serif;
}
</style>
