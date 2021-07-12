<template>
  <div id="app">
    <MainPage></MainPage>
  </div>
</template>
<script>
// @ is an alias to /src
import MainPage from '@/components/mainPage.vue';

export default {
  name: 'Home',
  components: {
    MainPage,
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
