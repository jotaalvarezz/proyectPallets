import Vue from "nativescript-vue";
import Vuex from "vuex";
import evidenceStore from '~/store/Modules/evidenceStore'
import auth from "./Modules/auth";
import managementStore from "./Modules/managementStore";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showError: false,
    shipsWarehouses: [],
    indicator: false,
    instance: {},
    count: 0,
    item: {},
    ship: {},
    collection: [],
    recharge: true
  },
  mutations: {
    increment(state) {
      state.count++;
    },

    indicatorState(state, payload) {
      state.indicator = payload
    },

    async loadingInstance(state, payload) {
      state.instance = await payload
    },

    saveShipsWarehouses(state, payload) {
      state.shipsWarehouses = payload
    },

    saveItem(state, payload) {
      state.item = payload;
    },

    setShip(state, payload) {
      state.ship = payload
    },

    saveCollection(state, payload) {
      state.collection = payload;
    },

    setShowError(state, payload) {
      state.showError = payload
    },

    setRecharge(state, payload){
      state.recharge = payload
    }
  },

  modules: {
    evidenceStore,
    auth,
    managementStore
  },
});

export default store;
