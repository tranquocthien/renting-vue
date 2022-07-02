<template>
  <div>
    <v-card dark :to="route" style="border-radius: 0.2rem;">
      <v-img
        :src="require(`@/assets/district/${district.districtId}.jpg`)"
        _gradient="to top right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)"
        min-height="165"
        max-height="165"
        class="image"
      >
        <div class="fill-height d-flex flex-column justify-center align-center image" style="">
          <span class="text-h5" style="font-family: Oswald !important;">{{
            district.districtName
          }}</span>
          <span
            style="
              font-size: 0.875rem;
              background: rgba(0, 0, 0, 0.45);
              border-radius: 20px;
              color: #afb4ea;
            "
            class="font-nunito px-3 py-2 mt-1"
            >{{
              getDownPayment(getPriceArea(district.avgPrice, district.avgSuperficiality), 'triệu')
            }}/m<sup>2</sup></span
          >
          <div class="d-flex align-center justify-space-around" style="width: 100%;">
            <span style="font-size: 0.775rem; color: #d4dcfc;"
              >{{ district.avgPrice }} tr/tháng</span
            >
            <span style="font-size: 0.775rem; color: #d4dcfc;"
              >{{ district.avgSuperficiality }} m<sup>2</sup>/phòng</span
            >
          </div>
        </div>
      </v-img>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'StatisticDistrict',
  props: {
    district: Object,
  },
  data: () => ({}),
  methods: {
    getPriceArea(priceAvg, areaAvg) {
      return priceAvg / areaAvg;
    },
    getDownPayment(price, priceUnit) {
      if (priceUnit === 'triệu') {
        if (price < 1) {
          return `${Math.round(price * 1000 * 1000) / 1000} nghìn`;
        }
        return `${price} triệu`;
      }
      return `${price} triệu`;
    },
  },
  computed: {
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
<style>
.image {
  background: rgba(0, 0, 0, 0.55);
  background: -webkit-linear-gradient(180deg, #323837ba, rgba(125, 28, 28, 0.59));
  background: -webkit-linear-gradient(180deg, #323837ba, rgba(0, 0, 0, 0.59));
  /* background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8)); */
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
}
.image:hover {
  background: -webkit-linear-gradient(180deg, #323837ba, rgba(50, 64, 120, 0.7803921568627451));
  background-color: rgba(26, 29, 31, 0.5);
}
</style>
