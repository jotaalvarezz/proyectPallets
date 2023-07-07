import Vue from "nativescript-vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    shipsWarehouses:[],
    count: 0,
    item: {},
    collection:[],
    welcome: "Bienvenido Rey Cabro",
  },
  mutations: {
    increment(state) {
      state.count++;
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
