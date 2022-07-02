<template>
  <v-row class="content d-flex flex-wrap ma-0">
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
      v-for="district in list"
      :key="district.districtId"
      :value="district.districtId"
    >
      <StatisticDistrict :district="district" />
    </v-col>
  </v-row>
</template>
<script>
import StatisticDistrict from '@/components/home/StatisticDistrict.vue';

export default {
  name: 'StatisticCity',
  components: {
    StatisticDistrict,
  },
  props: {
    list: Array,
  },
  data: () => ({
    listSorted: [],
    breakpoints: {
      1904: {
        arrowsOutside: true,
        visibleSlides: 3,
        gap: 5,
        draggingDistance: 70,
        fixedHeight: '500px',
      },
      1264: {
        arrowsOutside: true,
        visibleSlides: 3,
        gap: 5,
        draggingDistance: 70,
        fixedHeight: '500px',
      },
      960: {
        arrowsOutside: false,
        visibleSlides: 2,
        gap: 5,
        draggingDistance: 70,
        fixedHeight: '500px',
      },
      600: {
        arrowsOutside: false,
        visibleSlides: 1,
        gap: 5,
        draggingDistance: 70,
        fixedHeight: '500px',
      },
    },
  }),
  created() {
    this.list.sort((a, b) => {
      const textA = a.districtName.toUpperCase();
      const textB = b.districtName.toUpperCase();
      // eslint-disable-next-line
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  },
};
</script>
