import Vue from "nativescript-vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    shipsWarehouses:[],
    instance: {},
    count: 0,
    item: {},
    collection:[],
    welcome: "Bienvenido Rey Cabro",
  },
  mutations: {
    increment(state) {
      state.count++;
    },

    async loadingInstance(state, payload){
      state.instance = await payload
    },

    saveShipsWarehouses(state, payload){
      state.shipsWarehouses = payload
    },

    saveItem(state, payload) {
      state.item = payload;
    },

    saveCollection(state, payload){
      state.collection = payload;
    }
  },
});

export default store;
