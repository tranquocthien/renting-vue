<template>
  <vueper-slides
    class="no-shadow"
    fractions
    :bullets="false"
    transition-speed="500"
    infinite
    pauseOnHover
    autoplay
    slide
    :breakpoints="breakpoints"
  >
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
        <TopCarouselItem :type="list[i - 1]" />
      </template>
    </vueper-slide>
  </vueper-slides>
</template>
<script>
import 'vueperslides/dist/vueperslides.css';
import { VueperSlides, VueperSlide } from 'vueperslides';
import TopCarouselItem from './TopCarouselItem.vue';

export default {
  name: 'TopCarousel',
  components: { VueperSlides, VueperSlide, TopCarouselItem },
  props: {
    list: Array,
  },
  data: () => ({
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
