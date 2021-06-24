<template>
<section class="products mb-17">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <div class="w-100 products-banner position-relative mb-13">
    <div class="sidebar mx-7 mx-md-13">
      <ul class="text-center d-flex flex-wrap justify-content-center">
        <li class="products-title active" @click.prevent="searchTitle('', 0)">
          全部商品
        </li>
        <li class="products-title" v-for="(item, index) in categories" :key="index" @click.prevent="searchTitle(item, index + 1)">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
  <!-- 產品列表 -->
  <div class="container-fluid px-lg-15 px-md-20 px-sm-10 mb-13">
    <div class="row mt-9">
      <div class="col-xl-3 col-lg-4 col-sm-6 mb-7" v-for="item in filterData" :key="item.id">
        <router-link :to="{ name: 'ProductDetail', params: { id: item.id }}" class="product-card">
          <div class="card position-relative back-card-shadow border-0 card-radius">
            <div style="height: 300px; background-size: contain; background-position: center; background-repeat: no-repeat;"
              :style="{backgroundImage: `url(${item.imageUrl})`}">
            </div>
            <div class="card-bg d-flex align-items-center">
              <p class="text-white fw-bolder p-8">{{ item.description }}</p>
            </div>
            <div class="card-body bg-light px-5" style="height: 100px">
              <div class="d-flex justify-content-between mb-5">
                <h5 class="card-title mb-0 text-theme fw-bolder">{{ item.title }}</h5>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="h6 text-streak fw-bolder" style="font-size:18px">NT$ {{ item.price }} 元</div>
                <button type="button" @click.prevent="addlocalCarts(item)" class="btn position-absolute zindex-1 cart-icon hvr-wobble-vertical">
                  <i class="fas fa-cart-plus" style="font-size: 28px"></i>
                  <!-- <i v-if="item.id === loadingStatus.loadingItem" class="fas fa-spinner fa-pulse me-1" style="font-size: 28px;color:#b2b2b2"></i> -->
                </button>
                <!-- <button type="button" class="btn position-absolute zindex-1 thumbs-icon py-5 px-2">
                  <i class="fas fa-thumbs-up me-1" style="font-size: 28px"></i>
                </button> -->
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <!-- pagination -->
    <div class="d-flex mt-5 justify-content-center" v-if="searchText === ''">
      <ProductsPagination :pages="pages" @get-current-page="getCurrentPage"></ProductsPagination>
    </div>
  </div>
</section>
</template>
<script>
import ProductsPagination from '@/components/front/ProductsPagination.vue'
import MixUser from '@/components/MixUser.vue'
import { mapGetters } from 'vuex'

export default {
  mixins: [MixUser],
  components: {
    ProductsPagination
  },
  data () {
    return {
      products: [], // 產品列表
      categories: [],
      searchText: '',
      pages: {
        dataLen: 0, // 全部資料長度
        pageTotal: 1, // 根據產品總筆數算出的總頁數
        perpage: 8, // 預設每一頁只顯示8筆資料
        currentPage: 1, // 當前頁數
        hasPage: false,
        hasNext: true
      },
      AllProducts: []
    }
  },
  computed: {
    ...mapGetters(['isLoading']),
    filterData () {
      const vm = this
      if (vm.searchText) {
        return vm.products.filter((item) => {
          const data = item.category.toLowerCase().includes(vm.searchText.toLowerCase())
          return data
        })
      }
      return vm.AllProducts
    }
  },
  methods: {
    searchTitle (txt, num) {
      this.searchText = txt
      const title = document.querySelectorAll('.products-title')
      if (num === 0) {
        this.getProducts()
        this.pages.currentPage = 1
      }
      title.forEach((item, i) => {
        if (num === i) {
          title[i].classList.add('active')
        } else {
          title[i].classList.remove('active')
        }
      })
    },
    getProducts () {
      const vm = this
      vm.$store.dispatch('updateLoading', true)
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`
      vm.$http.get(api).then((res) => {
        console.log('產品 All 列表', res.data)
        if (res.data.success) {
          vm.$store.dispatch('updateLoading', false)
          vm.products = res.data.products
          // 挑出不重複的 categories
          const categories = new Set()
          vm.products.forEach((item) => {
            categories.add(item.category)
          })
          vm.categories = Array.from(categories)
          vm.getProductsList(vm.products)
        } else {
          vm.toastTopEnd(res.data.message, 'error')
        }
      })
    },
    getProductsList (productslist) { // 客製化 Pagination
      const vm = this
      vm.pages.dataLen = productslist.length // 取得全部資料長度
      vm.pages.pageTotal = Math.ceil(vm.pages.dataLen / vm.pages.perpage)
      if (vm.pages.currentPage > vm.pages.pageTotal) {
        vm.pages.currentPage = vm.pages.pageTotal
      }
      const minData = (vm.pages.currentPage * vm.pages.perpage) - vm.pages.perpage + 1
      const maxData = (vm.pages.currentPage * vm.pages.perpage)
      vm.AllProducts = []
      productslist.forEach((item, index) => {
        const num = index + 1
        if (num >= minData && num <= maxData) {
          vm.AllProducts.push(item)
        }
      })
      console.log(vm.AllProducts)
    },
    getCurrentPage (getPage) {
      this.pages.currentPage = getPage
      if (getPage > 1) {
        this.pages.hasPage = true
      } else if (getPage === this.pages.currentPage) {
        this.pages.hasPage = false
      }
      if (getPage < this.pages.pageTotal) {
        this.pages.hasNext = true
      } else if (getPage === this.pages.pageTotal) {
        this.pages.hasNext = false
      }
      this.getProducts()
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
<style scope>
.swal2-container {
  margin-top: 150px;
}
.btn-check:focus + .btn, .btn:focus {
  outline: 0;
  box-shadow: none;
}
</style>
