import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Video from '../views/video.vue';
import Channel from '../views/channel.vue';
import Channelss from '../views/channelss.vue';
import Search from '../views/search.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/video/:id/:playlist?',
    name: 'Video',
    component: Video,
  },
  {
    path: '/channel/:id',
    name: 'Channel',
    component: Channel,
  },
  {
    path: '/Channelss',
    name: 'Channelss',
    component: Channelss,
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
