<template>
  <div>
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!isLoading">
      <v-row>
        <v-col>
          <TopBanner />
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col v-for="province in showableProvinces" :key="province.provinceId">
          <ProvinceView :province="province" />
        </v-col>
      </v-row> -->
      <v-row
        justify="center"
        class="content mt-10"
        v-if="provinceStatistic && provinceStatistic.provinces.length > 0 && districts"
      >
        <v-col cols="12" class="pa-0">
          <StatisticCity :list="provinceStatistic.provinces[0].districts" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import TopBanner from '../../components/discovery/TopBanner.vue';
// import ProvinceView from '../../components/discovery/ProvinceView.vue';
import StatisticCity from '../../components/home/StatisticCity.vue';

export default {
  name: 'DiscoveryOverview',
  components: {
    TopBanner,
    // ProvinceView,
    StatisticCity,
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
      getAllDistricts: 'renter/home/getAllDistricts',
      getProvinceStatistic: 'renter/discovery/getProvinceStatistic',
    }),
  },
  computed: {
    ...mapState({
      provinces: (state) => state.renter.common.provinces,
    }),
    showableProvinces() {
      return [this.provinces.data[0]]; // only show HCMC
    },
    districts() {
      return this.$store.state.renter.home.districts.data;
    },
    provinceStatistic() {
      return this.$store.state.renter.discovery.stats.province.data;
    },
    isLoading() {
      const districts = this.$store.state.renter.home.districts.isLoading;
      const provinceStat = this.$store.state.renter.discovery.stats.province.isLoading;
      return districts || provinceStat;
    },
  },
  created() {
    this.getProvinces();
    if (this.provinceStatistic.length === 0) {
      if (this.districts.length === 0) {
        this.getAllDistricts(1).then(
          () => this.getProvinceStatistic({ districts: this.districts.districts }), // eslint-disable-line
        ); // eslint-disable-line
      } else {
        this.getProvinceStatistic({ districts: this.districts.districts });
      }
    }
  },
};
</script>
<style scoped></style>
