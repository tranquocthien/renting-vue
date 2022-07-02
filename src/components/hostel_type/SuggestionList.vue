<template>
  <v-row>
    <v-col cols="12" class="px-0 ml-md-n7 d-flex flex-column">
      <v-slide-group _v-model="model" active-class="success" show-arrows>
        <v-slide-item v-for="(item, index) in list" :key="index" _v-slot="{ active, toggle }">
          <!-- <v-card
            :color="active ? undefined : 'grey lighten-1'"
            class="ma-4"
            height="200"
            width="100"
            @click="toggle"
          >
            <v-row class="fill-height" align="center" justify="center">
              <v-scale-transition>
                <v-icon
                  v-if="active"
                  color="white"
                  size="48"
                  v-text="'mdi-close-circle-outline'"
                ></v-icon>
              </v-scale-transition>
            </v-row>
          </v-card> -->
          <SuggestionItem :type="list[index]" />
        </v-slide-item>
      </v-slide-group>
      <!-- <vueper-slides class="no-shadow" :bullets="false" infinite slide :breakpoints="breakpoints">
        <template v-slot:arrow-left>
          <v-btn icon light large fab>
            <v-icon color="#FFB607">fas fa-chevron-left</v-icon>
          </v-btn>
        </template>
        <template v-slot:arrow-right>
          <v-btn icon light large fab class="next-slide">
            <v-icon color="#FFB607">fas fa-chevron-right</v-icon>
          </v-btn>
        </template> -->
      <!-- <vueper-slide v-for="i in list.length" :key="i" :index="i" class="red">
          <template v-slot:content>
            <SuggestionItem :type="list[i - 1]" />
          </template>
        </vueper-slide>
      </vueper-slides> -->
    </v-col>
  </v-row>
</template>
<script>
import SuggestionItem from './SuggestionItem.vue';

export default {
  name: 'SuggestionList',
  components: { SuggestionItem },
  props: {
    list: Array,
  },
  data: () => ({
    breakpoints: {
      1904: {
        arrowsOutside: false,
        visibleSlides: 2,
        draggingDistance: 50,
        fixedHeight: '400px',
      },
      1264: {
        arrowsOutside: false,
        visibleSlides: 2,
        draggingDistance: 50,
        fixedHeight: '400',
      },
      960: {
        arrowsOutside: false,
        visibleSlides: 2,
        draggingDistance: 50,
        fixedHeight: '400',
      },
      600: {
        arrowsOutside: false,
        visibleSlides: 1,
        draggingDistance: 50,
        fixedHeight: '370',
      },
    },
  }),
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '80%';
        case 'sm':
          return '80%';
        case 'md':
          return '45%';
        case 'lg':
          return '30%';
        case 'xl':
          return '30%';
        default:
          return '30%';
      }
    },
  },
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
