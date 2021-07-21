import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.filter("likesFilter", function (value) {
  if (Math.abs(value) > 999)
    return Math.sign(value) * (Math.abs(value) / 1000).toFixed(1) + "k";
  if (Math.abs(value) > 999999)
    return Math.sign(value) * (Math.abs(value) / 1000000).toFixed(1) + "M";
  if (Math.abs(value) > 999999999)
    return Math.sign(value) * (Math.abs(value) / 1000000000).toFixed(1) + "B";
  return Math.sign(value) * Math.abs(value);
});
Vue.filter("viewsFilter", function (value) {
  return typeof value !== String
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";
});
Vue.filter("publishFilter", function (value) {
  let d = new Date(value);
  let currentYear = new Date().getFullYear();
  let years = d.getFullYear();
  let months = d.getMonth();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  if (years < currentYear && currentYear - years > 1)
    return `${currentYear - years} years`;
  if (years < currentYear) return `${currentYear - years} year`;
  if (months === 1) {
    return `${months} month`;
  }
  if (months > 1) {
    return `${months} months`;
  }
  if (hours === 1) {
    return `${hours} hour`;
  }
  if (hours > 1) {
    return `${hours} hours`;
  }
  if (minutes > 0) {
    return `${months} minutes`;
  }
});
