export default {
  namespaced: true,
  state: {
    close: false,
    type: false,
    StoreTypeManagementId:null
  },
  mutations: {
    closeManagement(state, payload){
      state.close = payload;
    },
    setType(state, payload){
      state.type = payload;
    },
    setTypeMangement(state, payload){
      state.StoreTypeManagementId = payload
    }
  },
  actions: {},
};
