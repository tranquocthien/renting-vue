<template>
  <div>
    <v-card dark :to="route">
      <v-img
        :src="imgUrl"
        gradient="to top right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)"
        min-height="165"
        max-height="165"
      >
        <div class="fill-height d-flex justify-center align-center">
          <v-card-title class="text-h5">{{ district.districtName }}</v-card-title>
        </div>
      </v-img>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'DistrictItem',
  props: {
    district: Object,
    img: String,
  },
  data: () => ({}),
  computed: {
    imgUrl() {
      return this.img;
    },
    route() {
      return {
        name: 'DiscoveryDistrict',
        params: {
          districtInput: this.district,
          districtId: this.district.districtId,
        },
      };
    },
  },
};
</script>
