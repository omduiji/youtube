<template>
  <nav class="nav">
    <header class="nav__header">
      <router-link to="/"
        ><Youtube class="nav__header__logo"></Youtube
      ></router-link>
      <form class="nav__form">
        <input
          type="text"
          class="nav__form__input"
          placeholder="YouTube"
          v-model="search"
        />
        <button @click.prevent="getSearchQuery" :disabled="!search">
          <SearchIcon class="nav__form__icon"></SearchIcon>
        </button>
      </form>
    </header>
  </nav>
</template>

<script>
import Youtube from '@/assets/logo.svg';
import SearchIcon from '@/assets/search.svg';

export default {
  components: { Youtube, SearchIcon },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    getSearchQuery() {
      this.$emit('getSearchParams', this.search);
    },
  },
};
</script>

<style lang="sass">
@import '/src/assets/styles/variables.sass'
.nav
  background-color: $mainRed
  padding: .5em .5em
  // box-shadow: 1px 5px 16px -1px rgba(128,115,115,0.53)
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    &__logo
      fill: white
      width: clamp(1.8rem, 3rem, 6rem)
  &__form
    display: flex
    align-items: center
    justify-content: flex-start
    flex-grow: 1
    margin-right: .5em
    button
      background-color: transparent
      border: none
      outline: none
      cursor: pointer
      &:disabled
        cursor:not-allowed

    &__input
      flex-grow: 1
      border: none
      background-color: $mainRed
      color: white
      font-size: clamp(1rem, 1.2rem, 3rem)
      padding: .5em
      outline: none
      &::placeholder
        color: white
        fontweight: 400
    &__icon
      width: clamp(1.5rem, 1.7rem, 3rem)
</style>
