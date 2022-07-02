<template>
  <div class="d-flex flex-column flex-md-row flex-wrap">
    <Article
      v-for="i in list.length"
      :key="i"
      :index="i"
      :type="list[i - 1]"
      class="mb-8"
      :page="page"
    />
  </div>
</template>
<style scoped></style>
<script>
import Article from './Article.vue';

export default {
  name: 'ArticleList',
  components: { Article },
  props: {
    list: Array,
    page: Number,
  },
  data: () => ({}),
};
</script>
