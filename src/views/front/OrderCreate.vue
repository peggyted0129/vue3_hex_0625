<template>
<section class="mt-13 mb-20">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <!-- 購物車列表 - 加入 API 後的內容 -->
  <div class="d-flex align-items-center justify-content-between mt-10 mb-4">
    <h3 class="text-theme fw-bolder mb-4">購物車內容確認</h3>
    <button @click="deleteAllCarts" class="btn btn-outline-danger" type="button" v-if="cartLength > 0">清空購物車</button>
  </div>
  <div v-if="cartLength === 0" class="empty fw-bolder d-flex align-items-center justify-content-center mb-20">
    <div>
      <p>還沒有商品要結帳喔，快回上一頁確認購買商品吧!!</p>
    </div>
  </div>
  <div class="row" v-if="cartLength > 0">
    <div class="col-12 col-md-7">
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
                  <div class="orderTitle fw-bolder pt-md-9">{{ item.product.title }}</div>
                </div>
                <div class="col-6 col-md-2 pb-3 px-0">
                  <div class="pt-md-9 ms-md-3">{{ item.qty }} {{ item.product.unit }}</div>
                </div>
                <div class="col-6 col-md-4 pt-md-9 text-end">
                  <div class="orderTotal pe-3">小計 ${{ item.total }}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="border-0 mb-0">
          <div class="row">
            <div class="col-6 text-end"> 共 {{ cartLength }} 項</div>
            <div class="col-6 ps-0 pe-7 text-end">總計 NT$ {{ cart.total }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="col-12 col-md-5 order-info align-self-baseline">
      <div class="input-group mb-3 my-7">
        <input type="text" v-model.trim="coupon_code" class="form-control" placeholder="請輸入優惠碼" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button @click="addCouponCode" class="btn btn-theme hvr-bounce-to-right" type="button">套用優惠碼</button>
      </div>
      <table class="totalInfo fw-bolder my-10 w-100">
        <tbody>
          <tr>
            <td>總計金額</td>
            <td class="text-end">NT ${{ cart.total }}</td>
          </tr>
          <tr>
            <td>優惠折抵</td>
            <td class="text-end">- NT ${{ cart.total - cart.final_total }}</td>
          </tr>
          <tr>
            <td v-if="cart.total !== cart.final_total" class="h5 fw-bolder">應付金額 (已套用優惠券)</td>
            <td v-if="cart.total === cart.final_total" class="h5 fw-bolder">應付金額 (未使用優惠券)</td>
            <td class="h5 fw-bolder text-sgreen text-end">NT ${{ cart.final_total }}</td>
          </tr>
        </tbody>
      </table>
      <div class="nextStep text-end mb-7">
        <router-link to="/checkout/order_buying" class="btn btn-theme hvr-bounce-to-right" type="button">
          下一步<i class="fas fa-angle-double-right ms-3"></i>
        </router-link>
      </div>
      <div>
        <p class="h6 text-sgreen ms-5 fw-bolder">( 優惠券 8 折碼 : HappyCoupon )</p>
        <p class="h6 text-sgreen ms-5 fw-bolder">( 優惠券 7 折碼 : CoolCoupon )</p>
      </div>
    </div>
  </div>
  <!-- NOTICE -->
  <div class="product-content mt-12 mb-4">
    <h3>NOTICE</h3>
  </div>
  <div class="text-sgreen d-flex align-items-center">
    <i class="fas fa-exclamation-circle me-5" style="font-size: 20px;"></i>
    <h5 class="fw-bolder">注意事項</h5>
  </div>
  <ul class="notice ps-11 fw-bolder">
    <li class="mt-5">所有產品保證全為原裝進口，品質有保障。</li>
    <li>請確認所填寫的資料是否正確，下單後未提供修改付款方式服務。</li>
    <li>提供完整客戶諮詢服務。</li>
    <li>提供您最有保障及便利的購物環境。</li>
    <li>所有商品運送均使用統一速達宅急便，可挑選最方便收貨時間。</li>
    <li>本店商品為統一會於付款後 7 個工作日內出貨(不含假日)。</li>
    <li>辦理退換貨時，商品必須是全新狀態與完整包裝，退回之商品必須於 7 日鑑賞期內寄回。</li>
  </ul>
</section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MixUser from '@/components/MixUser.vue'

export default {
  mixins: [MixUser],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'orderStep'])
  },
  methods: {
    ...mapActions(['setOrderStep'])
  },
  created () {
    this.getCarts()
    this.setOrderStep('create')
  }
}
</script>
