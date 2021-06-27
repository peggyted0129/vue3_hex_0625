import { createStore } from 'vuex'
import alertModules from '@/store/modules/alertMessage'
import productModules from '@/store/modules/product'

export default createStore({
  strict: true,
  state: {
    isLoading: false,
    orderStep: 'create'
  },
  actions: {
    updateLoading (context, status) {
      context.commit('LOADING', status)
    },
    setOrderStep (context, step) {
      context.commit('SET_ORDER_STEP', step)
    }
  },
  mutations: {
    LOADING (state, status) {
      state.isLoading = status
    },
    SET_ORDER_STEP (state, payload) {
      state.orderStep = payload
    }
  },
  getters: {
    isLoading: (state) => state.isLoading,
    orderStep: (state) => state.orderStep
  },
  modules: {
    alertModules,
    productModules
  }
})
