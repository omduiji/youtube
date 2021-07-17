<template>
  <div class="filters">
    <select
      name=""
      id=""
      class="filters__select"
      v-model="searchByType"
      @change="searchingByType"
    >
      <option value="">All</option>
      <option value="channel">Channel</option>
      <option value="video">Video</option>
      <option value="playlist">Playlist</option>
    </select>
    <select
      name=""
      id=""
      class="filters__select"
      v-model="searchByPeriod"
      @change="searchingByTime"
    >
      <option value="all">All</option>
      <option value="today">Today</option>
      <option value="weekAgo">This Week</option>
      <option value="monthAgo">This Month</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchByType: '',
      searchByPeriod: 'all',
    };
  },
  methods: {
    searchingByType() {
      this.$emit('typeSearch', this.searchByType);
    },
    searchingByTime() {
      this.$emit('timeSearch', this.getTimeFormat(this.searchByPeriod));
    },
    getTimeFormat(value) {
      let publishingObject = {
        start: '',
        end: '',
      };
      let today = new Date();
      if (value === 'today') {
        publishingObject.start = today.toISOString();
        publishingObject.end = today.toISOString();
      }
      if (value === 'weekAgo') {
        publishingObject.end = today.toISOString();
        publishingObject.start = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        ).toISOString();
      }
      if (value === 'monthAgo') {
        publishingObject.end = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).toISOString();
        publishingObject.start = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        ).toISOString();
      }
      return publishingObject;
    },
  },
};
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
