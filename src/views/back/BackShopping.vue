<template>
<section class="py-20">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <div class="container-fluid px-13">
    <h2 class="fw-bolder">產品列表</h2>
    <!--- 商品卡片 --->
    <div class="row mt-9">
      <div class="col-md-3 mb-7" v-for="item in products" :key="item.id">
        <a href="#" class="product-card" @click.prevent="openModal(item)">
          <div class="card position-relative back-card-shadow border-0 card-radius">
            <div style="height: 300px; background-size: contain; background-position: center; background-repeat: no-repeat;"
              :style="{backgroundImage: `url(${item.imageUrl})`}">
            </div>
            <div class="card-bg d-flex align-items-center">
              <p class="text-white fw-bolder p-8">{{ item.description }}</p>
            </div>
            <div class="card-body bg-light p-4" style="height: 100px">
              <div class="d-flex justify-content-between mb-3">
                <h5 class="card-title mb-0 text-theme fw-bolder">{{ item.title }}</h5>
                <span class="badge bg-secondary align-self-center">{{ item.category }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-baseline">
                <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                <del class="h6 text-streak" v-if="item.price">NT$ {{ item.origin_price }} 元</del>
                <div class="h5 text-danger fw-bolder" v-if="item.price">NT$ {{ item.price }} 元</div>
              </div>
            </div>
            <div class="card-footer position-relative bg-light d-flex align-items-center p-7">
              <button type="button" @click.stop.prevent="addlocalCarts(item)" class="btn position-absolute start-0 zindex-1 border-end btn-product-card hvr-bounce-to-right py-2 px-0 w-50">
                <i :class="{ 'disappear' : item.id === loadingStatus.loadingItem }" class="fas fa-shopping-cart me-1"></i>
                <i v-if="item.id === loadingStatus.loadingItem" class="fas fa-spinner fa-pulse me-1"></i>
                加到購物車
              </button>
              <button type="button" @click.prevent="openModal(item)" class="btn position-absolute zindex-1 end-0 hvr-icon-wobble-vertical btn-product-card py-2 px-0 w-50">
                <i class="fas fa-file-alt hvr-icon me-1"></i>
                詳細資訊
              </button>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- pagination -->
    <div class="d-flex my-5 justify-content-center">
      <Pagination :pages="pagination" @get-product="getProducts"></Pagination>
    </div>
    <!-- 購物車列表 -->
    <div class="container my-15">
      <!-- 購物車列表 - session 內容 -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h3 class="text-theme fw-bolder">購物車清單
        </h3>
        <button @click="delAllLocalCarts" class="btn btn-outline-danger" type="button" v-if="carData.length > 0">清空 session 購物車</button>
      </div>
      <p>這是暫存在 session 裡的購物車內容 (將在送出顧客表單後清空...)</p>
      <div class="row">
        <div class="col-12">
          <div v-if="carData.length == 0" class="empty fw-bolder d-flex align-items-center justify-content-center">
            <div>
              <p>您的購物車現在沒有商品喔，快去購物吧!!</p>
            </div>
          </div>
          <ul v-if="carData.length > 0" class="order py-4 px-0 p-sm-4">
            <li class="orderList" v-for="item in carData" :key="item.product_id">
              <div class="row flex-wrap">
                <div class="col-3 col-md-2 px-0 px-md-0">
                  <router-link :to="{ name: 'ProductDetail', params: { id: item.product_id }}" class="orderImg">
                    <img :src="item.imageUrl" alt="cart-item">
                  </router-link>
                </div>
                <div class="col-8 col-md-9 px-0">
                  <div class="row mx-3 w-100">
                    <div class="col-12 col-md-3 pb-3 px-0">
                      <div class="orderTitle fw-bolder pt-md-9">{{ item.title }}</div>
                    </div>
                    <div class="col-md-2 pb-3 px-0">
                      <div class="pt-md-9 ms-md-3">NT$ {{ item.price }}</div>
                    </div>
                    <div class="col-12 col-md-4 pb-3 px-0 pt-md-9">
                      <!-- +、- 按鍵 -->
                      <div class="orderNum">
                        <div class="input-group justify-content-start align-items-center">
                          <button type="button" @click="cartBtn('minus', item)" :disabled="item.qty === 1" class="input-group-text">
                            <i class="fas fa-minus"></i>
                          </button>
                          <p class="form-control text-center m-0 cartNum py-2 px-2">{{ item.qty }}</p>
                          <button type="button" @click="cartBtn('add', item)" class="input-group-text">
                            <i class="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-3 pt-md-9 text-end">
                      <div class="orderTotal">小計 ${{ item.qty * item.price }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-1 orderDel px-0 pt-md-9 text-center text-sm-end">
                  <div class="pe-2" @click="delLocalCart(item)">
                    <i class="far fa-trash-alt"></i>
                  </div>
                </div>
              </div>
            </li>
            <li class="orderList border-0 mb-0">
              <div class="row">
                <div class="col-4 col-sm-6 text-end"> 共 {{ carData.length }} 項</div>
                <div class="col-3 col-sm-3 text-end fw-bolder text-sgreen">總計</div>
                <div class="col-4 col-sm-2 text-end fw-bolder text-sgreen p-0">NT$ {{ totalPrice }}</div>
                <div class="col-1 p-0"></div>
              </div>
            </li>
          </ul>
          <div v-if="carData.length > 0" class="d-flex justify-content-end align-items-center w-100 text-end mt-7">
            <p>( 按下 "前往結帳" 後，<span class="text-sgreen fw-bolder">將跳轉至 Order 頁面</span> | <span class="text-sgreen fw-bolder">上一個未結帳的購物車內容</span>也會清空 )</p>
            <button type="button" @click="postCarts" class="cart-footer-btn btn btn-sgreen text-white hvr-float ms-5" style="width:250px">
              加入購物車，結帳去!<i class="fas fa-angle-double-right ms-3"></i>
            </button>
          </div>
        </div>
      </div>
      <hr class="my-12">
      <!-- 購物車列表 - 加入 API 後的內容 -->
      <div class="d-flex align-items-center justify-content-between mt-10 mb-4">
        <h3 class="text-theme fw-bolder">購物車確定，準備結帳!! <span class="h6 text-sgreen ms-5 fw-bolder">( 優惠券 8 折碼 : HappyCoupon )</span><span class="h6 text-sgreen ms-5 fw-bolder">( 優惠券 7 折碼 : CoolCoupon )</span></h3>
        <button @click="deleteAllCarts" class="btn btn-outline-danger" type="button" v-if="cartLength > 0">清空購物車</button>
      </div>
      <p>這是上一筆的購物車內容</p>
      <div class="row">
        <div class="col-12">
          <div v-if="cartLength == 0" class="empty fw-bolder d-flex align-items-center justify-content-center">
            <div>
              <p>還沒有商品要結帳喔，快把我買下吧!!</p>
            </div>
          </div>
          <ul v-if="cartLength > 0" class="order py-4 px-0 p-sm-4">
            <li class="orderList" v-for="item in cart.carts" :key="item.product_id">
              <div class="row flex-wrap">
                <div class="col-3 col-md-2 px-0 px-md-0">
                  <img :src="item.product.imageUrl" alt="cart-item" style="width:90px; height:90px">
                </div>
                <div class="col-8 col-md-9 px-0">
                  <div class="row mx-3 w-100">
                    <div class="col-12 col-md-3 pb-3 px-0">
                      <div class="orderTitle fw-bolder pt-md-9">{{ item.product.title }}</div>
                    </div>
                    <div class="col-md-2 pb-3 px-0">
                      <div class="pt-md-9 ms-md-3">NT$ {{ item.product.price }}</div>
                    </div>
                    <div class="col-12 col-md-1 pb-3 px-0 pt-md-9">
                      <div>{{ item.qty }} {{ item.product.unit }}</div>
                    </div>
                    <div class="col-12 col-md-2 pt-md-9 text-end">
                      <div class="orderTotal">總原價 ${{ item.total }}</div>
                    </div>
                    <!-- 沒有套用優惠券 -->
                    <div v-if="item.total === item.final_total" class="col-12 col-md-4 pt-md-9 text-end">
                      <div class="orderTotal text-danger fw-bolder">尚未套用優惠券</div>
                    </div>
                    <!-- 有套用優惠券 -->
                    <div v-if="item.total !== item.final_total" class="col-12 col-md-4 pt-md-9 text-end">
                      <div class="orderTotal fw-bolder">套用優惠券小計 ${{ getDiscount(item.final_total) }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-1 orderDel px-0 pt-md-9 text-center text-sm-end">
                  <div class="pe-2" @click="removeCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                  </div>
                </div>
              </div>
            </li>
            <li class="orderList border-0 mb-0">
              <div class="row align-items-center">
                <!-- 套用優惠碼 -->
                <div class="col-4 col-sm-4">
                  <div class="input-group mb-3">
                    <input type="text" v-model.trim="coupon_code" class="form-control" placeholder="請輸入優惠碼" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button @click="addCouponCode" class="btn btn-theme hvr-bounce-to-right" type="button">套用優惠碼</button>
                  </div>
                </div>
                <div class="col-2 col-sm-2 text-end"> 共 {{ cartLength }} 項</div>
                <div class="col-1 col-sm-2 text-end">總計 NT$ {{ cart.total }}</div>
                <div v-if="cart.total === cart.final_total" class="col-4 col-sm-3 text-end fw-bolder text-danger p-0">尚未套用優惠券</div>
                <div v-if="cart.total !== cart.final_total" class="col-4 col-sm-3 text-end fw-bolder text-sgreen p-0">套用優惠券總計 NT$ {{ getDiscount(cart.final_total) }}</div>
                <div class="col-1 p-0"></div>
              </div>
            </li>
          </ul>
          <div class="w-100 text-end">
            <button type="button" v-if="cartLength > 0" class="cart-footer-btn btn btn-sgreen text-white hvr-float mt-7">
              這按鈕無效果<i class="fas fa-angle-double-right ms-3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 顧客資料 -->
    <Form @submit="createOrder" ref="form" class="row g-3 mt-5 mx-auto" v-slot="{ errors }" style="max-width:800px">
      <div class="col-md-4">
        <label for="姓名" class="form-label">姓名<span class="text-danger" style="padding-left: 3px;">*</span></label>
        <Field  v-model="form.user.name" type="text" class="form-control" id="姓名" name="姓名" :class="{ 'is-invalid': errors['姓名'] }" rules="required" placeholder="請輸入姓名" />
        <error-message name="姓名" class="invalid-feedback"></error-message>
      </div>
      <div class="col-md-4">
        <label for="手機" class="form-label">手機<span class="text-danger" style="padding-left: 3px;">*</span></label>
        <Field v-model="form.user.tel" type="tel" :rules="isPhone" :class="{ 'is-invalid': errors['手機'] }" class="form-control" id="手機" name="手機" placeholder="請輸入手機" />
        <error-message name="手機" class="invalid-feedback"></error-message>
      </div>
      <div class="col-md-4">
        <label for="email" class="form-label">Email<span class="text-danger" style="padding-left: 3px;">*</span></label>
        <Field v-model="form.user.email" type="email" :class="{ 'is-invalid': errors['email'] }" rules="email|required" class="form-control" id="email" name="email" placeholder="請輸入 email" />
        <error-message name="email" class="invalid-feedback"></error-message>
      </div>
      <div class="col-12">
        <label for="地址" class="form-label">地址<span class="text-danger" style="padding-left: 3px;">*</span></label>
        <Field v-model="form.user.address" :class="{ 'is-invalid': errors['地址'] }" rules="required" type="text" class="form-control" id="地址" name="地址" placeholder="請輸入地址" />
        <error-message name="地址" class="invalid-feedback"></error-message>
      </div>
      <div class="mb-3">
        <label for="留言" class="form-label">留言</label>
        <textarea name="留言" id="留言" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-hgray hvr-bounce-to-right">送出訂單</button>
      </div>
    </Form>
    <!---=========================--->
  </div>
  <!-- Modal -->
  <user-product-modal ref="userProductModal" :product="product" :loading-status="loadingStatus" @add-local-carts="addlocalCarts"></user-product-modal>
</section>
</template>
<script>
import userProductModal from '@/components/back/UserProductModal.vue'
import Pagination from '@/components/Pagination.vue'
import MixUser from '@/components/MixUser.vue'
import { mapGetters } from 'vuex'

export default {
  mixins: [MixUser],
  components: {
    userProductModal,
    Pagination
  },
  data () {
    return {
      pagination: {},
      products: [], // 產品列表
      product: {}, // props 傳遞到內層的暫存資料
      form: { // 表單結構
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  methods: {
    // 因為要 addlocalCarts 後關閉 modal，所以要另外寫
    addlocalCarts (product, num = 1) {
      const vm = this
      vm.$refs.userProductModal.hideModal()
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
    getProducts (page = 1) {
      const vm = this
      vm.$store.dispatch('updateLoading', true)
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`
      vm.$http.get(api).then((res) => {
        console.log('產品 All 列表', res.data)
        if (res.data.success) {
          vm.$store.dispatch('updateLoading', false)
          vm.products = res.data.products
          vm.pagination = res.data.pagination
        } else {
          vm.toastTopEnd(res.data.message, 'error')
        }
      })
    },
    updateCart (id, qty) {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      vm.$store.dispatch('updateLoading', true)
      const cart = {
        product_id: id,
        qty
      }
      vm.$http.put(api, { data: cart }).then((res) => {
        if (res.data.success) {
          vm.toastTopEnd(res.data.message, 'success')
          vm.$store.dispatch('updateLoading', false)
          vm.getCarts()
        } else {
          vm.toastTopEnd(res.data.message, 'error')
          vm.$store.dispatch('updateLoading', false)
        }
      })
    },
    openModal (item) {
      const vm = this
      console.log(item)
      vm.$store.dispatch('updateLoading', true)
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${item.id}`
      vm.$http.get(api).then((res) => {
        vm.$store.dispatch('updateLoading', false)
        vm.product = res.data.product
        vm.$refs.userProductModal.openModal()
      })
    },
    createOrder () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`
      const order = vm.form
      vm.$store.dispatch('updateLoading', true)
      if (vm.cart.carts.length === 0) {
        vm.$store.dispatch('updateLoading', false)
        vm.toastTopEnd('購物車空空的哦...，無法送出訂單', 'error')
      } else {
        vm.$http.post(api, { data: order })
          .then((res) => {
            if (res.data.success) {
              vm.$store.dispatch('updateLoading', false)
              console.log(res.data)
              vm.toastTopEnd(res.data.message, 'success')
              vm.getCarts()
              vm.$refs.form.resetForm() // 清空欄位
              vm.form.message = ''
            } else {
              vm.toastTopEnd(res.data.message, 'error')
              vm.$store.dispatch('updateLoading', false)
            }
          })
          .catch((err) => {
            vm.toastTopEnd(err.data.message, 'error')
            vm.$store.dispatch('updateLoading', false)
          })
      }
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    }
  },
  created () {
    this.getProducts()
    this.getCarts()
  }
}
</script>
<style scope>
.swal2-container {
  margin-top: 100px;
}
</style>
