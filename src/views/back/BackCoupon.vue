<template>
  <section class="py-20">
    <loading v-model:active="isLoading">
      <img src="https://upload.cc/i1/2021/06/12/N7mIQ1.gif
  " alt="loading">
    </loading>
    <div class="container">
      <div class="text-end mb-8">
        <button type="button" class="btn btn-theme hvr-bounce-to-right h5" @click="openCouponModal(true)">建立新的優惠券</button>
      </div>
      <table class="table table-hover fw-bolder mb-10">
        <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">優惠碼</th>
            <th scope="col">折扣百分比</th>
            <th scope="col">到期日</th>
            <th scope="col">是否啟用</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in coupons" :key="key">
            <td>{{ item.title }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.percent }}%</td>
            <td>{{ indate(item.due_date) }}</td>
            <!-- <td>{{ item.due_date }}</td> -->
            <td>
              <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
              <span v-else class="text-muted">未起用</span>
            </td>
            <td>
              <button class="btn btn-outline-theme btn-sm me-4" @click="openCouponModal(false, item)" type="button">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delCoupon(item.id)" type="button">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :pages="pagination" @emitPages="getCoupons"></Pagination>
    </div>
    <!-- Modal -->
    <div id="couponModal" ref="couponModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" style="max-width: 600px;">
        <div class="modal-content border-0 fw-bolder">
          <div class="modal-header bg-streak text-white">
            <h5 id="productModalLabel" class="modal-title fw-bolder">
              <span v-if="isNew">新增酷碰券</span>
              <span v-else>編輯酷碰券</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body mb-5">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" v-model="tempCoupon.title" type="text" class="form-control my-3" placeholder="請輸入標題">
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control my-3" id="coupon_code" v-model="tempCoupon.code"
                placeholder="請輸入優惠碼">
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control my-3" id="due_date" v-model="due_date">
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control my-3" id="price"
                v-model.number="tempCoupon.percent" placeholder="請輸入折扣百分比">
            </div>
            <div class="form-group mt-7">
              <div class="form-check form-switch">
                <input class="form-check-input mt-3" v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0" type="checkbox" id="is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用 :</label><span class="h5 ms-3 fw-bolder" :class="{ 'text-sgreen' : tempCoupon.is_enabled , 'text-danger' : !tempCoupon.is_enabled }">{{ tempCoupon.is_enabled ? '啟用' : '未啟用' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger fw-bolder" data-bs-dismiss="modal">
              取消
            </button>
            <button v-if="isNew" type="button" class="btn btn-streak text-white fw-bolder" @click="updateCoupon">
              新增優惠券
            </button>
            <button v-else type="button" class="btn btn-streak text-white fw-bolder" @click="updateCoupon">
              編輯優惠券
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Pagination from '@/components/Pagination'
import * as bootstrap from 'bootstrap'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  data () {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        due_date: 0,
        code: ''
      },
      due_date: new Date(),
      pagination: {},
      isNew: false
    }
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  watch: {
    due_date () {
      const vm = this
      const timestamp = Math.floor(new Date(vm.due_date) / 1000)
      vm.tempCoupon.due_date = timestamp
    }
  },
  methods: {
    indate (time) {
      const date = new Date(time * 1000)
      return date.toLocaleDateString()
    },
    openCouponModal (isNew, item) {
      const vm = this
      vm.openModal()
      vm.isNew = isNew
      if (vm.isNew) {
        vm.due_date = new Date()
        vm.tempCoupon = {
          due_date: Math.floor(new Date(vm.due_date) / 1000), // 預設為今日的時間戳
          is_enabled: 0
        }
      } else {
        vm.tempCoupon = { ...item }
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T')
        vm.due_date = dateAndTime[0]
      }
    },
    getCoupons (page = 1) {
      const vm = this
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(url).then((response) => {
        vm.coupons = response.data.coupons
        vm.pagination = response.data.pagination
        vm.$store.dispatch('updateLoading', false)
      })
    },
    updateCoupon () {
      const vm = this
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`
      let httpMethod = 'post'
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
        httpMethod = 'put'
        vm.due_date = new Date(vm.tempCoupon.due_date * 1000)
      }
      vm.$store.dispatch('updateLoading', true)
      vm.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        vm.$store.dispatch('updateLoading', false)
        if (response.data.success) {
          vm.hideModal()
          vm.getCoupons()
          vm.toastTopEnd(response.data.message, 'success')
        } else {
          vm.getCoupons()
          vm.toastTopEnd(`新增產品失敗 ${response.data.message}，請再次確認!`, 'error')
        }
      })
    },
    delCoupon (id) {
      const vm = this
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${id}`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.delete(url).then((response) => {
        vm.toastTopEnd(response.data.message, 'error')
        vm.$store.dispatch('updateLoading', false)
        vm.getCoupons()
      })
    },
    openModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    },
    toastTopEnd (msg, icon) {
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: icon,
        title: msg
      })
    }
  },
  created () {
    this.getCoupons()
  },
  mounted () {
    this.modal = new bootstrap.Modal(this.$refs.couponModal, {
      keyboard: false,
      backdrop: 'static'
    })
  }
}
</script>
<style scope>
.swal2-container {
  margin-top: 100px;
}
</style>
