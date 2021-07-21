<template>
  <div v-if="this.$route.name === 'Search' || 'Home'">
    <div class="filters">
      <div class="filters__wrapper">
        <header class="filters__wrapper__header">
          <p v-if="results && !hideWrapper">
            About {{ results | viewsFilter }} results
          </p>
          <p v-else></p>
          <button @click="hideWrapper = !hideWrapper">
            <FilterIcon></FilterIcon>Filter
          </button>
        </header>
        <main class="filters__wrapper__container" v-if="!hideWrapper">
          <div class="filters__wrapper__container__item">
            <p>Upload Date</p>
            <ul class="filters__wrapper__container__item__list">
              <li
                v-for="(time, index) in times"
                :key="time.name"
                @click="sendDate(index)"
              >
                {{ time.name }}
                <Close
                  v-if="time.iconStatus"
                  @click="time.iconStatus = false"
                ></Close>
              </li>
            </ul>
          </div>
          <div class="filters__wrapper__container__item">
            <p>Type</p>
            <ul class="filters__wrapper__container__item__list">
              <li
                v-for="(type, index) in types"
                :key="type.name"
                @click="sendType(index)"
              >
                {{ type.name }}
                <Close
                  v-show="type.iconStatus"
                  @click="type.iconStatus = false"
                ></Close>
              </li>
            </ul>
          </div>
          <div class="filters__wrapper__container__item">
            <p>Sort By</p>
            <ul class="filters__wrapper__container__item__list">
              <li
                v-for="(order, index) in orders"
                :key="order.name"
                @click="sendOrder(index)"
              >
                {{ order.name }}
                <span v-if="order.iconStatus" @click="removeOrder(index)"
                  ><Close></Close
                ></span>
                <span v-else></span>
              </li>
            </ul>
          </div>
        </main>
      </div>
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
      <select
        name=""
        id=""
        class="filters__select"
        v-model="searchByOrder"
        @change="searchingByOrder"
      >
        <option value="relevance">Relevence</option>
        <option value="date">Upload date</option>
        <option value="viewCount">View count</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  </div>
</template>

<script>
import Close from "@/assets/close.svg";
import FilterIcon from "@/assets/filter.svg";
export default {
  created() {
    // console.log(this.$route);
    this.results = window.localStorage.getItem("count");
    // if (this.$route.name == 'Video') window.localStorage.clear();
    // if (this.$route.name == 'Home') window.localStorage.getItem('count');
  },

  data() {
    return {
      results: "",
      hideWrapper: true,
      searchByType: "",
      searchByPeriod: "all",
      searchByOrder: "relevance",
      types: [
        { name: "All", value: "", iconStatus: false, parent: "searchByType" },
        {
          name: "Video",
          value: "video",
          iconStatus: false,
          parent: "searchByType",
        },
        {
          name: "Channel",
          value: "channel",
          iconStatus: false,
          parent: "searchByType",
        },
        {
          name: "Playlist",
          value: "playlist",
          iconStatus: false,
          parent: "searchByType",
        },
      ],
      orders: [
        {
          name: "Relevence",
          value: "relevance",
          iconStatus: false,
          parent: "searchByOrder",
        },
        {
          name: "Upload date",
          value: "date",
          iconStatus: false,
          parent: "searchByOrder",
        },
        {
          name: "View count",
          value: "viewCount",
          iconStatus: false,
          parent: "searchByOrder",
        },
        {
          name: "Rating",
          value: "rating",
          iconStatus: false,
          parent: "searchByOrder",
        },
      ],
      times: [
        {
          name: "All",
          value: "all",
          iconStatus: false,
          parent: "searchByPeriod",
        },
        {
          name: "Today",
          value: "today",
          iconStatus: false,
          parent: "searchByPeriod",
        },
        {
          name: "This Week",
          value: "weekAgo",
          iconStatus: false,
          parent: "searchByPeriod",
        },
        {
          name: "This Month",
          value: "monthAgo",
          iconStatus: false,
          parent: "searchByPeriod",
        },
      ],
    };
  },
  components: {
    Close,
    FilterIcon,
  },
  props: {
    searchResultsCount: null,
  },
  methods: {
    removeOrder(order) {
      this.orders[order].iconStatus = false;
      // let temp = this.orders[order];
      // let tempIndex = order;
      // this.orders.splice(order, 1);
      // this.orders.push(temp);
      // this.orders[tempIndex] = temp;
      console.log(this.orders[order].iconStatus, "ooo");
    },
    sendDate(element) {
      this.times[element].iconStatus = true;
      this.searchByPeriod = this.times[element].value;
      this.searchingByTime();
    },
    sendType(element) {
      this.types[element].iconStatus = true;
      this.searchByType = this.types[element].value;
      this.searchingByType();
    },
    sendOrder(element) {
      this.orders[element].iconStatus = true;
      this.searchByOrder = this.orders[element].value;
      this.searchingByOrder();
    },
    searchingByType() {
      this.$emit("typeSearch", this.searchByType);
    },
    searchingByTime() {
      this.$emit("timeSearch", this.getTimeFormat(this.searchByPeriod));
    },
    searchingByOrder() {
      this.$emit("orderSearch", this.searchByOrder);
    },
    getTimeFormat(value) {
      let publishingObject = {
        start: "",
        end: "",
      };
      let today = new Date();
      if (value === "today") {
        publishingObject.start = today.toISOString();
        publishingObject.end = today.toISOString();
      }
      if (value === "weekAgo") {
        publishingObject.end = today.toISOString();
        publishingObject.start = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        ).toISOString();
      }
      if (value === "monthAgo") {
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
$medium: 900px;
.filters
  padding: .75em
  display: flex
  align-items: center
  justify-content: flex-start
  flex-basis: 33%
  border-bottom: 1px solid #ACACAC
  @media (min-width: $medium)
    padding-top: 8em
    padding-bottom: 0em
    margin: 0 14em
    border: none
  &__wrapper
    display: none
    @media (min-width: $medium)
      display: flex
      flex-direction: column
      justify-content: space-between
      flex-grow: 1
      border-bottom: 1px solid #ACACAC
      &__header
        display: flex
        align-items: center
        justify-content: space-between
        margin-bottom: 1.5em
        p
          font-size: 1.2rem
          color: rgb(17,17,17)
        button
          border: none
          outline: none
          padding: .25em
          font-size: 1rem
          background-color: transparent
          cursor: pointer
          display: flex
          align-items: center
          svg
            margin-right: .25em
      &__container
        display: flex
        align-items: center
        justify-content: space-between
        &__item
          display: flex
          flex-direction: column
          p
            color: rgb(17,17,17)
            font-size: 1.2em
            border-bottom: 1px solid rgb(17,17,17)
            padding-bottom: 1em
            margin-bottom: 1em
            width: 300px
          &__list
            display: flex
            flex-direction: column
            list-style: none
            li
              padding: 1em
              height: 50px
              cursor: pointer
              display: flex
              align-items: center
              flex-direction: row
              justify-content: space-between
              &:hover
                color:#ACACAC

  &__select
    font-size: .75rem
    background-color: #F2F2F2
    border: 1px solid #ACACAC
    padding: .75em .5em
    width: clamp(6em, 7em, 10em)
    outline: none
    @media (min-width: $medium)
      display: none
    & + select
      margin-left: .5em
</style>
