<template>
  <!-- eslint-disable max-len -->
  <div class="d-flex flex-column flex-md-row flex-wrap">
    <Type
      :group="group"
      v-for="i in listType.length"
      :key="i"
      :index="i"
      :type="listType[i - 1]"
      class="mb-8"
    />
  </div>
</template>
<script>
import Type from './Type.vue';

export default {
  name: 'ListTypes',
  components: { Type },
  props: {
    list: Array,
    group: Object,
    page: Number,
    pageRange: Number,
  },
  data: () => ({}),
  computed: {
    listType() {
      return this.list.slice(this.pageRange * (this.page - 1), this.pageRange * this.page);
    },
  },
};
</script>
