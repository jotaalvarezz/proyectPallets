const {
  showUser
} = require("~/sqlite/database");

export default {
  namespaced: true,
  state: {
    user: {},
    users: [],
    modules: [],
    logout: false
  },
  mutations: {


    setUser(state, payload) {
      state.user = payload
    },

    setUsers(state, payload) {
      state.users = payload
    },

    setModules(state, payload) {
      state.modules = payload
    }
  },
  actions: {
    async isLogin({ commit, state }, modelUser) {
      const user = modelUser.user
      const password = modelUser.password

      const userDb = await showUser(user)
      console.log("state ", modelUser)
      /* const username = state.users.find(prev => prev.username === user) */
      if (userDb) {
        commit('setUser', userDb)
        return { state: false, test: "prueba" }
      }
    }
  }
}
