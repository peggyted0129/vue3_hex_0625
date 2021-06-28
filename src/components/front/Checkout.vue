<template>
<section class="order">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <div class="w-100 order-banner position-relative d-flex align-items-center justify-content-center">
    <div class="orderStep position-absolute d-flex align-items-center justify-content-center m-5 m-sm-0 h-100">
      <div class="row">
        <div class="col-sm-4">
          <div class="step" :class="{ current: orderStep == 'create' }">Step1<p>確認購買</p></div>
        </div>
        <div class="col-sm-4">
          <div class="step" :class="{ current: orderStep == 'paying' }">Step2<p>填寫資料</p></div>
        </div>
        <div class="col-sm-4">
          <div class="step" :class="{ current: orderStep == 'paid' }">Step3<p>完成訂單</p></div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
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
    this.setOrderStep('create')
  }
}
</script>
