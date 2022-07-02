<template>
  <v-row no-gutters class="d-flex justify-center white">
    <v-col cols="11" sm="9" md="12">
      <v-overlay
        :value="isLoading"
        absolute
        v-if="isLoading && !isSearchError !== 500 && !isPageNotFound"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-container v-if="!isLoading && isSearchError !== 500 && !isPageNotFound">
        <v-dialog width="400" v-model="chatBox.show">
          <chatBox v-if="renter" v-on:close="chatBox.show = false" :info="info" :group="group" />
          <LoginBox v-if="!renter" />
        </v-dialog>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="8"
            class="d-flex flex-column pt-0 align-center align-sm-start"
          >
            <h2
              class="font-weight-bold font-nunito"
              :style="{ color: '#656565', fontSize: '1.25rem' }"
            >
              {{ group.address.streetName }}, {{ group.address.wardName }},
              {{ group.address.districtName }},
              {{ group.address.provinceName }}
            </h2>
            <span class="font-nunito text-primary font-weight-bold font-italic">
              {{ info.title }}
            </span>
            <div style="width: 100%" class="d-flex flex-wrap mt-1 justify-space-between">
              <div class="d-flex flex-column">
                <span
                  class="font-nunito text-body-1 d-flex align-end justify-space-between"
                  style="color: #333333"
                >
                  <v-icon color="#98a6ad" class="mr-1">mdi-vector-square</v-icon>
                  <span>{{ info.superficiality }}</span>
                  <span class="text-caption">m<sup>2</sup></span>
                </span>
                <span class="text-uppercase font-nunito text-caption" style="color: #656565"
                  >Diện tích</span
                >
              </div>
              <div class="d-flex flex-column">
                <span
                  class="font-nunito text-body-1 d-flex align-end justify-space-between"
                  style="color: #333333"
                >
                  <v-icon color="#98a6ad" class="mr-1">mdi-account-group-outline</v-icon>
                  <span class="mr-1">{{ info.capacity }}</span>
                </span>
                <span class="text-uppercase font-nunito text-caption" style="color: #656565"
                  >Sức chứa</span
                >
              </div>
              <div class="hidden-xs-only">
                <div
                  class="d-flex flex-column"
                  v-if="info.facilities.filter((f) => f.facilityName.includes('WC')).length !== 0"
                >
                  <span
                    class="font-nunito text-body-1 d-flex align-end justify-space-between"
                    style="color: #333333"
                  >
                    <v-icon color="#98a6ad" class="mr-1">mdi-human-male-female</v-icon>
                    <span class="mr-1">{{
                      info.facilities.filter((f) => f.facilityName.includes('WC'))[0].facilityName
                    }}</span>
                  </span>
                  <span class="text-uppercase font-nunito text-caption" style="color: #656565"
                    >Nhà vệ sinh</span
                  >
                </div>
              </div>
              <div class="d-flex flex-column">
                <span
                  class="font-nunito text-body-1 d-flex align-end justify-space-between"
                  style="color: #333333"
                >
                  <v-icon color="#98a6ad" class="mr-1">mdi-home-account</v-icon>
                  <span v-if="group.ownerJoin == false">Không</span>
                  <span v-else>Có</span>
                </span>
                <span class="text-uppercase font-nunito text-caption" style="color: #656565"
                  >Chung chủ</span
                >
              </div>
              <div class="d-flex flex-column">
                <span
                  class="font-nunito text-body-1 d-flex align-end justify-space-between"
                  style="color: #333333"
                >
                  <v-icon color="#98a6ad" class="mr-1">mdi-clock-check</v-icon>
                  <span v-if="group.curfewTime === null">Tự do</span>
                  <span v-else>{{ group.curfewTime }}</span>
                </span>
                <span class="text-uppercase font-nunito text-caption" style="color: #656565"
                  >Thời gian ra vào</span
                >
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="4" class="d-flex flex-column py-0">
            <div v-show="this.showBreadcrumbs">
              <v-breadcrumbs
                :items="getBreadcrumbs"
                class="font-nunito py-1 d-flex justify-center breadcrumbs"
              ></v-breadcrumbs>
            </div>
            <span class="font-weight-medium text-h5 text-primary text-center" v-if="info.price > 0"
              >{{ info.price }} {{ info.priceUnit }}/tháng</span
            >
            <span class="font-weight-medium text-h5 text-primary text-center" v-else>Miễn phí</span>
            <v-row class="d-flex justify-end align-end">
              <v-col cols="12" md="11" class="d-flex rounded-0 d-flex justify-space-around">
                <div
                  style="width: 100%; height: 50px; background-color: #f6f7f9"
                  class="d-flex align-center px-1 rounded-pill"
                >
                  <v-icon large class="white rounded-circle pa-1" _style="height: 100%;"
                    >mdi-home-currency-usd</v-icon
                  >
                  <v-col cols="5" class="d-flex flex-column">
                    <span class="text-uppercase font-nunito text-caption font-weight-medium"
                      >Cọc thế chân</span
                    >
                    <span class="font-nunito text-caption" v-if="info.deposit > 0"
                      >{{ info.deposit }} tháng tiền thuê</span
                    >
                    <span class="font-nunito text-caption" v-else>Không cọc</span>
                  </v-col>
                  <v-col cols="5" class="d-flex flex-column">
                    <span class="text-uppercase font-nunito text-caption font-weight-medium"
                      >Cọc giữ chỗ</span
                    >
                    <span class="font-nunito text-caption" v-if="group.downPayment !== 0">{{
                      getDownPayment(group.downPayment, info.priceUnit)
                    }}</span>
                    <span class="font-nunito text-caption" v-else>Không cần</span>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="justify-center py-0">
          <v-col cols="12" sm="12" md="8" lg="8" class="py-0">
            <v-carousel
              cycle
              height="400"
              delimiter-icon="mdi-circle-medium"
              hide-delimiter-background
              show-arrows-on-hover
              v-if="images.length !== 0"
            >
              <v-carousel-item v-for="(image, i) in images" :key="i" :src="images[i]">
              </v-carousel-item>
              <div class="category">
                <span class="font-weight-bold text-body-1 yellow--text">
                  {{ group.category.categoryName }}
                </span>
                <br />
                <span class="text-caption">{{ info.view }} lượt xem</span>
              </div>
              <div
                class="arrow-price d-flex flex-column"
                v-if="searchValue && (info.schoolmate !== 0 || info.compatriot !== 0)"
              >
                <span class="text-caption" v-if="schoolSelected && info.schoolmate !== 0">
                  <v-icon color="#ABB4C0" class="mr-2">school</v-icon>
                  <span class="text-caption"
                    >{{ info.schoolmate }} người học {{ schoolSelected.schoolName }}</span
                  >
                </span>
                <span class="text-caption" v-if="hometownSelected && info.compatriot !== 0">
                  <v-icon color="#ABB4C0" class="mr-2">supervisor_account</v-icon>
                  <span class="text-caption"
                    >{{ info.compatriot }} người quê {{ hometownSelected.provinceName }}</span
                  >
                </span>
              </div>
            </v-carousel>
            <v-img
              src="@/assets/error-no-image.png"
              v-else
              min-height="250"
              max-height="400"
              contain
              style="box-shadow: 0 0 35px 0 rgba(255, 22, 22, 0.15) !important"
            >
              <div class="category">
                <span class="font-weight-bold text-body-1 yellow--text">
                  {{ group.category.categoryName }}
                </span>
                <br />
                <span class="text-caption">{{ info.view }} lượt xem</span>
              </div>
              <div
                class="arrow-price d-flex flex-column"
                v-if="searchValue && (info.schoolmate !== 0 || info.compatriot !== 0)"
              >
                <span class="text-caption" v-if="schoolSelected && schoolMate !== 0">
                  <v-icon color="#ABB4C0" class="mr-2">school</v-icon>
                  <span class="text-caption"
                    >{{ info.schoolmate }} người học {{ schoolSelected.schoolName }}</span
                  >
                </span>
                <span class="text-caption" v-if="hometownSelected && compatriot !== 0">
                  <v-icon color="#ABB4C0" class="mr-2">supervisor_account</v-icon>
                  <span class="text-caption"
                    >{{ info.compatriot }} người quê {{ hometownSelected.provinceName }}</span
                  >
                </span>
              </div>
            </v-img>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4" class="d-flex py-0">
            <v-row class="d-flex justify-end py-0" style="min-height: 350px !important">
              <v-col cols="12" sm="12" md="11" class="py-0">
                <dateTimePickerBox
                  :name="group.groupName"
                  :avatar="group.imgUrl"
                  :rating="{ average: 3.5, total: 30 }"
                  :groupId="group.groupId"
                  :type="info"
                  :vendorId="group.vendorId"
                  :currentBooking="info.currentBooking"
                  :availableRoom="info.availableRoom"
                  v-on:openMessage="chatBox.show = true"
                  style="display: sticky !important; top: 10"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="12" md="4" v-if="info.facilities.length !== 0">
            <span class="text-subtitle-1 font-nunito font-weight-bold" :style="{ color: '#484848' }"
              >TIỆN NGHI</span
            >
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '30%' }"></div>
              <div class="line-before" :style="{ width: '90%' }"></div>
            </div>
            <facilitiesBox :facilities="info.facilities" />
          </v-col>
          <v-col cols="12" md="4" v-if="group.services.length !== 0">
            <servicesBox :services="group.services" />
          </v-col>
          <v-col cols="12" md="4" v-if="group.regulations.length !== 0">
            <v-row class="d-flex justify-end py-0">
              <v-col cols="12" sm="12" md="11" class="py-0">
                <span
                  class="text-subtitle-1 font-nunito font-weight-bold"
                  :style="{ color: '#484848' }"
                  >QUY ĐỊNH</span
                >
                <div class="d-flex mt-3" :style="{ width: '100%' }">
                  <div class="line-after" :style="{ width: '30%' }"></div>
                  <div class="line-before" :style="{ width: '90%' }"></div>
                </div>
                <regulationsBox :regulations="group.regulations" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <!-- tien nghi xung quanh -->
          <v-col cols="12" md="8">
            <!-- <v-btn color="success" class="ml-1" depressed tile>
                  <v-icon small>fas fa-map-signs</v-icon>Bản đồ
            </v-btn>-->
            <treeView :utitlities="utilities" v-if="utilities.length > 0" />
          </v-col>
        </v-row>
        <v-row class="mt-5" v-if="statistic && (districtStat || wardStat || streetStat)">
          <v-col cols="12" md="8">
            <span class="text-subtitle-1 font-nunito font-weight-bold" :style="{ color: '#484848' }"
              >GIÁ TRUNG BÌNH MỘT PHÒNG TRỌ TRONG KHU VỰC</span
            >
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '15%' }" />
              <div class="line-before" :style="{ width: '85%' }" />
            </div>
            <v-row class="d-flex flex-wrap mx-0 font-nunito text-subtitle-2">
              <v-col cols="12" md="6" class="pl-0" v-if="districtStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">
                    {{ districtStat.districtName }}
                  </v-col>
                  <span class="font-weight-bold mx-auto"
                    >{{ districtStat.avgPrice }} triệu/tháng</span
                  >
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pl-0" v-if="wardStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">{{ wardStat.wardName }}</v-col>
                  <span class="font-weight-bold mx-auto">{{ wardStat.avgPrice }} triệu/tháng</span>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pl-0" v-if="streetStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">
                    {{ streetStat.streetName }}
                  </v-col>
                  <span class="font-weight-bold mx-auto">
                    {{ streetStat.avgPrice }} triệu/tháng
                  </span>
                </div>
              </v-col>
              <v-col cols="6" class="pl-0">
                <v-btn
                  class="align-center font-weight-medium text-primary-hover"
                  text
                  height="100%"
                  :to="`/discovery/${this.group.address.districtId}`"
                >
                  Xem thêm
                  <v-icon>double_arrow</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mt-5" v-if="statistic && (districtStat || wardStat || streetStat)">
          <v-col cols="12" md="8">
            <span class="text-subtitle-1 font-nunito font-weight-bold" :style="{ color: '#484848' }"
              >DIỆN TÍCH TRUNG BÌNH MỘT PHÒNG TRỌ TRONG KHU VỰC</span
            >
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '15%' }" />
              <div class="line-before" :style="{ width: '85%' }" />
            </div>
            <v-row class="d-flex flex-wrap mx-0 font-nunito text-subtitle-2">
              <v-col cols="12" md="6" class="pl-0" v-if="districtStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">
                    {{ districtStat.districtName }}
                  </v-col>
                  <span class="font-weight-bold mx-auto"
                    >{{ districtStat.avgSuperficiality }} m<sup>2</sup></span
                  >
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pl-0" v-if="wardStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">{{ wardStat.wardName }}</v-col>
                  <span class="font-weight-bold mx-auto"
                    >{{ wardStat.avgSuperficality }} m<sup>2</sup></span
                  >
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pl-0" v-if="streetStat">
                <div class="average-item d-flex align-center">
                  <v-col cols="7" class="d-flex average-infor">
                    {{ streetStat.streetName }}
                  </v-col>
                  <span class="font-weight-bold mx-auto">
                    {{ streetStat.avgSuperficality }} m<sup>2</sup>
                  </span>
                </div>
              </v-col>
              <v-col cols="6" class="pl-0">
                <v-btn
                  class="align-center font-weight-medium text-primary-hover"
                  text
                  height="100%"
                  :to="`/discovery/${this.group.address.districtId}`"
                >
                  Xem thêm
                  <v-icon>double_arrow</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mt-10">
          <v-col cols="12" md="8">
            <span class="text-subtitle-1 font-nunito font-weight-bold" :style="{ color: '#484848' }"
              >ĐÁNH GIÁ PHÒNG TRỌ</span
            >
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '15%' }" />
              <div class="line-before" :style="{ width: '85%' }" />
            </div>
            <ratingBox class="mt-5" :rating="{ average: 3.5, total: 30 }" />
          </v-col>
        </v-row>
        <v-row
          class="mt-10"
          v-if="
            renter &&
            (renter.school || renter.hometown) &&
            suggestedTypes.data &&
            suggestedTypes.data.types &&
            suggestedTypes.data.types.length > 0
          "
        >
          <v-col cols="12" md="8">
            <div class="d-flex">
              <span
                class="text-subtitle-1 font-nunito font-weight-bold"
                :style="{ color: '#484848' }"
                >CÓ THỂ BẠN SẼ THÍCH</span
              >
            </div>
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '15%' }" />
              <div class="line-before" :style="{ width: '85%' }" />
            </div>
            <!-- {{ suggestedTypes }} -->
            <SuggestionList :list="suggestedTypes.data.types" class="mt-5" />
          </v-col>
        </v-row>
        <!-- <v-row class="mt-10">
          <v-col cols="12" md="12">
            <div class="d-flex">
              <span
                class="text-subtitle-1 font-nunito font-weight-bold"
                :style="{ color: '#484848' }"
              >
                CÁC LOẠI PHÒNG KHÁC CỦA
                <span class="text-uppercase">{{ group.groupName }}</span>
              </span>
              <v-btn
                class="align-end font-weight-medium ml-auto"
                text
                height="100%"
                color="primary"
                _:to="`/discovery/${this.district.districtId}`"
              >
                Xem thêm
              </v-btn>
            </div>
            <div class="d-flex mt-3" :style="{ width: '100%' }">
              <div class="line-after" :style="{ width: '15%' }" />
              <div class="line-before" :style="{ width: '85%' }" />
            </div>
            <GroupHostelTypes :list="types" class="mt-5" />
          </v-col>
        </v-row> -->
      </v-container>
      <v-container v-if="isSearchError === 500">
        <v-row>
          <span>Lỗi server</span>
        </v-row>
      </v-container>
      <v-container v-if="isPageNotFound">
        <v-row>
          <span>Loại phòng này không tồn tại</span>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import dateTimePickerBox from '@/components/hostel_type/dateTimePickerBox.vue';
import treeView from '@/components/hostel_type/treeView.vue';
import chatBox from '@/components/hostel_type/chatBox.vue';
import { mapActions, mapGetters } from 'vuex';
import facilitiesBox from '../../components/hostel_type/facilitiesBox.vue';
import servicesBox from '../../components/hostel_type/servicesBox.vue';
import regulationsBox from '../../components/hostel_type/regulationsBox.vue';
import ratingBox from '../../components/hostel_type/ratingBox.vue';
import SuggestionList from '../../components/hostel_type/SuggestionList.vue';
// import GroupHostelTypes from '../../components/hostel_type/GroupHostelTypes.vue';
import LoginBox from '../../components/login/loginBox.vue';

export default {
  name: 'HostelDetail',
  props: {
    typeInput: Object,
  },
  components: {
    dateTimePickerBox,
    servicesBox,
    treeView,
    chatBox,
    facilitiesBox,
    regulationsBox,
    ratingBox,
    SuggestionList,
    // GroupHostelTypes,
    LoginBox,
  },
  data: () => ({
    chatBox: {
      show: false,
    },
    prevRoute: null,
  }),
  methods: {
    ...mapActions({
      getTypeAndGroup: 'renter/hostelType/getTypeAndGroup',
      getProvinces: 'renter/common/getProvinces',
      getDistrictStatistic: 'renter/discovery/getDistrictStatistic',
      getAllHostelTypes: 'renter/hostelGroup/getAllHostelTypes',
      getHostelGroup: 'renter/hostelGroup/getHostelGroup',
      getUtilities: 'renter/hostelGroup/getNearByUtilities',
      getSuggestedTypes: 'renter/hostelType/getSuggestedTypes',
      getFeedback: 'renter/hostelType/getFeedbacks',
    }),

    getNearByUtilities() {
      this.getUtilities({
        distance: '3',
        longitude: this.group.longitude,
        latitude: this.group.latitude,
      });
    },
    getDownPayment(downPayment, priceUnit) {
      if (priceUnit === 'triệu') {
        if (downPayment < 1) {
          return `${downPayment * 1000} nghìn`;
        }
        return `${downPayment} triệu`;
      }
      return `${downPayment} triệu`;
    },
    getTypeById(listTypes) {
      return listTypes.find((type) => type.typeId === Number(this.typeId));
    },
    getGroupById(listGroup, id) {
      return listGroup.find((group) => group.groupId === Number(id));
    },
  },
  computed: {
    ...mapGetters({
      getAverage: 'renter/discovery/getAverage',
    }),
    typeId() {
      return this.$route.params.typeId;
    },
    showBreadcrumbs() {
      if (this.prevRoute && this.prevRoute.fullPath) {
        const preURL = this.prevRoute.path;
        return (
          preURL.includes('result') && preURL.includes('latitude') && preURL.includes('longitude')
        );
      }
      return false;
    },
    getBreadcrumbs() {
      let preURL = '';
      let disablePreURL = true;
      if (this.prevRoute && this.prevRoute.fullPath) {
        preURL = this.prevRoute.fullPath;
        disablePreURL = false;
      }
      const breadcrumbs = [
        {
          text: 'Trang chủ',
          disabled: false,
          href: '/',
        },
        {
          text: 'Kết quả tìm kiếm',
          disabled: disablePreURL,
          href: preURL,
        },
        {
          text: 'Chi tiết phòng',
          disabled: true,
        },
      ];
      return breadcrumbs;
    },
    images: {
      get() {
        if (this.info) {
          return this.info.imageUrls.map((item) => item.resourceUrl);
        }
        return [];
      },
    },
    hostelTypes: {
      get() {
        return this.$store.state.renter.home.hostelTypes.data;
      },
    },
    isLoading() {
      const type = this.$store.state.renter.hostelType.hostelType.isLoading;
      const group = this.$store.state.renter.hostelType.hostelGroup.isLoading;
      const utilities = this.$store.state.renter.hostelGroup.utilities.isLoading;
      const suggestionList = this.$store.state.renter.hostelType.suggestedTypes.isLoading;
      const types = this.$store.state.renter.hostelGroup.hostelTypes.isLoading;
      const statistic = this.$store.state.renter.discovery.stats.district.isLoading;
      const feedback = this.$store.state.renter.hostelType.feedback.isLoading;
      // const loadingBookings = this.$store.state.user.bookings.isLoading;
      return type || group || statistic || suggestionList || utilities || types || feedback;
    },
    isPageNotFound() {
      const type = this.$store.state.renter.hostelType.hostelType.error;
      return type;
    },
    isSearchError() {
      return this.$store.state.renter.hostelType.suggestedTypes.error;
    },
    isLoadingProvinces() {
      return this.$store.state.renter.common.provinces.isLoading;
    },
    info() {
      console.log(this.typeId);
      let data = null;
      data = this.$store.state.renter.home.topView.data; // get from top view - home page
      let type = null;
      type = this.getTypeById(data);
      if (!type) {
        data = this.$store.state.renter.home.hostelTypes.data; // get from top suggestion - home page
        type = this.getTypeById(data);
        const result = this.$store.state.renter.filterResult.results.data.types;
        if (!type && result) {
          data = result;
          type = this.getTypeById(data);
        }
        const suggestionTypes = this.$store.state.renter.hostelType.suggestedTypes.data.types;
        if (!type && suggestionTypes) {
          data = suggestionTypes;
          type = this.getTypeById(data);
        }
        if (!type) {
          type = this.$store.state.renter.hostelType.hostelType.data;
        }
      }
      return type;
    },
    group() {
      let data = null;
      let group = null;

      if (this.info) {
        const { groupId } = this.info;
        data = this.$store.state.renter.home.topViewHostelGroup.data; // get from top view - home page
        group = this.getGroupById(data, groupId);
        if (!group) {
          data = this.$store.state.renter.home.hostelGroups.data; // get from top suggestion - home page
          group = this.getGroupById(data, groupId);
          const searchResult = this.$store.state.renter.filterResult.results.data.groups;
          if (!group && searchResult) {
            data = searchResult; // get from search result
            group = this.getGroupById(data, groupId);
          }
          const suggestionTypes = this.$store.state.renter.hostelType.suggestedTypes.data.groups;
          if (!group && suggestionTypes) {
            data = suggestionTypes;
            group = this.getGroupById(data, groupId);
          }
          if (!group) {
            group = this.$store.state.renter.hostelType.hostelGroup.data;
          }
        }
      }
      return group;
    },
    renter() {
      const renter = this.$store.state.user.user.data;
      const suggestionTypes = this.$store.state.renter.hostelType.suggestedTypes;
      if (
        renter &&
        renter.role === 'RENTER' &&
        !suggestionTypes.data.types &&
        renter.school &&
        renter.hometown
      ) {
        this.getSuggestedTypes({
          universityId: renter.school.schoolId,
          provinceId: renter.hometown.provinceId,
          size: 20,
        });
      }
      return renter;
    },
    loginRouteObject() {
      return {
        name: 'Login',
        params: {
          preUrl: this.$route.path,
        },
      };
    },
    registerRouteObject() {
      return {
        name: 'Register',
        params: {
          preUrl: this.$route,
        },
      };
    },
    utilities() {
      return this.$store.state.renter.hostelGroup.utilities.data;
    },
    types() {
      return this.$store.state.renter.hostelGroup.hostelTypes.data;
    },
    statistic() {
      console.log(this.$store.state.renter.discovery.stats.district.data);
      return this.$store.state.renter.discovery.stats.district.data;
    },
    proviceStat() {
      console.log(this.group.address);
      if (this.group.address && this.group.address.provinceId) {
        return this.statistic.provinces.filter(
          (p) => p.provinceId === this.group.address.provinceId,
        )[0];
      }
      return null;
    },
    districtStat() {
      if (this.proviceStat) {
        return this.proviceStat.districts.filter(
          (d) => d.districtId === this.group.address.districtId,
        )[0];
      }
      return null;
    },
    wardStat() {
      if (this.districtStat) {
        return this.districtStat.wards.filter((w) => w.wardId === this.group.address.wardId)[0];
      }
      return null;
    },
    streetStat() {
      if (this.wardStat) {
        return this.wardStat.streets.filter((s) => s.streetId === this.group.address.streetId)[0];
      }
      return null;
    },
    searchValue() {
      return window.$cookies.get('searchValue');
    },
    school() {
      return this.$store.state.renter.filterResult.filter.schools;
    },
    schoolSelected() {
      if (this.searchValue && this.searchValue.includes('schoolId')) {
        const schoolIdSelected = Number(this.searchValue.split('&schoolId=')[1].split('&')[0]);
        return this.school.items.find((i) => i.schoolId === schoolIdSelected);
      }
      return null;
    },
    schoolMate() {
      return window.$cookies.get('schoolMate');
    },
    hometown() {
      return this.$store.state.renter.filterResult.filter.hometown;
    },
    hometownSelected() {
      if (this.searchValue && this.searchValue.includes('provinceId')) {
        const hometownIdSelectd = Number(this.searchValue.split('&provinceId=')[1].split('&')[0]);
        return this.hometown.items.find((p) => p.provinceId === hometownIdSelectd);
      }
      return null;
    },
    compatriot() {
      return window.$cookies.get('compatriot');
    },
    suggestedTypes() {
      return this.$store.state.renter.hostelType.suggestedTypes;
    },
    feedbacks() {
      return this.$store.state.renter.hostelType.feedback.data;
    },
  },
  created() {
    // if home.js store is empty then start to call api
    if (!this.info) {
      this.getTypeAndGroup(this.typeId)
        .then(() => this.getNearByUtilities())
        .then(() => this.getAllHostelTypes(this.group.groupId))
        .then(() => this.getDistrictStatistic(this.group.address.districtId));
    } else {
      this.getNearByUtilities();
      this.getDistrictStatistic(this.group.address.districtId);
    }
    this.getFeedback(this.typeId);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from; // eslint-disable-line
    });
  },
};
</script>
<style scoped>
.info-card {
  width: 100%;
  height: 100%;
  border: 2.5px solid #edefee;
  box-sizing: border-box;
  border-radius: 10px;
}
.above {
  width: 100%;
}
.below {
  width: 100%;
  background: #f3f5f5;
  /* background: #f7f7f7; */
}
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.line-before {
  height: 2px;
  background-color: rgba(152, 166, 173, 0.2);
}
.line-after {
  height: 2px;
  background-color: #727cf5;
}
.average-item {
  border: solid 1px #eeeeee;
}
.average-infor {
  background-color: #eeeeee;
}
</style>
<style>
.v-breadcrumbs__item {
  color: #727cf5 !important;
}
.v-application a:hover {
  color: #4250f2 !important;
}
.v-breadcrumbs__item--disabled {
  color: rgba(0, 0, 0, 0.38) !important;
}
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.line-before {
  height: 2px;
  background-color: rgba(152, 166, 173, 0.2);
}
.line-after {
  height: 2px;
  background-color: #727cf5;
}
</style>
<style>
.category {
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  width: auto;
  max-width: 80%;
  padding: 8px 16px;
  background: rgba(32, 112, 185, 0.66);
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 24px;
  box-sizing: border-box;
}
</style>
