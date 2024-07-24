const { showUser } = require("~/sqlite/database");
import bcrypt from "bcryptjs";
import localStorage from "nativescript-localstorage";

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
        const password = modelUser.password;
        const userDb = await showUser(user);
        if (Object.keys(userDb.data).length > 0) {
          const isValid = await bcrypt.compare(password, userDb.data.password);
          if (isValid) {
            commit("setUser", userDb.data);
            commit("setModules", userDb.data.modules);
            commit("setLogout", true);
            // Guardar un valor
            localStorage.setItem("user", JSON.stringify(userDb.data));
            localStorage.setItem("autenticate", state.logout);
            return {
              status: 200,
              message: `success. `,
              error: "Exitoso",
            };
          } else {
            return {
              status: 400,
              message: `la Contraseña ingresada no coincide o esta mal escrita. `,
              error: "Contraseña Invalida",
            };
          }
        } else {
          return {
            status: 400,
            message: `Nombre de usuario no existe o esta mal escrito. `,
            error: "Usuario Invalido",
          };
        }
      } catch (error) {
        console.log("ERROR AL VERIFICARF USUARIO ", error);
      }
    },

    async islogout({ commit }) {
      try {
        commit("setUser", {});
        commit("setModules", []);
        commit("setLogout", false);
        localStorage.clear();
      } catch (error) {}
    },

    async isActive({ commit, state }) {
      try {
        const user = localStorage.getItem("user");
        const logout = localStorage.getItem("autenticate");
        console.log("user ", user.length);
        console.log("logg", logout.length);
        const autenticate = await JSON.parse(logout);
        const user_active = await JSON.parse(user);
        if (user_active != null && autenticate === true) {
          commit("setUser", user_active);
          commit("setModules", user_active.modules);
          commit("setLogout", autenticate);

          return true;
        }

        return false;
      } catch (error) {}
    },
  },
};
