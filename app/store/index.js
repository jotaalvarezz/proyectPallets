import Vue from "nativescript-vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    item: {},
    welcome: "Bienvenido Rey Cabro",
  },
  mutations: {
    increment(state) {
      state.count++;
    },

    saveItem(state, payload) {
      state.item = payload;
    },
  },
});

export default store;
