<template>
  <!-- eslint-disable max-len -->
  <v-row no-gutters class="d-flex justify-center content">
    <v-col cols="12" sm="9" md="10" lg="9" xl="8">
      <v-overlay :value="isLoading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-container v-if="!isLoading">
        <v-row class="mt-5">
          <v-card class="bg-primary pa-7" style="width: 100%">
            <v-row>
              <v-col cols="12" md="7" class="d-flex align-center">
                <v-avatar height="100" width="100" color="#4F60C9" style="border: 5px solid #fff">
                  <span v-if="group.imgUrl === null" class="text-h4 white--text">{{
                    getAvatarTitle()
                  }}</span>
                  <v-img v-else max-height="100" max-width="100" :src="group.imgUrl" />
                </v-avatar>
                <div class="d-flex flex-column ml-7">
                  <span class="yellow--text text-h5 font-nunito">{{ group.groupName }}</span>
                  <span class="text-white-50 font-nunito d-flex align-center text-subtitle-2">
                    <!-- <v-icon class="text-white-50 mr-1" small>location_on</v-icon> -->
                    {{ group.address.streetName }} {{ group.address.districtName }}
                    {{ group.address.provinceName }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="5" class="d-flex flex-wrap align-center py-5">
                <span class="white--text text-body-2 mx-5">
                  Loại hình cho thuê:
                  <span class="ml-3 black--text">{{ group.category.categoryName }}</span>
                </span>
                <span class="white--text text-body-2 mx-5">
                  Nhóm loại <span v-if="group.category.categoryName === 'Phòng trọ'">phòng</span>
                  <span v-else-if="group.category.categoryName === 'Nhà nguyên căn'">nhà</span>
                  <span v-else-if="group.category.categoryName === 'Ký túc xá'">giường</span>
                  <span v-else>phòng</span> :
                  <span class="ml-3 black--text">{{ types.length }}</span>
                </span>
                <span class="white--text text-body-2 mx-5">
                  Số phòng:
                  <!-- todo -->
                  <span class="ml-3 black--text">{{ getTotalRooms() }}</span>
                </span>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
        <v-row class="mt-10 d-flex justify-center">
          <v-col cols="9" md="3" class="pa-0 mb-10">
            <hostelTypeFilter :types="types" />
          </v-col>
          <v-col cols="0" md="1"></v-col>
          <v-col cols="9" md="8" class="pa-0" v-if="!isLoading">
            <listTypes :list="filterResult" :group="group" :page="page" :pageRange="pageRange" />
            <v-pagination
              class="mt-4"
              v-model="page"
              :length="getTotalPage"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
              color="#727cf5"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import hostelTypeFilter from '../../components/hostelGroup/TypesFilter.vue';
import listTypes from '../../components/hostelGroup/ListTypes.vue';

export default {
  name: 'HostelGroup',
  components: { hostelTypeFilter, listTypes },
  data: () => ({
    rate: '3.5',
    page: 1,
    pageRange: 5,
    bottomSheet: {
      show: false,
    },
  }),
  methods: {
    ...mapActions({
      getHostelGroup: 'renter/hostelGroup/getHostelGroup',
      getAllHostelTypes: 'renter/hostelGroup/getAllHostelTypes',
      filterTypes: 'renter/hostelGroup/filterHostelType',
    }),
    getAvatarTitle() {
      return this.group.groupName
        .substring(this.group.groupName.lastIndexOf(' ') + 1)
        .substring(0, 1);
    },
    initFilter() {
      this.filterTypes({
        types: this.types,
        filterParam: null,
      });
    },
    getTotalRooms() {
      let rooms = 0;
      this.types.forEach((item) => {
        rooms += item.rooms.length;
      });
      return rooms;
    },
  },
  computed: {
    isLoading() {
      const group = this.$store.state.renter.hostelGroup.hostelGroup.isLoading;
      const types = this.$store.state.renter.hostelGroup.hostelTypes.isLoading;
      const filterResult = this.$store.state.renter.hostelGroup.filterResult.isLoading;
      return group || types || filterResult;
    },
    groupId() {
      return this.$route.params.groupId;
    },
    group() {
      let data = this.$store.getters['renter/home/getHostelGroupById'](this.groupId);
      if (data === null) {
        data = this.$store.state.renter.hostelGroup.hostelGroup.data;
      }
      return data;
    },
    types() {
      return this.$store.state.renter.hostelGroup.hostelTypes.data;
    },
    filterResult() {
      return this.$store.state.renter.hostelGroup.filterResult.data;
    },
    // list() {
    //   return this.filterResult.subarray(
    //     this.pageRange * (this.page - 1),
    //     this.pageRange * this.page,
    //   );
    // },
    result() {
      if (this.types.length !== 0) {
        this.filterTypes({
          types: this.types,
          filterParam: null,
        });
      }
      return null;
    },
    getTotalPage() {
      return Math.ceil(this.filterResult.length / this.pageRange);
    },
  },
  created() {
    // if home.js store is empty then start to call api
    this.getHostelGroup(this.groupId);
    this.getAllHostelTypes(this.groupId).then(() => this.initFilter());
    // .then(() => this.onPageChange());
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
