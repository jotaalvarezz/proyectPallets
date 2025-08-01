import Vue from "nativescript-vue";
import Home from "./views/Home";
import store from "./store/index";
import router from "./Routes/Routes";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import GlobalComponents from "./globalComponents";

Vue.use(GlobalComponents)
Vue.use(RadSideDrawer);

import BottomSheetPlugin from '@nativescript-community/ui-material-bottomsheet/vue';
import { install } from "@nativescript-community/ui-material-bottomsheet";
install();

Vue.use(BottomSheetPlugin);

import { TNSFontIcon, fonticon } from "nativescript-fonticon";

import { CheckBox } from "@nstudio/nativescript-checkbox";
Vue.registerElement("CheckBox", () => CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange",
  },
});

import { DrawingPad } from '@nativescript-community/drawingpad';
Vue.registerElement('DrawingPad', () => DrawingPad);

// Material Tabs
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue';
Vue.use(TabsPlugin);

Vue.registerElement(
  "Fab",
  () => require("@nstudio/nativescript-floatingactionbutton").Fab
);

Vue.registerElement(
  "CardView",
  () => require("@nstudio/nativescript-cardview").CardView
);

Vue.registerElement(
  "DropDown",
  () => require("nativescript-drop-down/drop-down").DropDown
);

Vue.registerElement(
  "BarcodeScanner",
  () => require("nativescript-barcodescanner").BarcodeScannerView
);

Vue.registerElement(
  "Carousel",
  () => require("@nstudio/nativescript-carousel").Carousel
);

Vue.registerElement(
  "CarouselItem",
  () => require("@nstudio/nativescript-carousel").CarouselItem
);

TNSFontIcon.debug = false; // Opcionalmente, puedes habilitar el modo de depuración

TNSFontIcon.paths = {
  fa: "./assets/all.css",
  mdi: "./assets/fontawesome.css",
  // Agrega aquí las rutas a tus archivos CSS de fuentes de iconos adicionales
};

TNSFontIcon.loadCss();

Vue.filter("fonticon", fonticon);

new Vue({
  /* render: (h) => h('frame', [h(Home)]), */
  router,
  render: (h) => h(Home),
  store,
}).$start();
