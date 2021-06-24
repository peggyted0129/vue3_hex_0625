import { createStore } from 'vuex'
import alertModules from '@/store/modules/alertMessage'
import productModules from '@/store/modules/product'

export default createStore({
  strict: true,
  state: {
    isLoading: false
  },
  actions: {
    updateLoading (context, status) {
      context.commit('LOADING', status)
    }
  },
  mutations: {
    LOADING (state, status) {
      state.isLoading = status
    }
  },
  getters: {
    isLoading: (state) => state.isLoading
  },
  modules: {
    alertModules,
    productModules
  }
})
