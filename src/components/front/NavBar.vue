<template>
<section>
  <nav :class="{ 'navbar-scroll': scrollHeader , 'bg-theme' : togglerBtn }" class="navbar navbar-expand-md py-0">
    <div class="container-fluid container-md align-items-center my-2 my-md-0">
      <h1 class="h3 ml-5 ml-md-0">
        <router-link :to="{ name: 'Home' }" @click="togglerBtn = false" class="navbar-logo fw-bold ps-7 ps-sm-0" :class="{ 'text-white' : togglerBtn }">Sebamed</router-link>
      </h1>
      <button class="navbar-toggler" @click="dropdownOpen('togglerBtn')" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <div class="position-relative">
          <span class="toggler-bar toggler-bar-top" :class="{ 'toggler-bar-top-rotate' : togglerBtn, 'bg-white' : togglerBtn }"></span>
          <span class="toggler-bar toggler-bar-middle" :class="{ 'd-none' : togglerBtn }"></span>
          <span class="toggler-bar toggler-bar-bottom" :class="{ 'toggler-bar-bottom-rotate' : togglerBtn, 'bg-white' : togglerBtn }"></span>
        </div>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/products" class="nav-link" @click="navScrollUp">逛逛商店</router-link>
          </li>
          <!-- <li class="nav-item ms-2 py-4">
            <a class="nav-link" href="#" @click="navScrollUp">購物車</a>
          </li> -->
          <li class="nav-item">
            <router-link to="/cart" class="nav-link" @click="navScrollUp">
              <span class="me-1">購物車</span>
              <i class="fas fa-shopping-basket"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="navScrollUp">購買地點</a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex" @click="dropdownOpen('isSkinDropdown')" href="#">
              <span>美肌顧問</span>
              <span class="ms-1 arrowDown-pad d-none d-md-block"><i class="fas fa-chevron-down"></i></span>
              <span v-if="isSkinDropdown" class="ms-1 addIcon-phone d-md-none d-block ms-auto"><i class="fas fa-minus"></i></span>
              <span v-else class="ms-1 addIcon-phone d-md-none d-block ms-auto"><i class="fas fa-plus"></i></span>
            </a>
            <!-- 手機版 : 手風琴效果 -->
            <ul class="dropdown-open js-skin-open d-md-none" :class="{ 'd-block' : isSkinDropdown , active : isSkinDropdown }">
              <li class="mb-5">
                <a href="#" class="ms-5 text-white">[ 小資美學堂 ] 肌膚 你不知道的奧秘</a>
              </li>
              <li>
                <a href="#" class="ms-5 text-white">[ 小資美學堂 ] 肌膚 你不知道的奧秘</a>
              </li>
            </ul>
            <!-- 電腦版 -->
            <ul class="navbar-menu navbar-skin-menu bg-theme p-7 ms-3 d-none d-md-block">
              <li class="mb-5">
                <a href="#">[ 小資美學堂 ] 肌膚 你不知道的奧秘</a>
              </li>
              <li>
                <a href="#">[ 小資美學堂 ] 肌膚 你不知道的奧秘</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link" @click="navScrollUp">
              <span>後台登入</span>
              <span class="ms-1"><i class="fas fa-sign-in-alt"></i></span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <router-view />
</section>
</template>

<script>
/* global $ */
export default {
  data () {
    return {
      togglerBtn: false, // RWD 打開下拉式選單
      isSkinDropdown: false, // RWD 選單內的第二層 Skin 下拉式選單
      // isProductDropdown: false, // RWD 選單內的第二層 Product 下拉式選單
      scrollHeader: false,
      routerName: this.$route.name
    }
  },
  methods: {
    navScrollUp () { // 在漢堡選單狀態點選<a>，會自動收闔選單並導向正確路徑
      // this.dropdownOpen('togglerBtn')
      $('.navbar-collapse').removeClass('show')
      this.togglerBtn = false
    },
    dropdownOpen (isOpen) {
      if (isOpen === 'togglerBtn') {
        this[isOpen] = !this[isOpen]
        // $('.toggler-bar-middle').toggleClass('d-none')
      }
      // if (isOpen === 'isProductDropdown') {
      //   this[isOpen] = !this[isOpen]
      //   $('.js-product-open').slideToggle()
      // }
      if (isOpen === 'isSkinDropdown') {
        this[isOpen] = !this[isOpen]
        $('.js-skin-open').slideToggle()
      }
    },
    scrollPage () {
      const vm = this
      const scrollTop = $(window).scrollTop()
      const { routerName } = this
      switch (true) {
        case routerName === 'Home' && scrollTop > 50:
          window.addEventListener('scroll', vm.scrollPage)
          vm.scrollHeader = true
          break
        case routerName === 'Home':
          window.addEventListener('scroll', vm.scrollPage)
          vm.scrollHeader = false
          break
        default:
          window.removeEventListener('scroll', vm.scrollPage)
          vm.scrollHeader = true
          break
      }
    }
  },
  watch: {
    $route (to, from) {
      const vm = this
      if (to.path !== from.path) {
        vm.routerName = to.name
        vm.scrollPage()
        window.scrollTo(0, 0)
      }
    }
  },
  created () {
    this.scrollPage()
  }
}
</script>
