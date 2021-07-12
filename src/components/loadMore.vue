<template>
  <footer class="loadMore">
    <button class="loadMore__btn">Show more items</button>
    <Loader></Loader>
  </footer>
</template>

<script>
import Loader from '@/components/loader.vue';
export default {
  components: {
    Loader,
  },
};
</script>

<style lang="sass">
.loadMore
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  border-top: 1px solid #4c4c4c
  padding: .5em 0
  &__btn
    background-color: white
    border: none
    color: #4c4c4c
    font-size: 1rem
    font-weight: 300
</style>
