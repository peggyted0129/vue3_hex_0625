<template>
  <section>
    <div class="container-md container-fluid">
      <h2 class="text-center pt-14 pt-md-20">訂單列表</h2>
      <div class="table-responsive mt-5">
        <table class="table" v-if="orders">
        <thead>
          <tr>
            <th scope="col" style="min-width:120px">訂單時間</th>
            <th scope="col">訂單編號</th>
            <th scope="col" style="min-width:120px;" class="d-lg-table-cell d-none">顧客姓名</th>
            <th scope="col" style="min-width:220px;">訂單商品</th>
            <th scope="col" style="min-width:100px">是否付款</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="text-secondary">{{ indate(order.create_at) }}</td>
            <td class="text-secondary">{{ order.id }}</td>
            <td class="text-secondary d-lg-table-cell d-none" v-if="order.user">{{ order.user.name }}</td>
            <td class="text-secondary">
              <div v-for="item in order.products" :key="item.id">
              {{ item.product.title }} * {{ item.qty }}{{ item.product.unit }}
              </div>
            </td>
            <td>
              <div v-if="!order.is_paid" class="text-danger">尚未付款</div>
              <div v-if="order.is_paid" class="text-topic">已經付款</div>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
      <Pagination class="mt-7 mb-10" :pages="pagination" @emitPages="getAllOrders"></Pagination>
    </div>
  </section>
</template>
<script>
import Pagination from '@/components/Pagination.vue'
export default {
  data () {
    return {
      orders: {
        user: {}
      },
      pagination: {}
    }
  },
  components: {
    Pagination
  },
  methods: {
    indate (time) {
      const date = new Date(time * 1000)
      return date.toLocaleDateString()
    },
    getAllOrders (currentPage = 1) {
      const vm = this
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/orders?page=${currentPage}`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(url).then((response) => {
        vm.orders = response.data.orders
        vm.pagination = response.data.pagination
        vm.$store.dispatch('updateLoading', false)
      })
    }
  },
  created () {
    this.getAllOrders()
  }
}
</script>
