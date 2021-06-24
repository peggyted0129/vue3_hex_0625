<script>
export default {
  name: 'MixUser',
  data () {
    return {
      loadingStatus: { // 讀取效果
        loadingItem: ''
      },
      carData: JSON.parse(sessionStorage.getItem('carData')) || []
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
      })
    }
  },
  methods: {
    addlocalCarts (product, num = 1) {
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
    delLocalCart (cart) {
      const vm = this
      vm.carData.filter((item, key) => {
        if (item.product_id === cart.product_id) {
          vm.carData.splice(key, 1)
          sessionStorage.setItem('carData', JSON.stringify(vm.carData))
          vm.toastTopEnd('已移除購物車', 'success')
        }
      })
    },
    delAllLocalCarts () { // 刪除 seesion 資料
      sessionStorage.removeItem('carData')
      this.carData = JSON.parse(sessionStorage.getItem('carData')) || []
    },
    cartBtn (status, item) { // Cart.vue
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
    productCartBtn (status) { // Product.vue
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
    },
    addCart (id, qty = 1) { // === 預計刪除
      const vm = this
      // vm.loadingStatus.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      vm.$http.post(api, { data: cart }).then((res) => {
        console.log('加入購物車', res.data, cart)
        // vm.loadingStatus.loadingItem = ''
        vm.toastTopEnd(res.data.message, 'success')
        // vm.getCart() // 重新取得購物車列表
      })
    }
  },
  created () {
    //
  }
}
</script>
