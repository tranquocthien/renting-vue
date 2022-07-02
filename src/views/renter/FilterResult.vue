<template>
  <div class="px-0">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container fluid v-if="!isLoading && isSearchError !== 500" class="px-0">
      <v-row justify="center" style="background-color: #f3f4f9">
        <v-col
          cols="12"
          sm="12"
          md="10"
          lg="10"
          xl="10"
          class="d-flex flex-column justify-center align-center"
        >
          <div class="line-blue mb-5 mt-10"></div>
          <span class="topview-lable">Các Phòng Được Đề Xuất Tốt Nhất</span>
          <span class="font-nunito text-brown size9rem mt-3" v-if="totalType && totalType > 0"
            >Tìm thấy {{ totalType }} kết quả phù hợp</span
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="d-flex flex-column align-center justify-center">
            <v-card-actions class="hidden-md-and-up">
              <v-bottom-sheet v-model="bottomSheet.show" scrollable>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="green" dark v-bind="attrs" v-on="on">Lọc nâng cao</v-btn>
                </template>
                <v-sheet light class="pt-6">
                  <HostelFilter />
                </v-sheet>
              </v-bottom-sheet>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mx-0" justify="center">
        <v-col cols="10">
          <v-row class="d-flex">
            <v-col cols="12" md="8">
              <div class="d-flex flex-column" v-if="list && list.length !== 0">
                <!-- <div
                  class="white d-flex"
                  style="box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15); border-radius: 0.25rem;"
                >
                  <v-row class="ma-0 d-flex pa-1 align-center">
                    <v-col cols="3">
                      <v-select
                        v-model="filterValue.date.selected"
                        :items="filterValue.date.items"
                        item-text="code"
                        item-value="time"
                        label="Ngày rảnh"
                        hide-details
                        dense
                        solo
                        class="size-sub-2 hostel-filter"
                      ></v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="4">
                      <v-select
                        v-model="filterValue.feature.selected"
                        :items="filterValue.feature.items"
                        label="Sắp xếp theo"
                        hide-details
                        dense
                        solo
                        class="size-sub-2"
                      ></v-select>
                    </v-col>
                    <v-btn
                      v-show="filterValue.feature.selected !== null"
                      icon
                      @click="filterValue.feature.asc = !filterValue.feature.asc"
                      ><v-icon color="#727cf5">{{
                        filterValue.feature.asc ? 'mdi-arrow-down' : 'mdi-arrow-up'
                      }}</v-icon></v-btn
                    >
                  </v-row>
                </div> -->
                <ArticleList :list="list" class="mt-4" :page="page" />
              </div>
              <v-card v-else>
                <v-card-text class="font-nunito text-gray" style="font-size: 1rem"
                  >Không tìm thấy kết quả phù hợp !</v-card-text
                >
              </v-card>
            </v-col>
            <v-col cols="0" md="4">
              <v-col cols="11" class="ml-auto pt-0 mt-0">
                <HostelFilter />
              </v-col>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="7" xl="8" lg="8" class="mt-10">
              <v-pagination
                class="mt-4"
                v-model="page"
                :length="getTotalPage(totalType)"
                :total-visible="5"
                prev-icon="mdi-menu-left"
                next-icon="mdi-menu-right"
                v-on:input="onUpdatePaging"
                color="#727cf5"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="isSearchError === 500">
      <v-row>
        <span>Lỗi server</span>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import HostelFilter from '../../components/home/HostelFilter.vue';
import ArticleList from '../../components/home/ArticleList.vue';

export default {
  name: 'FilterResult',
  components: { HostelFilter, ArticleList },
  props: ['criteria'],
  data: () => ({
    bottomSheet: {
      show: false,
    },
    filterValue: {
      date: {
        selected: '',
        items: [],
      },
      feature: {
        selected: null,
        items: ['Giá', 'Khoảng cách', 'Diện tích'],
        asc: true,
      },
    },
  }),
  methods: {
    ...mapActions({
      getFilterResult: 'renter/filterResult/getFilterResult',
    }),
    ...mapActions({
      getAllCategories: 'renter/home/getAllCategories',
      reSearch: 'renter/filterResult/filterSearchByCoordinatorResult',
    }),
    ...mapActions({
      setPageValue: 'renter/filterResult/setPageValue',
    }),
    getTotalPage(totalTypes) {
      return Math.ceil(Number(totalTypes) / 5);
    },
    onUpdatePaging(pageNumber) {
      let paramsStr = [];
      paramsStr = window.$cookies.get('searchValue').split('&page=');
      // this.getFilterResult({ page: pageNumber, size: 5 });
      this.reSearch({
        paramsStr: `${paramsStr[0]}&page=${pageNumber}&size=5&sortBy=score`,
      });
      this.setPageValue(Number(pageNumber));
      window.$cookies.set('page', pageNumber);
    },
    get7dates() {
      const dates = this.initListOf7Dates();
      const sevenDates = [];
      // new Date(2020,10-1,16,23,59,59)
      for (let i = 0; i < 7; i += 1) {
        const day = {
          time: dates[i],
          code: this.mapDateCode(dates[i].getDay()),
        };
        switch (i) {
          case 0:
            day.code = 'Hôm Nay';
            break;
          case 1:
            day.code = 'Ngày Mai';
            break;
          case 2:
            day.code = 'Ngày Mốt';
            break;
          default:
            break;
        }
        sevenDates.push(day);
      }
      this.filterValue.date.items = sevenDates;
    },
    initListOf7Dates() {
      // this function return list of seven dates from today
      const today = new Date();
      const dates = [today];
      for (let i = 0; i < 7; i += 1) {
        dates.push(this.getNextDate(dates[i]));
      }
      return dates;
    },
    getNextDate(date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    },
    mapDateCode(code) {
      let day;
      switch (code) {
        case 0:
          day = 'Chủ Nhật';
          break;
        case 1:
          day = 'Thứ Hai';
          break;
        case 2:
          day = 'Thứ Ba';
          break;
        case 3:
          day = 'Thứ Tư';
          break;
        case 4:
          day = 'Thứ Năm';
          break;
        case 5:
          day = 'Thứ Sáu';
          break;
        default:
          day = 'Thứ Bảy';
          break;
      }
      return day;
    },
  },
  computed: {
    isLoading() {
      const facilities = this.$store.state.renter.filterResult.filter.facility.isLoading;
      const around = this.$store.state.renter.filterResult.filter.around.isLoading;
      const result = this.$store.state.renter.filterResult.results.isLoading;
      const categories = this.$store.state.renter.filterResult.filter.categories.isLoading;
      const regulation = this.$store.state.renter.filterResult.filter.regulations.isLoading;
      return facilities || categories || regulation || result || around;
    },
    isSearchError() {
      return this.$store.state.renter.filterResult.results.error;
    },
    searchValue() {
      return this.$route.params.searchValue;
    },
    list() {
      return this.$store.state.renter.filterResult.results.data.types;
    },
    totalType() {
      return this.$store.state.renter.filterResult.results.data.totalType;
    },
    page() {
      return this.$store.state.renter.filterResult.results.page;
    },
    categories: {
      get() {
        return this.$store.state.renter.home.categories.data;
      },
    },
    filter() {
      return this.$store.state.renter.filterResult.filter;
    },
  },
  created() {
    // if (this.categories.length === 0) {
    //   this.getAllCategories();
    // }
    this.setPageValue(1);
    this.get7dates();
    if (!this.list) {
      // let paramsStr = [];
      // paramsStr = window.$cookies.get('searchValue').split('&page=');
      // console.log(paramsStr);
      // this.paging.page = Number(paramsStr.split('&page')[1].split('&size')[0].split('=')[1]);
      const page = window.$cookies.get('page');
      this.setPageValue(1);
      if (page) {
        this.setPageValue(Number(window.$cookies.get('page')));
      }
      this.reSearch({
        paramsStr: window.$cookies.get('searchValue'),
      });
    }
    this.get7dates();
  },
};
</script>
<style>
.v-menu__content {
  border-radius: 0px !important;
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #e4eaf2 !important;
}
.v-application .primary--text {
  color: #727cf5 !important;
  caret-color: #727cf5 !important;
}
.theme--light.v-label {
  color: #313a46 !important;
  font-family: 'Nunito', sans-serif !important;
}
.v-list-item__title {
  font-size: 0.9rem !important;
  font-family: 'Nunito', sans-serif !important;
}
.v-input__slot {
  /* color: #313a46; */
  /* background-color: #eef2f7 !important;
  border-color: #eef2f7 !important; */
  border: 1px solid #e1e1e1 !important;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none !important;
}
</style>
