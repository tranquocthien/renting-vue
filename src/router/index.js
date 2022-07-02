import Vue from 'vue';
import VueRouter from 'vue-router';
import * as VueGoogleMaps from 'vue2-google-maps';
import RenterRoutes from './routes/renter';
import VendorRoutes from './routes/vendor';
import AdminRoutes from './routes/admin';
import AuthenticationRoutes from './routes/authentication';
import utils from '../utils/utils';

Vue.use(VueRouter);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDcw-KnCAPzni3QYvgk3RDoTZL65xh8a4o',
    language: 'vi',
    region: 'VI',
    libraries: 'places', // necessary for places input
  },
});

const routes = [...RenterRoutes, ...VendorRoutes, ...AdminRoutes, ...AuthenticationRoutes];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // if (window.$cookies.get('firebaseIdToken') === null) {
    if (!utils.isFirebaseLoggedIn()) {
      // not logged in
      next({
        name: 'Login',
        params: { nextUrl: to.path, preUrl: from.path },
      });
    } else {
      // logged in
      const role = window.$cookies.get('role');
      if (to.matched.some((record) => record.meta.is_vendor)) {
        if (role === 'vendors') {
          next();
        } else {
          next(from.path);
        }
      } else if (to.matched.some((record) => record.meta.is_admin)) {
        if (role === 'admins') {
          next();
        } else {
          next(from.path);
        }
      } else if (to.matched.some((record) => record.meta.is_renter)) {
        if (role === 'renters') {
          next();
        } else {
          next(from.path);
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    // not require authen
    next();
  } else {
    // not require authen
    next();
  }
});

export default router;
