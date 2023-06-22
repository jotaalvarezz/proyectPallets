import Vue from 'nativescript-vue'

import NSVueRouter from 'nativescript-vue-router-ns'

import Warehouse from '~/views/Warehouses/Warehouses'
import Ship from '~/views/ships/Ships'
import palletsWarehouse from '~/views/tabview/palletsWarehouse/PalletsWarehouse'
import Pallets from '~/views/pallets/Pallets'

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
    name:'palletswarehouse.index',
    component: palletsWarehouse,
    meta: { guest: true }
  },
  {
    name:'pallets.index',
    component: Pallets,
    meta: { guest: true }
  }
]

const router = new NSVueRouter({
 // ignoreSame,  <-- Optional. Will set if reject or accept navigate to same current component.
  routes,
  /* eslint-disable-next-line no-undef  */
  /* verbose: TNS_ENV !== 'production' */ // <-- Optional. Will output the warnings to console.
})

export default router
