const { showUser } = require("~/sqlite/database");

import { enc, SHA256 } from "crypto-js";

export default {
  namespaced: true,
  state: {
    user: {},
    users: [],
    modules: [],
    logout: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    setUsers(state, payload) {
      state.users = payload;
    },

    setModules(state, payload) {
      state.modules = payload;
    },
  },
  actions: {
    async isLogin({ commit, state }, modelUser) {
      const user = modelUser.user;
      const password = modelUser.password

      const userDb = await showUser(user);
      console.log("state ", modelUser);

      // Ejemplo de uso
      /* const password = "password123"; */
      const encryptedPassword = SHA256(password).toString(enc.Hex);
      console.log("crypto ", encryptedPassword);
      /* const username = state.users.find(prev => prev.username === user) */
      if (userDb) {
        commit("setUser", userDb);
        return { state: false, test: "prueba" };
      }
    },
  },
};
