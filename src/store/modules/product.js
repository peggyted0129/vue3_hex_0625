import axios from 'axios'

export default {
  namespaced: true,
  state: {
    products: [],
    product: {}
  },
  actions: {
    getProducts (context) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`
      context.commit('LOADING', true, { root: true })
      axios.get(api).then((response) => {
        context.commit('GET_PRODUCTS', response.data.products)
        context.commit('LOADING', false, { root: true })
      })
    },
    getProduct (context, id) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`
      context.commit('LOADING', true, { root: true })
      axios.get(api).then((response) => {
        context.commit('GET_PRODUCT', response.data.product)
        context.commit('LOADING', false, { root: true })
      })
    }
  },
  mutations: {
    GET_PRODUCTS (state, payload) {
      state.products = payload
    },
    GET_PRODUCT (state, payload) {
      state.product = payload
    }
  },
  getters: {
    products: (state) => state.products,
    product: (state) => state.product
  }
}
