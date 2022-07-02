<template>
  <div
    :style="{
      width: '100%',
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(#fff, #F3F4F9)',
    }"
  >
    <v-row>
      <v-col cols="12">
        <vueper-slides class="no-shadow" :bullets="false" infinite slide :breakpoints="breakpoints">
          <template v-slot:arrow-left>
            <v-btn icon light large fab>
              <v-icon color="#FFB607">fas fa-chevron-left</v-icon>
            </v-btn>
          </template>
          <template v-slot:arrow-right>
            <v-btn icon light large fab class="next-slide">
              <v-icon color="#FFB607">fas fa-chevron-right</v-icon>
            </v-btn>
          </template>
          <vueper-slide v-for="i in list.length" :key="i" :index="i">
            <template v-slot:content>
              <SuggestionItem :type="list[i - 1]" />
            </template>
          </vueper-slide>
        </vueper-slides>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import 'vueperslides/dist/vueperslides.css';
import { VueperSlides, VueperSlide } from 'vueperslides';
// import SuggestionItem from './SuggestionItem.vue';
import SuggestionItem from '../home/TopCarouselItem.vue';

export default {
  name: 'GroupHostelTypes',
  components: { VueperSlides, VueperSlide, SuggestionItem },
  props: {
    list: Array,
  },
  data: () => ({
    breakpoints: {
      1904: {
        arrowsOutside: true,
        visibleSlides: 4,
        draggingDistance: 70,
        fixedHeight: '400px',
      },
      1264: {
        arrowsOutside: true,
        visibleSlides: 3,
        draggingDistance: 70,
        fixedHeight: '400',
      },
      960: {
        arrowsOutside: false,
        visibleSlides: 2,
        draggingDistance: 70,
        fixedHeight: '400',
      },
      600: {
        arrowsOutside: false,
        visibleSlides: 1,
        draggingDistance: 70,
        fixedHeight: '370',
      },
    },
  }),
};
</script>
<style>
.vueperslides__fractions {
  position: absolute;
  left: 10px;
  top: 10px;
  display: block;
  width: auto;
  max-width: 70%;
  padding: 5px 10px;
  background: rgba(132, 132, 132, 0.66);
  font-weight: 400;
  color: #fff;
  font-size: 13px;
  border-radius: 5px;
}
</style>
<style scoped>
.vueperslides--fixed-height.vueperslides--bullets-outside {
  margin-bottom: 0 !important;
}
</style>
