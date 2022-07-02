<template>
  <v-btn
    v-scroll="onScroll"
    v-show="fab"
    fab
    dark
    fixed
    bottom
    right
    color="#727cf5"
    @click="toTop"
  >
    <v-icon>fas fa-chevron-up</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'BackToTopButton',
  data: () => ({
    fab: false,
  }),
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') {
        return;
      }
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
