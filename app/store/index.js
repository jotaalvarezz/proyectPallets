import Vue from "nativescript-vue";
import Vuex from "vuex";
import evidenceStore from '~/store/Modules/evidenceStore'

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
  },
  mutations: {
    increment(state) {
      state.count++;
    },

    indicatorState(state, payload) {
      console.log("payload ", payload)
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
    }
  },

  modules: {
    evidenceStore
  },
});

export default store;
