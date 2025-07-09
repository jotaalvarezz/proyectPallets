import { storeContainerReport } from "~/sqlite/database"

export default {
  namespaced: true,
  state: {
    managementModel:{},
    containerReport:{},
    containerReportEdit: false,
    damagedItems:[]
  },
  mutations: {
    setManagementModel(state, payload){
      state.managementModel = payload
    },

    setContainerReportEdit(state, payload){
      state.containerReportEdit = payload
    },

    setContainerReport(state, payload){
      state.containerReport = payload
    },

    setDamagedItem(state, payload){
      state.damagedItems.push(payload)
    },

    cleanDamagedItems(state){
      state.damagedItems = []
    },

    cleanManagementModel(state){
      state.managementModel = {}
    }
  },
  actions: {

  }
}
