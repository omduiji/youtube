import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/video/:id/:playlist?',
    name: 'Video',
    component: () => import(/* webpackChunkName: "video" */ '../views/video.vue')
  },
  {
    path: '/channel/:id',
    name: 'Channel',
    component: () => import(/* webpackChunkName: "channel" */ '../views/channel.vue')
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/search.vue')
  },
  {
    path: '/error/:status?/:msg?',
    name: 'notFound',
    alias: '*',
    component: () => import(/* webpackChunkName: "notFound" */ '../views/notFound.vue')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


export default router;
