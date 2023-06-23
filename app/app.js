import Vue from "nativescript-vue";
import Home from "./views/Home";
import store from "./store/index";
import router from "./Routes/Routes";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

Vue.use(RadSideDrawer);

import { TNSFontIcon, fonticon } from "nativescript-fonticon";

import { CheckBox } from "@nstudio/nativescript-checkbox";
Vue.registerElement("CheckBox", () => CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange",
  },
});

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

TNSFontIcon.debug = true; // Opcionalmente, puedes habilitar el modo de depuración

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
