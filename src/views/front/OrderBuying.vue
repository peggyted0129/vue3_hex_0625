<template>
<section class="mt-13 mb-20">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <!-- 購物車列表 - 加入 API 後的內容 -->
  <h3 class="text-theme fw-bolder mt-10 mb-4">收件資訊</h3>
  <div class="row" v-if="cartLength > 0">
    <div class="col-12 col-md-5">
      <ul class="order py-4 px-0 p-sm-4">
        <li class="orderList" v-for="item in cart.carts" :key="item.product_id">
          <div class="row flex-wrap">
            <div class="col-3 col-md-2 px-0 px-md-0">
              <div class="orderImg h-100">
                <img :src="item.product.imageUrl" alt="cart-item">
              </div>
            </div>
            <div class="col-9 col-md-10 px-0">
              <div class="row mx-3 w-100">
                <div class="col-12 col-md-6 pb-3 px-0">
                  <div class="orderTitle fw-bolder pt-md-9 ps-4">{{ item.product.title }}</div>
                </div>
                <div class="col-6 col-md-2 pb-3 px-0">
                  <div class="pt-md-9 ms-md-3">x {{ item.qty }}</div>
                </div>
                <div class="col-6 col-md-4 pt-md-9 text-end">
                  <div class="orderTotal pe-3">NT ${{ item.final_total }}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="border-0 mb-0">
          <div class="row">
            <div class="col-6 text-end"> 共 {{ cartLength }} 項</div>
            <div class="col-6 ps-0 pe-7 text-end text-sgreen fw-bolder">總計金額 NT$ {{ cart.final_total }}</div>
          </div>
        </li>
      </ul>
      <div v-if="cart.total !== cart.final_total" class="text-end mt-3">( 已套用優惠券 )</div>
      <div v-if="cart.total === cart.final_total" class="text-end mt-3">( 未套用優惠券 )</div>
    </div>
    <!-- 顧客資料 -->
    <div class="col-12 col-md-7 order-info align-self-baseline">
      <Form @submit="createOrder" ref="form" class="row customer g-3 mt-5 mx-auto" v-slot="{ errors }" style="max-width:800px">
        <div class="col-md-6">
          <label for="姓名" class="form-label">收件人姓名<span class="text-danger" style="padding-left: 3px;">*</span></label>
          <Field  v-model.trim="form.user.name" type="text" class="form-control" id="姓名" name="姓名" :class="{ 'is-invalid': errors['姓名'] }" rules="required" placeholder="請輸入姓名" />
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>
        <div class="col-md-6">
          <label for="手機" class="form-label">收件人手機<span class="text-danger" style="padding-left: 3px;">*</span></label>
          <Field v-model="form.user.tel" type="tel" :rules="isPhone" :class="{ 'is-invalid': errors['手機'] }" class="form-control" id="手機" name="手機" placeholder="請輸入手機" />
          <error-message name="手機" class="invalid-feedback"></error-message>
        </div>
        <div class="col-md-6">
          <label for="email" class="form-label">收件人 Email<span class="text-danger" style="padding-left: 3px;">*</span></label>
          <Field v-model.trim="form.user.email" type="email" :class="{ 'is-invalid': errors['email'] }" rules="email|required" class="form-control" id="email" name="email" placeholder="請輸入 email" />
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>
        <div class="col-md-6">
          <label for="payment" class="form-label">付款方式<span class="text-danger" style="padding-left: 3px;">*</span></label>
          <select id="payment" class="form-select" aria-label="Default select example">
            <option value="1">貨到付款</option>
            <option value="2">超商付款</option>
            <option value="3">ATM付款</option>
          </select>
        </div>
        <div class="col-12">
          <label for="地址" class="form-label">收件人地址<span class="text-danger" style="padding-left: 3px;">*</span></label>
          <Field v-model.trim="form.user.address" :class="{ 'is-invalid': errors['地址'] }" rules="required" type="text" class="form-control" id="地址" name="地址" placeholder="請輸入地址" />
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="留言" class="form-label">留言</label>
          <textarea name="留言" id="留言" class="form-control" cols="20" rows="5" v-model.trim="form.message" placeholder="歡迎留下對我們說的話"></textarea>
        </div>
        <div class="col-12 d-flex justify-content-between mt-10 mb-7">
          <router-link to="/checkout/order_create" class="btn btn-theme hvr-bounce-to-right" type="button">
            <i class="fas fas fa-angle-double-left me-3"></i>上一步
          </router-link>
          <button type="submit" class="btn btn-theme hvr-bounce-to-right">送出訂單</button>
        </div>
      </Form>
      <!-- <div class="nextStep text-end mb-7">
        <button class="btn btn-theme hvr-bounce-to-right" type="button">
          下一步<i class="fas fa-angle-double-right ms-3"></i>
        </button>
      </div> -->
    </div>
  </div>
</section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MixUser from '@/components/MixUser.vue'
// vm.$router.push(`/checkout/order_paying/${response.data.orderId}`)
export default {
  mixins: [MixUser],
  data () {
    return {
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
    ...mapGetters(['isLoading', 'orderStep'])
  },
  methods: {
    ...mapActions(['setOrderStep']),
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
            vm.$store.dispatch('updateLoading', false)
            if (res.data.success) {
              console.log(res.data)
              vm.toastTopEnd(res.data.message, 'success')
              vm.getCarts()
              vm.$refs.form.resetForm() // 清空欄位
              vm.form.message = ''
              vm.$router.push(`/checkout/order_paid/${res.data.orderId}`)
            } else {
              vm.toastTopEnd(res.data.message, 'error')
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
    this.getCarts()
    this.setOrderStep('paying')
  }
}
</script>
