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

    setLogout(state, payload) {
      state.logout = payload;
    },
  },
  actions: {
    async isLogin({ commit, state }, modelUser) {
      try {
        const user = modelUser.user;
        const password = modelUser.password
        const userDb = await showUser(user);
        const encryptedPassword = SHA256(password).toString(enc.Hex);
        if (userDb) {
          if (encryptedPassword === userDb.data.password) {
            commit("setUser", userDb.data);
            commit("setModules", userDb.data.modules);
            commit("setLogout", true);
          }
        }
      } catch (error) {}
    },

    async islogout({ commit }) {
      try {
        commit("setUser", {});
        commit("setModules", []);
        commit("setLogout", false);
      } catch (error) {}
    },
  },
};
