<template>
<section class="back-navbar">
  <loading v-model:active="isLoading">
    <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
" alt="loading">
  </loading>
  <nav class="navbar navbar-expand-md navbar-scroll py-0">
    <div class="container-fluid container-md">
      <h1 class="h2">
        <router-link :to="{ name: 'Home' }" class="navbar-logo">Nature</router-link>
      </h1>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-15">
          <li class="nav-item ms-2">
            <router-link to="/admin/products" class="nav-link h5">產品列表</router-link>
          </li>
          <li class="nav-item ms-2">
            <router-link to="/admin/coupon" class="nav-link h5">酷碰券</router-link>
          </li>
          <li class="nav-item ms-2">
            <router-link to="/backstage/shopping" class="nav-link h5">模擬頁面</router-link>
          </li>
          <li class="nav-item ms-2">
            <router-link to="/backstage/orders" class="nav-link h5">訂單列表</router-link>
          </li>
        </ul>
        <div class="ms-auto">
          <a href="#" @click.prevent="signout" class="nav-link d-flex align-items-center">
            <span class="me-5 h5">登出</span>
            <span style="font-size: 24px"><i class="fas fa-sign-out-alt"></i></span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</section>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    signout () {
      const vm = this
      vm.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/logout`
      vm.$http.post(api).then((res) => {
        if (res.data.success) {
          vm.isLoading = false
          vm.$router.push('/login')
        }
      })
    }
  }
}
</script>
