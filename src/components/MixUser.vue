<script>
export default {
  name: 'MixUser',
  data () {
    return {
      loadingStatus: { // 讀取效果
        loadingItem: ''
      },
      // session 購物車列表
      carData: JSON.parse(sessionStorage.getItem('carData')) || [],
      cart: { // GET | 購物車 api 列表
        carts: []
      },
      cartLength: 0 // GET | 購物車列表陣列筆數
    }
  },
  computed: { // 購物車總計
    totalPrice () {
      const vm = this
      const price = []
      vm.carData.forEach((item) => {
        price.push(parseInt(item.price * item.qty))
      })
      return price.reduce(function (total, e) {
        return total + e
      }, 0)
    }
  },
  methods: {
    getCarts () { // GET | 購物車列表
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(api).then((res) => {
        vm.cart = res.data.data
        vm.cartLength = vm.cart.carts.length
        console.log('購物車列表', vm.cart)
        vm.$store.dispatch('updateLoading', false)
      })
    },
    addlocalCarts (product, num = 1) { // 加入 seesion 購物車資料
      const vm = this
      const cacheCarID = []
      vm.carData.forEach((item) => {
        cacheCarID.push(item.product_id)
      })
      vm.toastTopEnd(`${product.title} 加入購物車`, 'success')
      if (cacheCarID.indexOf(product.id) === -1) {
        const cartContent = {
          product_id: product.id,
          qty: num,
          title: product.title,
          imageUrl: product.imageUrl,
          unit: product.unit,
          origin_price: product.origin_price,
          price: product.price,
          category: product.category
        }
        vm.carData.push(cartContent)
        sessionStorage.setItem('carData', JSON.stringify(vm.carData))
      } else {
        let cache = {}
        vm.carData.forEach((item, key) => {
          if (item.product_id === product.id) {
            let { qty } = item
            cache = {
              product_id: product.id,
              qty: qty += num,
              title: product.title,
              imageUrl: product.imageUrl,
              unit: product.unit,
              origin_price: product.origin_price,
              price: product.price,
              category: product.category
            }
            vm.carData.splice(key, 1)
          }
        })
        vm.carData.push(cache)
        sessionStorage.setItem('carData', JSON.stringify(vm.carData))
      }
    },
    delLocalCart (cart) { // 刪除 seesion 購物車資料
      const vm = this
      vm.carData.filter((item, key) => {
        if (item.product_id === cart.product_id) {
          vm.carData.splice(key, 1)
          sessionStorage.setItem('carData', JSON.stringify(vm.carData))
          vm.toastTopEnd('已移除購物車', 'success')
        }
      })
    },
    delAllLocalCarts () { // 刪除 seesion 全部購物車資料
      sessionStorage.removeItem('carData')
      this.carData = JSON.parse(sessionStorage.getItem('carData')) || []
    },
    // 加入 API 購物車
    delSessionCart () {
      this.carData = [] // 清空初始化購物車 session 內容
      sessionStorage.removeItem('carData') // 清空 seesion 購物車資料
      console.log('4. 清空 session 購物車全部內容')
      this.getCarts()
      this.$router.push('/checkout/order_create')
    },
    postCarts () {
      this.coupon_code = ''
      this.$store.dispatch('updateLoading', true)
      const delApi = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/carts`
      const postapi = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      this.$http.delete(delApi).then(() => { // 1. delete | 購物車列表
        console.log('1. 清空 API 購物車全部品項')
        this.carData.forEach((item, index) => { // 2. 取出購物車列表重組資料
          const cache = {
            product_id: item.product_id,
            qty: item.qty
          }
          console.log('2. 重組購物車、得到 cache', cache)
          return this.$http.post(postapi, { data: cache }).then(() => { // 3. POST | 購物車
            console.log('產品索引', index, 'POST 購物車成功')
            setTimeout(() => {
              if ((this.carData.length - 1) === index) { // 4. 清空 session 購物車
                console.log('3. 跑到最後一個 index', index, '準備倒數5秒清空 session 購物車')
                this.delSessionCart()
                this.$store.dispatch('updateLoading', false)
              }
            }, 5000)
          })
        })
      })
    },
    removeCartItem (id) { // Delete | "單筆" 購物車資料
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      vm.$store.dispatch('updateLoading', true)
      vm.axios.delete(api)
        .then((res) => {
          if (res.data.success) {
            vm.toastTopEnd(res.data.message, 'success')
            vm.$store.dispatch('updateLoading', false)
            vm.getCarts()
          } else {
            vm.toastTopEnd(res.data.message, 'error')
            vm.$store.dispatch('updateLoading', false)
          }
        })
        .catch((err) => {
          vm.$swal({ title: err.data.message, icon: 'error' })
          vm.$store.dispatch('updateLoading', false)
        })
    },
    deleteAllCarts () { // Delete | "全部" 購物車資料
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/carts`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.delete(api)
        .then((res) => {
          console.log('刪除全部商品', res.data)
          if (res.data.success) {
            vm.toastTopEnd('購物車商品已全部刪除', 'success')
            vm.getCarts()
          } else {
            vm.toastTopEnd(res.data.message, 'error')
          }
          vm.$store.dispatch('updateLoading', false)
        })
        .catch((err) => {
          vm.$swal({ title: err.data.message, icon: 'error' })
          vm.$store.dispatch('updateLoading', false)
        })
    },
    cartBtn (status, item) { // Cart.vue: 購物車 add、minus 按鈕
      const vm = this
      if (status === 'add') {
        vm.carData.filter((filterItem) => {
          if (filterItem.product_id === item.product_id) {
            filterItem.qty = filterItem.qty + 1
          }
          sessionStorage.setItem('carData', JSON.stringify(vm.carData))
        })
      } else if (status === 'minus') {
        if (item.qty <= 1) { return }
        vm.carData.filter((filterItem) => {
          if (filterItem.product_id === item.product_id) {
            filterItem.qty = filterItem.qty - 1
          }
          sessionStorage.setItem('carData', JSON.stringify(vm.carData))
        })
      }
    },
    productCartBtn (status) { // Product.vue: 購物車 add、minus 按鈕
      if (status === 'add') {
        this.num += 1
      } else if (status === 'minus') {
        this.num -= 1
      }
    },
    toastTopEnd (msg, icon) {
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: icon,
        title: msg
      })
    }
  },
  created () {
    //
  }
}
</script>
