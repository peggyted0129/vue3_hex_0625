<template>
<section class="cart">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <!-- banner -->
  <div class="w-100 cart-banner mb-12"></div>
  <div class="container mb-15">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h3 class="text-theme fw-bolder">購買清單</h3>
      <button @click="delAllLocalCarts" class="btn btn-outline-danger" type="button" v-if="carData.length > 0">清空購物車</button>
    </div>
    <!-- 購物車 table -->
    <div class="row">
      <div class="col-12">
        <div v-if="carData.length == 0" class="empty fw-bolder d-flex align-items-center justify-content-center">
          <div>
             <p>您的購物車現在沒有商品喔，快去購物吧!!</p>
             <router-link to="/products" class="btn btn-theme btn-lg text-white mt-9 fw-bolder hvr-bounce-to-right">逛逛商店</router-link>
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
      </div>
    </div>
    <!-- 購物車 footer -->
    <div v-if="carData.length > 0" class="d-flex justify-content-between mt-8">
      <router-link to="/products" class="cart-footer-btn btn btn-theme text-white hvr-float">
        <i class="fa fa-undo me-3"></i>繼續購物
      </router-link>
      <button type="button" @click="postCarts" class="cart-footer-btn btn btn-sgreen text-white hvr-float">
        前往結帳<i class="fas fa-angle-double-right ms-3"></i>
      </button>
    </div>
  </div>
</section>
</template>
<script>
// import { mapGetters, mapActions } from 'vuex'
import MixUser from '@/components/MixUser.vue'
import { mapGetters } from 'vuex'

export default {
  mixins: [MixUser],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  methods: {
  },
  created () {
    this.getCarts()
  }
}
</script>
<style scope>
.swal2-container {
  margin-top: 150px;
}
</style>
