<template>
  <div>
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
    <!-- <Filters></Filters> -->
  </div>
</template>

<script>
import Youtube from '@/assets/logo.svg';
import SearchIcon from '@/assets/search.svg';
// import Filters from "@/components/filters.vue";

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
@import '/src/assets/styles/_mixins.sass'
$small: 300px;
$medium: 900px;
.nav
  background-color: $mainRed
  padding: .25em .5em
  // box-shadow: 1px 5px 16px -1px rgba(128,115,115,0.53)
  &__header
    display: flex
    align-items: center
    justify-content: space-between
    &__logo
      fill: white
      width: clamp(.5rem, 2rem, 2.5rem)
      @media (min-width: $medium)
        fill: red
        width: clamp(1.8rem, 5rem, 6rem)
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
        cursor: not-allowed
      svg
        width: 2em
        transform: translateY(3px)
        transition: all 150ms linear
      @media (min-width: $medium)
        background-color: rgb(248,248,248)
        border: 1px solid rgb(17,17,17)
        padding: .5em 2.4em
        border-left: none
        margin-right: 5px
        svg
          fill: rgb(17,17,17)
          width: 1.5em
          height: 1.5em
        &:hover
          background-color: rgb(240,240,240)
          svg
            fill: rgb(0,0,0)
    &__input
      flex-grow: 1
      border: none
      background-color: $mainRed
      color: white
      font-size: clamp(1rem, 1.2rem, 3rem)
      outline: none
      margin: .25em
      transition: all 150ms linear
      padding: 0 .25em
      margin: 0 1em
      &:focus
        border: 1px solid rgb(17,17,17)
        background-color: white
        color: rgb(17,17,17)
      &::placeholder
        color: white
        fontweight: 400
      @media (min-width: $medium)
        background-color: white
        border: 1px solid rgb(17,17,17)
        color: rgb(17,17,17)
        padding: .35em
        margin: 0
        margin-left: 3em

    &__icon
      width: clamp(1rem, 1.2rem, 3rem)
  @media (min-width: $medium)
    background-color: white
    padding: .5em 15em
    position: fixed
    z-index: 100000
    box-shadow: 0px 0px 3px 0px rgb(17,17,17)
    width: 100vw
    opacity: .99
    transition: all 150ms linear
</style>
