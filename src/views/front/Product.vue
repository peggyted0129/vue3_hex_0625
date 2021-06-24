<template>
<section class="product">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <div class="w-100 product-banner position-relative mb-13">
    <nav aria-label="breadcrumb" class="nav-breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link :to="{ name: 'Home' }">首頁</router-link></li>
        <li class="breadcrumb-item"><router-link :to="{ name: 'Products' }">產品總覽</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.category }}</li>
      </ol>
    </nav>
  </div>
  <div class="container-xl px-5 px-sm-8 mb-15">
    <div class="row mb-15 mb-md-20 mx-md-0 mx-sm-13">
      <div class="col-md-6 col-lg-5 mb-5 mb-md-0">
        <div class="productPicture">
          <img :src="product.imageUrl" class="p-3" alt="productPicture">
        </div>
      </div>
      <div class="col-md-6 col-lg-7">
        <ul class="ms-md-7">
          <li><h2 class="product-title fw-bolder">{{ product.title }}</h2></li>
          <li class="mb-7">
            <span class="badge bg-secondary rounded-pill h5 px-5 py-2">{{ product.category }}</span>
          </li>
          <li class="h5 mb-7">{{ product.description }}</li>
          <li class="h6 mb-7 mb-lg-13">{{ product.content }}</li>
          <li class="h6 mb-7 d-flex justify-content-between align-items-end">
            <p class="h4">售價 NT$ {{ product.price }}</p>
            <div class="d-flex flex-column justify-content-end">
              <!-- +、- 按鍵 -->
              <div class="input-group justify-content-start align-items-center mb-2" style="width:150px">
                <button type="button" class="input-group-text btn btn-theme" @click="productCartBtn('minus')" :disabled="num === 1">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="number" v-model.number="num" class="form-control text-center ps-5 m-0 cartNum" readonly>
                <button type="button" class="input-group-text btn btn-theme" @click="productCartBtn('add')" :disabled="num === 10">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <!-- 加入購物車 -->
              <button type="button" @click="addlocalCarts(product, num)" class="btn btn-theme hvr-bounce-to-right">
                <i class="fas fa-shopping-cart pe-3"></i>加入購物車
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="product-content mb-10">
      <h3>值得信賴的好品牌</h3>
    </div>
    <ul class="product-line">
      <li>
        <div class="product-pic">
          <img src="../../assets/img/product_content.png" alt="經典暢銷品">
        </div>
        <div class="product-txt">
          <div class="product-left d-flex flex-column align-items-center justify-content-center p-5 p-sm-10">
            <h4 class="h3 text-sgreen">經典暢銷品</h4>
            <p class="h5">累積熱銷超過 1300 座台北 101</p>
          </div>
        </div>
        <div class="product-linebadge">
          <i class="far fa-thumbs-up"></i>
        </div>
      </li>
      <li>
        <div class="product-pic">
          <img src="../../assets/img/product_content1.png" alt="肌膚最佳守門員">
        </div>
        <div class="product-txt">
          <div class="product-right d-flex flex-column align-items-center justify-content-center p-5 p-sm-10">
            <h4 class="h3 text-sgreen">肌膚最佳守門員</h4>
            <p class="h5">溫和淨膚無添加有害物質、不含防腐劑</p>
          </div>
        </div>
        <div class="product-linebadge">
          <i class="far fa-thumbs-up"></i>
        </div>
      </li>
      <li>
        <div class="product-pic">
          <img src="../../assets/img/product_content2.png" alt="歐洲防過敏">
        </div>
        <div class="product-txt">
          <div class="product-left d-flex flex-column align-items-center justify-content-center p-5 p-sm-10">
            <h4 class="h3 text-sgreen">精選歐盟法規認證成分</h4>
            <p class="h5">歐洲防過敏研究中心認證</p>
          </div>
        </div>
        <div class="product-linebadge">
          <i class="far fa-thumbs-up"></i>
        </div>
      </li>
      <li>
        <div class="product-pic">
          <img src="../../assets/img/product_content3.png" alt="醫師研發植萃配方">
        </div>
        <div class="product-txt">
          <div class="product-right d-flex flex-column align-items-center justify-content-center p-5 p-sm-10">
            <h4 class="h3 text-sgreen">醫師研發植萃配方</h4>
            <p class="h5">逾半世紀對敏弱肌地細心呵護</p>
          </div>
        </div>
        <div class="product-linebadge">
          <i class="far fa-thumbs-up"></i>
        </div>
      </li>
    </ul>
  </div>
</section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MixUser from '@/components/MixUser.vue'

export default {
  mixins: [MixUser],
  data () {
    return {
      productId: '',
      num: 1 // 加入購物車的按鈕 add、minus 按鈕綁定
    }
  },
  computed: {
    ...mapGetters(['isLoading']),
    ...mapGetters('productModules', ['products', 'product'])
  },
  methods: {
    ...mapActions('productModules', ['getProducts', 'getProduct'])
  },
  created () {
    console.log(this.$route.params.id)
    this.productId = this.$route.params.id
    this.getProduct(this.productId)
  }
}
</script>
<style scope>
.swal2-container {
  margin-top: 150px;
}
</style>
