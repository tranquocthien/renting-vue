<template>
  <div>
    <!-- eslint-disable max-len -->
    <!-- <v-overlay :value="isLoadingTopView && isLoadingTopSuggestion && isLoadingCategories" absolute> -->
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container fluid v-if="!isLoading" class="pa-0">
      <v-row>
        <v-col cols="12">
          <Banner />
        </v-col>
      </v-row>
      <v-row justify="center" class="content" v-if="topView && topView.length > 0">
        <v-col cols="12" sm="12" md="11" lg="11" xl="10">
          <div class="d-flex flex-column justify-center align-center topview-lable mt-16">
            <div class="line-blue mb-5"></div>
            <p>Lượt Xem Nhiều Nhất</p>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" class="content" v-if="topView && topView.length > 0">
        <v-col cols="9" sm="10" md="10" lg="10" xl="9">
          <TopCarousel :list="topView" />
        </v-col>
      </v-row>
      <v-row justify="center" class="content">
        <v-col cols="12" sm="12" md="11" lg="11" xl="10">
          <div class="d-flex flex-column justify-center align-center topview-lable mt-10">
            <div class="line-blue mb-5"></div>
            <p>Các Phòng Được Đề Xuất Tốt Nhất</p>
          </div>
        </v-col>
      </v-row>
      <v-row class="content pt-3" justify="center">
        <v-col cols="10" sm="10" md="10" lg="10" xl="9">
          <v-row class="d-flex flex-direction: row px-5">
            <v-col cols="11" sm="11" md="8" lg="8" xl="8" class="py-0 pr-5">
              <ArticleList :list="hostelTypes" :page="1" />
            </v-col>
            <v-col cols="4" class="d-flex flex-column py-0 pl-6">
              <div class="hidden-sm-and-down">
                <span
                  class="d-flex justify-center pa-2 font-nunito text-overline"
                  style="
                    background-color: #f1f3fa !important;
                    border-color: #f1f3fa !important;
                    font-size: 0.9rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #6c757d;
                  "
                  >ĐƠN VỊ ĐỒNG HÀNH</span
                >
                <a
                  href="https://www.sac.vn/article/ma-uu-dai-giam-gia-khoa-hoc-unica-len-den-80"
                  target="_blank"
                >
                  <v-card width="100%" class="mt-2 cursor">
                    <v-img
                      src="https://hotrosinhvien.vn/media/cache/lac_birds_large/e1/f5/68de21155c648e439c83964a8606.png"
                    />
                  </v-card>
                </a>
                <a
                  href="https://monkeymath.lapa.pub/?aff_sid=r4iq4n5fSJaV8M9noVipeAqkn6eRVuyFeT9nmxvSDjLM5cXy"
                  target="_blank"
                >
                  <v-card width="100%" class="mt-2 cursor">
                    <v-img
                      src="https://www.sac.vn/media/cache/lac_birds_large/97/57/da2003dac031650b9415496d4749.png"
                    />
                  </v-card>
                </a>
                <a href="https://nkidgroup.com/" target="_blank">
                  <v-card width="100%" class="mt-2 cursor">
                    <v-img
                      src="https://hotrosinhvien.vn/media/cache/lac_birds_large/3f/f1/d5591988b863a9a9461fe99286ac.jpeg"
                    />
                  </v-card>
                </a>
                <a href="https://sapuwa.com/" target="_blank">
                  <v-card width="100%" class="mt-2 cursor">
                    <v-img
                      src="https://hotrosinhvien.vn/media/cache/lac_birds_large/46/6b/409b520277068051cff64a38eb64.png"
                    />
                  </v-card>
                </a>
                <a href="https://www.ocb.com.vn/" target="_blank">
                  <v-card width="100%" class="mt-2 cursor">
                    <v-img
                      src="https://hotrosinhvien.vn/media/cache/lac_birds_large/60/ea/8278928e118849a1f9308b363394.png"
                    />
                  </v-card>
                </a>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
      <v-row
        justify="center"
        class="content pb-16"
        _v-if="provinceStatistic && provinceStatistic.provinces.length > 0 && districts"
      >
        <v-col cols="12" sm="12" md="11" lg="11" xl="10">
          <div class="d-flex flex-column justify-center align-center topview-lable mt-16">
            <div class="line-blue mb-5"></div>
            <router-link to="/discovery" style="text-decoration: none !important">
              <span class="d-flex flex-column align-center cursor text-primary-hover">
                <span>Khám Phá Thành Phố</span>
                <span style="font-size: 0.9rem; font-weight: 400 !important"
                  >Tìm hiểu về giá cả nhà trọ trên từng khu vực để giúp bạn tìm được một căn phòng
                  ưng ý</span
                >
              </span>
            </router-link>
          </div>
        </v-col>
      </v-row>
      <!-- <v-row
        justify="center"
        class="content"
        v-if="provinceStatistic && provinceStatistic.provinces.length > 0 && districts"
      >
        <v-col cols="9" sm="10" md="10" lg="10" xl="9">
          <StatisticCity :list="provinceStatistic.provinces[0].districts" />
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>
<style scoped>
.col-12 {
  padding: 0;
}
.topview-lable {
  font-size: 25px;
  color: #727cf5;
  font-family: Oswald;
  font-weight: 400 !important;
}
</style>
<style>
.topview-lable {
  font-size: 25px;
  color: #727cf5;
  font-family: Oswald;
  font-weight: 400 !important;
}
</style>
<script>
import Banner from '@/components/home/Banner.vue';
import TopCarousel from '@/components/home/TopCarousel.vue';
import ArticleList from '@/components/home/ArticleList.vue';
// import StatisticCity from '@/components/home/StatisticCity.vue';
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    Banner,
    TopCarousel,
    ArticleList,
    // StatisticCity,
  },
  data: () => ({
    overlay: false,
    bottomSheet: {
      show: false,
    },
    paging: {
      page: 1,
    },
  }),
  methods: {
    ...mapActions({
      getAllCategories: 'renter/home/getAllCategories',
      getHostelTypes: 'renter/home/getHostelTypes',
      getTopView: 'renter/home/getTopViewHostelTypes',
      getFilterResult: 'renter/filterResult/getFilterResult',
      getAllDistricts: 'renter/home/getAllDistricts',
      getProvinceStatistic: 'renter/discovery/getProvinceStatistic',
    }),
  },
  computed: {
    categories: {
      get() {
        return this.$store.state.renter.home.categories.data;
      },
    },
    hostelTypes: {
      get() {
        return this.$store.state.renter.home.hostelTypes.data;
      },
    },
    topView: {
      get() {
        return this.$store.state.renter.home.topView.data;
      },
    },
    isLoadingTopView: {
      get() {
        return this.$store.state.renter.home.topView.isLoading;
      },
    },
    isLoadingTopSuggestion: {
      get() {
        return this.$store.state.renter.home.hostelTypes.isLoading;
      },
    },
    isLoadingCategories: {
      get() {
        return this.$store.state.renter.home.categories.isLoading;
      },
    },
    districts() {
      return this.$store.state.renter.home.districts.data;
    },
    provinceStatistic() {
      return this.$store.state.renter.discovery.stats.province.data;
    },
    isLoading() {
      const facilities = this.$store.state.renter.filterResult.filter.facility.isLoading;
      const schools = this.$store.state.renter.filterResult.filter.schools.isLoading;
      const categories = this.$store.state.renter.filterResult.filter.categories.isLoading;
      const topSuggestion = this.$store.state.renter.home.hostelTypes.isLoading;
      const topView = this.$store.state.renter.home.topView.isLoading;
      const districts = this.$store.state.renter.home.districts.isLoading;
      // const provinceStat = this.$store.state.renter.discovery.stats.province.isLoading;
      return facilities || categories || schools || topSuggestion || topView || districts;
    },
  },
  created() {
    window.$cookies.set('searchValue', null);
    if (this.categories.length === 0) {
      this.getAllCategories();
    }
    if (this.hostelTypes.length === 0) {
      this.getHostelTypes({ page: 1, size: 5 });
    }
    if (this.topView.length === 0) {
      this.getTopView({ size: 10 });
    }
    // if (this.provinceStatistic.length === 0) {
    //   if (this.districts.length === 0) {
    //     this.getAllDistricts(1).then(
    //       () => this.getProvinceStatistic({ districts: this.districts.districts }), // eslint-disable-line
    //     ); // eslint-disable-line
    //   } else {
    //     this.getProvinceStatistic({ districts: this.districts.districts });
    //   }
    // }
  },
};
</script>
