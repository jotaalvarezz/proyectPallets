import Vue from 'nativescript-vue'

import NSVueRouter from 'nativescript-vue-router-ns'

import Warehouse from '~/views/Warehouses/Warehouses'
import Ship from '~/views/ships/Ships'
import GeneralPallets from '~/views/generalPallets/GeneralPallets.vue'
import Pallets from '~/views/pallets/Pallets'
import CreateEditPallet from '~/views/pallets/CreateEditPallet/CreateEditPallet'
import Evidence from '~/views/evidence/Evidence'
import NavViews from '~/views/tabview/NavViews'

Vue.use(NSVueRouter)

const routes = [
  {
    name: 'warehouses.index',
    component: Warehouse,
    meta: { guest: true }
  },
  {
    name: 'ship.index',
    component: Ship,
    meta: { guest: true }
  },
  {
    name: 'generalpallets.index',
    component: GeneralPallets,
    meta: { guest: true }
  },
  {
    name: 'pallets.index',
    component: Pallets,
    meta: { guest: true }
  },
  {
    name: 'editpallets.index',
    component: CreateEditPallet,
    meta: { guest: true }
  },
  {
    name: 'evidence.index',
    component: NavViews,
    meta: { guest: true }
  },
]

const router = new NSVueRouter({
  // ignoreSame,  <-- Optional. Will set if reject or accept navigate to same current component.
  routes,
  /* eslint-disable-next-line no-undef  */
  /* verbose: TNS_ENV !== 'production' */ // <-- Optional. Will output the warnings to console.
})

export default router
