<template>
  <div class="errorPage">
    <ErrorIcon></ErrorIcon>
    <h1>{{ this.$route.params.status }}</h1>
    <p v-if="this.$route.params.msg">{{ this.$route.params.msg }}</p>
    <p v-else>Page Not Found</p>
    <router-link to="/">Home</router-link>
  </div>
</template>
<script>
import ErrorIcon from '@/assets/error.svg';

export default {
  name: 'notFound',
  components: {
    ErrorIcon,
  },
};
</script>
<style lang="sass">
.errorPage
    padding: 3em .5em
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    color: rgba(3,3,3,8)
    height: calc( 100vh -  52px)
    svg
        font-size: 3rem
        height: 3rem
        width: 3rem
    a
        text-decoration: none
    p
      font-size: 2rem
      margin: 1em 0
</style>
