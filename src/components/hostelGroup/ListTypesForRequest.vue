<template>
  <!-- eslint-disable max-len -->
  <div class="d-flex flex-column flex-md-row flex-wrap">
    <TypeRequest
      :groups="groups"
      v-for="i in listType.length"
      :key="i"
      :index="i"
      :type="listType[i - 1]"
      class="mb-8"
    />
  </div>
</template>
<script>
import TypeRequest from './TypeRequest.vue';

export default {
  name: 'ListTypesForRequest',
  components: { TypeRequest },
  props: {
    list: Array,
    groups: Array,
    page: Number,
    pageRange: Number,
  },
  data: () => ({
    // groupItem: [],
  }),
  //   methods: {
  //     getGroupAndType() {
  //       this.list.slice(this.pageRange * (this.page - 1), this.pageRange * this.page).forEach((element) => {
  //         this.groups.forEach((element2) => {
  //           if (element.groupId === element2.groupId) {
  //             this.groupItem.push(element2);
  //           }
  //         });
  //       });
  //     },
  //   },
  computed: {
    listType() {
      return this.list.slice(this.pageRange * (this.page - 1), this.pageRange * this.page);
    },
    // getGroupByTypeSpecific() {
    // //   console.log('a');
    // //   console.log(group);
    //   return this.groupItem;
    // },
  },
};
</script>
