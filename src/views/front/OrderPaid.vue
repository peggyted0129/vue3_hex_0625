<template>
<section class="mt-13 mb-20">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <!-- 購物車列表 - 加入 API 後的內容 -->
  <h3 class="text-theme fw-bolder mt-10 mb-4">訂單資訊</h3>
  <div class="row">
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
      <div class="nextStep text-end mb-7">
        <button class="btn btn-theme hvr-bounce-to-right" type="button">
          確認付款<i class="fas fa-wallet ms-3"></i>
        </button>
      </div>
    </div>
  </div>
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
        this.$router.push(`/checkout/order_paid/${this.orderId}`)
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
