<template>
  <div class="filters">
    <select name="" id="" class="filters__select">
      <option value="">All</option>
      <option value="">All</option>
      <option value="">All</option>
    </select>
    <select name="" id="" class="filters__select">
      <option value="">Any Time</option>
      <option value="">Any Time</option>
      <option value="">Any Time</option>
    </select>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass">
.filters
  padding: .75em
  display: flex
  align-items: center
  justify-content: flex-start
  border-bottom: 1px solid #ACACAC
  &__select
    font-size: 1rem
    background-color: #F2F2F2
    border: 1px solid #ACACAC
    padding: .75em .5em
    width: clamp(6em, 7em, 10em)
    outline: none
    & + select
      margin-left: .5em
</style>
