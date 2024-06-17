export default {
  namespaced: true,
  state: {
    close: false
  },
  mutations: {
    closeManagement(state, payload){
      state.close = payload
    }
  },
  actions: {},
};
