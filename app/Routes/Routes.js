import Vue from 'nativescript-vue'

import NSVueRouter from 'nativescript-vue-router-ns'
import store from '~/store/Modules/auth'

import Warehouse from '~/views/Warehouses/Warehouses'
import Ship from '~/views/ships/Ships'
import GeneralPallets from '~/views/generalPallets/GeneralPallets.vue'
import Pallets from '~/views/pallets/Pallets'
import CreateEditPallet from '~/views/pallets/CreateEditPallet/CreateEditPallet'
import Evidence from '~/views/evidence/Evidence.vue'
import NavViews from '~/views/evidence/tabview/NavViews.vue'
import ManagementForm from '~/views/evidence/managementForm/ManagementForm'
import ContainerReportList from '~/views/evidence/containerReport/ContainerReportList.vue'
import EvidenceList from '~/views/evidence/EvidenceList.vue'
import Login from '~/views/Login'

Vue.use(NSVueRouter)

const routes = [
  {
    name: 'warehouses.index',
    component: Warehouse,
    meta: { auth: true }
  },
  {
    name: 'ship.index',
    component: Ship,
    meta: { auth: true }
  },
  {
    name: 'generalpallets.index',
    component: GeneralPallets,
    meta: { auth: true }
  },
  {
    name: 'pallets.index',
    component: Pallets,
    meta: { auth: true }
  },
  {
    name: 'editpallets.index',
    component: CreateEditPallet,
    meta: { auth: true }
  },
  {
    name: 'reportsnav.index',
    component: NavViews,
    meta: { auth: true }
  },
  {
    name: 'evidence.index',
    component: Evidence,
    meta: { auth: true },
  },
  {
    name: 'verification.details',
    component: ManagementForm,
    meta: { auth: true }
  },
  {
    name: 'container_report.index',
    component: ContainerReportList,
    meta: { auth: true }
  },
  {
    name: 'evidence_list.show',
    component: EvidenceList,
    meta: { auth: true }
  },
  {
    name: 'login.index',
    component: Login,
    meta: { guest: true }
  }
]

const router = new NSVueRouter({
  // ignoreSame,  <-- Optional. Will set if reject or accept navigate to same current component.
  routes,
  /* eslint-disable-next-line no-undef  */
  /* verbose: TNS_ENV !== 'production' */ // <-- Optional. Will output the warnings to console.
})

const user = () => {
  return false;
}

router.beforeEach((to, next) => {
  let isLogged = store.state.logout
  console.log("logged", isLogged)
  if (to.meta.auth && !isLogged) {
    console.log("Redirigir a login porque el usuario no está autenticado")
    router.push('login.index')
  } else if (to.meta.guest && isLogged) {
    console.log("Redirigir a dashboard porque el usuario ya está autenticado")
    router.push('ship.index')
  } else {
    console.log("Permitir acceso a la ruta")
    next()
  }
})


export default router
