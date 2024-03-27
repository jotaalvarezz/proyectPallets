export default {
  namespaced: true,
  state: {
    managementModel:{},
    damagedItems:[]
  },
  mutations: {
    setManagementModel(state, payload){
      state.managementModel = payload
    },

    setDamagedItem(state, payload){
      state.damagedItems.push(payload)
    },

    cleanDamagedItems(state){
      state.damagedItems = []
    }
  },
  actions: {

  }
}
