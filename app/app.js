import Vue from 'nativescript-vue'
import Home from './views/Home'
import Store from './store/index'
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

Vue.use(RadSideDrawer);

import { TNSFontIcon, fonticon } from 'nativescript-fonticon';

Vue.registerElement(
  'Fab',
  () => require('@nstudio/nativescript-floatingactionbutton').Fab
);

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

TNSFontIcon.debug = true; // Opcionalmente, puedes habilitar el modo de depuración

TNSFontIcon.paths = {
  fa: './assets/all.css',
  mdi: './assets/fontawesome.css',
  // Agrega aquí las rutas a tus archivos CSS de fuentes de iconos adicionales
};

TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);

new Vue({
  /* render: (h) => h('frame', [h(Home)]), */
  render: (h) => h(Home),
  Store
}).$start()
