<template>
<section class="mt-13 mb-20">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <!-- 購物車列表 - 加入 API 後的內容 -->
  <h3 v-if="!order.is_paid" class="text-theme fw-bolder mt-10 mb-4">訂單資訊</h3>
  <div v-if="!order.is_paid" class="row">
    <div class="col-md-6">
      <ul class="order py-4 px-0 p-sm-4">
        <li class="orderPaid">訂購日期 - {{ indate(order.create_at) }}</li>
        <li class="orderPaid" v-for="item in order.products" :key="item.id">
          <div class="row">
            <div class="col-6">{{ item.product.title }}</div>
            <div class="col-2 text-center">x {{ item.qty }}</div>
            <div class="col-4 text-end">NT$ {{ item.final_total }}</div>
          </div>
        </li>
        <li class="orderPaid paidSummary mt-4 pt-7">
          <div class="row fw-bolder">
            <div class="col-8 text-end">總計</div>
            <div class="col-4 text-end">NT$ {{ order.total }}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 顧客資料 -->
    <div class="col-md-6 order-info">
      <table class="table">
        <tbody>
          <tr>
            <td class="fw-bolder">姓名</td>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <td class="fw-bolder">電話</td>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <td class="fw-bolder">Email</td>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <td class="fw-bolder">地址</td>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <td class="fw-bolder border-bottom-0">付款狀態</td>
            <td v-if="!order.is_paid" class="fw-bolder text-danger border-bottom-0">尚未付款</td>
            <td v-if="order.is_paid" class="fw-bolder text-sgreen border-bottom-0">付款完成</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!order.is_paid" class="nextStep text-end mb-7">
        <button @click="payOrder()" class="gopay btn btn-theme hvr-bounce-to-right" type="button">
          確認付款<i class="fas fa-wallet ms-3"></i>
        </button>
      </div>
    </div>
  </div>
  <!-- 付款成功 -->
  <main v-if="order.is_paid">
    <div class="row">
      <!-- 付款成功 - 左邊 -->
      <div class="col-5">
        <div class="paid-title d-flex align-items-center">
          <img src="../../assets/img/check_img.png" alt="check_img">
          <h2 class="h1 text-theme fw-bolder ms-7">付款成功 !!</h2>
        </div>
        <div>
          <h3 class="text-theme fw-bolder mt-10 mb-4">購買明細</h3>
          <ul>
            <li class="paidList">訂購日期 - {{ indate(order.create_at) }}</li>
            <li class="paidList" v-for="item in order.products" :key="item.id">
              <div class="row">
                <div class="col-6">{{ item.product.title }}</div>
                <div class="col-2 text-center">x {{ item.qty }}</div>
                <div class="col-4 text-end">NT$ {{ item.final_total }}</div>
              </div>
            </li>
            <li class="paidList">
              <div class="row fw-bolder">
                <div class="col-6"></div>
                <div class="col-2 text-center">總計</div>
                <div class="col-4 text-end">NT$ {{ order.total }}</div>
              </div>
            </li>
            <li class="paidLine paidLine pt-6 mt-6">
              <h3 class="text-theme fw-bolder">購買人資訊</h3>
            </li>
            <li class="paidList">
              <p>姓名 : <span class="ms-5">{{ order.user.name }}</span></p>
            </li>
            <li class="paidList">
              <p>連絡電話 :  <span class="ms-5">{{ order.user.tel }}</span></p>
            </li>
            <li class="paidList">
              <p>地址 :  <span class="ms-5">{{ order.user.address }}</span></p>
            </li>
            <li class="paidLine paidLine pt-6 mt-6">
              <h3 class="text-theme fw-bolder">付款資訊</h3>
            </li>
            <li class="paidList">
              <p>付款狀態 :  <span class="ms-5">已付款</span></p>
            </li>
            <li class="paidList">
              <p>備註 :  <span class="ms-5">產品將於 7 日內寄送，謝謝您的光臨 !!</span></p>
            </li>
            <li class="paidList text-end mt-10">
              <router-link to="/products" class="cart-footer-btn btn btn-theme text-white hvr-float">
                <i class="fa fa-undo me-3"></i>繼續購物
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-7">
        <div class="paid-banner"></div>
      </div>
    </div>
  </main>
</section>
</template>
<script>
// http://localhost:8080/#/checkout/order_paid/-MdFshhNCXEa0HCk09yo
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      orderId: ''
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'orderStep', 'order'])
  },
  methods: {
    ...mapActions(['setOrderStep']),
    indate (time) {
      const date = new Date(time * 1000)
      return date.toLocaleDateString()
    },
    getOrder () {
      this.$store.dispatch('getOrder', this.orderId)
    },
    payOrder () {
      this.$store.dispatch('payOrder', this.orderId).then(() => {
        this.toastTopEnd('付款完成', 'success')
      })
    }
  },
  created () {
    this.setOrderStep('paid')
    this.orderId = this.$route.params.orderId
    this.getOrder()
  }
}
</script>
