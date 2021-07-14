import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Video from '../views/video.vue';
import Channel from '../views/channel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/video/:id',
    name: 'Video',
    component: Video,
  },
  {
    path: '/channel',
    name: 'Channel',
    component: Channel,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
