<template>
  <!-- eslint-disable max-len -->
  <v-row no-gutters class="d-flex justify-center content">
    <v-col cols="12" sm="9" md="10" lg="9" xl="8">
      <v-overlay :value="isLoading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-container v-if="!isLoading">
        <v-container>
          <v-row class="mt-5">
            <v-card class="bg-primary pa-7" style="width: 100%">
              <v-row>
                <v-col cols="12" md="7" class="d-flex align-center">
                  <!-- <v-avatar height="100" width="100" color="#4F60C9" style="border: 5px solid #fff;">
                  <span class="text-h4 white--text"></span>
                  <v-img v-elsemax-height="100" max-width="100" :src="group.imgUrl" />
                </v-avatar> -->
                  <div class="d-flex flex-column ml-7">
                    <span class="text-white-50 font-nunito d-flex align-center text-subtitle-2">
                      <v-icon class="text-white-50 mr-1" small left>location_on</v-icon>
                      địa chỉ
                    </span>
                    <span class="white--text text-h5 font-nunito">{{
                      getRequestById.address
                    }}</span>
                  </div>
                </v-col>
                <v-col cols="12" md="5" class="d-flex flex-wrap align-center py-5">
                  <!-- <span class="white--text text-body-2 mx-5">
                  Loại phòng:
                  <span class="ml-3 black--text">loại</span>
                </span>
                <span class="white--text text-body-2 mx-5">
                  Số lượt thuê:
                  <span class="ml-3 black--text">lượt thuê</span>
                </span>
                <span class="white--text text-body-2 mx-5">
                  Tỉ lệ phản hồi chat:
                  <span class="ml-3 black--text">10</span>
                </span> -->
                  <v-row class="hidden-sm-and-up">
                    <v-col cols="5">
                      <span class="font-nunito pr-2 white--text text-body-2">Bán kính</span><br />
                      <span class="black--text font-nunito"
                        >{{ getRequestById.maxDistance }} km</span
                      >
                    </v-col>
                    <v-col cols="7">
                      <span class="font-nunito pr-2 white--text text-body-2"
                        >Diện tích tối thiểu</span
                      ><br />
                      <span class="black--text font-nunito"
                        >{{ getRequestById.minSuperficiality }} m2</span
                      >
                    </v-col>
                    <v-col cols="5">
                      <span class="font-nunito pr-2 white--text text-body-2">Giá tối đa</span><br />
                      <span class="black--text font-nunito"
                        >{{ getRequestById.maxPrice }} Triệu</span
                      >
                    </v-col>
                    <v-col cols="7">
                      <span class="font-nunito pr-2 white--text text-body-2">Ngày nhận phòng</span
                      ><br />
                      <span class="black--text font-nunito">{{
                        new Date(getRequestById.dueTime).toLocaleDateString('vi')
                      }}</span>
                    </v-col>
                  </v-row>
                  <v-row class="hidden-sm-and-down">
                    <v-col cols="5">
                      <span class="font-nunito pr-2 white--text text-h6">Bán kính</span><br />
                      <span class="black--text font-nunito text-h6"
                        >{{ getRequestById.maxDistance }} km</span
                      >
                    </v-col>
                    <v-col cols="7">
                      <span class="font-nunito pr-2 white--text text-h6"
                        >Diện tích tối thiểu</span
                      ><br />
                      <span class="black--text font-nunito text-h6"
                        >{{ getRequestById.minSuperficiality }} m2</span
                      >
                    </v-col>
                    <v-col cols="5">
                      <span class="font-nunito pr-2 white--text text-h6">Giá tối đa</span><br />
                      <span class="black--text font-nunito text-h6"
                        >{{ getRequestById.maxPrice }} Triệu</span
                      >
                    </v-col>
                    <v-col cols="7">
                      <span class="font-nunito pr-2 white--text text-h6">Ngày nhận phòng</span
                      ><br />
                      <span class="black--text font-nunito text-h6">{{
                        new Date(getRequestById.dueTime).toLocaleDateString('vi')
                      }}</span>
                    </v-col>
                  </v-row>
                  <!-- <v-btn @click="getRequest()">aa</v-btn> -->
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <v-row class="mt-10 d-flex justify-center">
            <v-col cols="9" md="3" class="pa-0 mb-10">
              <hostelTypeFilter :types="result.types" />
            </v-col>
            <v-col cols="0" md="1"></v-col>
            <v-col cols="9" md="8" class="pa-0" v-if="!isLoading">
              <div v-if="result.types.length === 0 || filterResult.length === 0"
              class="d-flex justify-center">
                  <span class="font-nunito text-muted text-h6 pt-10">Không có kết quả</span>
              </div>
              <div v-else>
                <ListTypesForRequest
                  :list="filterResult"
                  :groups="result.groups"
                  :page="page"
                  :pageRange="pageRange"
                />
                <v-pagination
                  class="mt-4"
                  v-model="page"
                  :length="getTotalPage"
                  prev-icon="mdi-menu-left"
                  next-icon="mdi-menu-right"
                  color="#727cf5"
                ></v-pagination>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
import hostelTypeFilter from '../../components/hostelGroup/TypesFilter.vue';
import ListTypesForRequest from '../../components/hostelGroup/ListTypesForRequest.vue';

export default {
  name: 'HostelSuggest',
  components: { hostelTypeFilter, ListTypesForRequest },
  data: () => ({
    rate: '3.5',
    page: 1,
    pageRange: 5,
    bottomSheet: {
      show: false,
    },
    isLoadingResult: false,
    result: [],
    // totalData: {
    //   groupTotal: {},
    //   typeTotal: [],
    // },
  }),
  methods: {
    ...mapActions({
      //   getHostelGroup: 'renter/hostelGroup/getHostelGroup',
      //   getAllHostelTypes: 'renter/hostelGroup/getAllHostelTypes',
      filterTypes: 'renter/hostelGroup/filterHostelType',
      getRoomRequests: 'user/getRoomRequests',
      getUser: 'user/getUser',
    }),
    // getAvatarTitle() {
    //   return this.group.groupName
    //     .substring(this.group.groupName.lastIndexOf(' ') + 1)
    //     .substring(0, 1);
    // },
    initFilter() {
      this.filterTypes({
        types: this.result.types,
        filterParam: null,
      });
    },
    getResult() {
      const { requestId } = this.$route.params;
      console.log(requestId);
      this.isLoadingResult = true;
      try {
        axios.get(`/api/v1/types?requestId=${requestId}`).then((res) => {
          this.result = res.data.data;
          this.isLoadingResult = false;
        });
        console.log(this.result);
        return this.result;
      } catch (error) {
        console.log(error);
        this.isLoadingResult = false;
      }
      return this.result;
    },
    // getRequest() {
    //   console.log(this.result);
    // },
  },
  computed: {
    isLoading() {
      const filterResult = this.$store.state.renter.hostelGroup.filterResult.isLoading;
      return this.user.isLoading || this.isLoadingResult || filterResult;
    },
    ...mapState({
      requests: (state) => state.user.requests,
      user: (state) => state.user.user,
    }),
    getRequestById() {
      return this.requests.data.filter((item) => item.requestId === Number(this.requestId))[0];
    },
    requestId() {
      return this.$route.params.requestId;
    },
    // group() {
    //   let data = this.$store.getters['renter/home/getHostelGroupById'](this.groupId);
    //   if (data === null) {
    //     data = this.$store.state.renter.hostelGroup.hostelGroup.data;
    //   }
    //   return data;
    // },
    // types() {
    //   return this.$store.state.renter.hostelGroup.hostelTypes.data;
    // },
    filterResult() {
    //   if (this.$store.state.renter.hostelGroup.filterResult.data.length !== 0) {
      return this.$store.state.renter.hostelGroup.filterResult.data;
    //   }
    //   return this.result.types;
    },
    // list() {
    //   return this.filterResult.subarray(
    //     this.pageRange * (this.page - 1),
    //     this.pageRange * this.page,
    //   );
    // },
    // result() {
    //   if (this.types.length !== 0) {
    //     this.filterTypes({
    //       types: this.types,
    //       filterParam: null,
    //     });
    //   }
    //   return null;
    // },
    // getTypes() {
    //   if (this.filterResult) {
    //     return this.result.types.filter((item) => this.filterResult.forEach((element) => element.typeId === item.typeId));
    //   }
    //   return this.result.types;
    // },
    getTotalPage() {
      return Math.ceil(this.filterResult.length / this.pageRange);
    },
  },
  created() {
    // if home.js store is empty then start to call api
    // this.getHostelGroup(this.groupId);
    // this.getAllHostelTypes(this.groupId).then(() => this.initFilter());
    // .then(() => this.onPageChange());
    this.getResult();
    if (!this.user.data) {
      this.getUser().then(() => this.getRoomRequests().then(() => this.initFilter()));
    }
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
