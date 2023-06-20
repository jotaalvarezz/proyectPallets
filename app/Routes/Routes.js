import Vue from 'nativescript-vue'

import NSVueRouter from 'nativescript-vue-router-ns'

import Warehouse from '~/views/Warehouses/Warehouses'

Vue.use(NSVueRouter)

const routes = [
  {
    name: 'warehouse.index',
    component: Warehouse,
    meta: { auth: true }
  },
 /*  {
    name: 'login.index',
    component: Login,
    meta: { guest: true }
  } */
]

const router = new NSVueRouter({
 // ignoreSame,  <-- Optional. Will set if reject or accept navigate to same current component.
  routes,
  /* eslint-disable-next-line no-undef  */
  /* verbose: TNS_ENV !== 'production' */ // <-- Optional. Will output the warnings to console.
})

export default router
