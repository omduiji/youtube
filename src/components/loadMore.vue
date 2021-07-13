<template>
  <footer class="loadMore">
    <button class="loadMore__btn" @click="loadMoareData">
      Show more items
    </button>
  </footer>
</template>

<script>
export default {
  methods: {
    loadMoareData() {
      this.$emit('getMoreData');
    },
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
  padding: .75em 0
  &__btn
    background-color: white
    border: none
    color: #4c4c4c
    font-size: 1rem
    font-weight: 300
</style>
