<template>
  <div>
    <ul class="products-pagination modal-page">
      <li>
        <a href="#" class="prev btn d-flex align-items-center justify-content-center" :class="{ 'disabled' : !pages.hasPage}" @click.prevent="$emit('get-current-page', pages.currentPage - 1)">
          <i class="fa fa-chevron-left"></i>
          <span class="ms-3 d-none d-sm-block">Previous</span>
        </a>
      </li>
      <li v-for="page in pages.pageTotal" :key="page">
        <a href="#" @click.prevent="$emit('get-current-page', page)" :class="{ 'active' : page === pages.currentPage }">{{ page }}</a>
      </li>
      <li>
        <a href="#" class="next btn d-flex align-items-center justify-content-center" :class="{ 'disabled' : !pages.hasNext}" @click.prevent="$emit('get-current-page', pages.currentPage + 1)">
          <span class="me-3 d-none d-sm-block">Next</span>
          <i class="fa fa-chevron-right"></i>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['pages']
}
</script>
