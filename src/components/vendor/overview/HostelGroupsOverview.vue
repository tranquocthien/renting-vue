<template>
  <div v-if="!groups.isLoading && groups.data.length > 0">
    <v-row class="d-flex justify-space-between ma-0">
      <v-col cols="12" class="pl-md-13 py-0 d-flex justify-center justify-md-start">
        <span class="div-title">Tổng quan về các khu trọ của bạn</span>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-space-between ma-0 pl-md-13 mt-5">
      <v-col cols="12" md="4" class="py-0 mb-3">
        <v-card class="pa-4">
          <div class="d-flex">
            <span
              style="letter-spacing: 0.02em; font-weight: 700;"
              class="text-gray font-nunito size9rem mb-3"
              >CÁC KHU TRỌ</span
            >
          </div>
          <v-virtual-scroll
            :items="groups.data"
            :item-height="90"
            height="280"
            class="hidden-sm-and-down"
          >
            <template v-slot="{ item, index }">
              <v-list-item :key="item.groupId" class="px-0 d-flex justify-start align-start">
                <!-- <small
                  class="font-weight-bold size9rem font-nunito cursor red mr-4 pa-1"
                  style="border-radius: 50%;"
                  >{{ index + 1 }}</small
                > -->
                <span class="d-flex flex-column">
                  <span
                    class="font-weight-bold size9rem font-nunito cursor"
                    @click="clickGroup(item)"
                    v-bind:style="index % 2 === 0 ? 'color: #727cf5;' : 'color: #39afd1;'"
                    >{{ item.groupName }}</span
                  >
                  <small class="text-gray font-nunito mt-2"
                    >{{ item.buildingNo }} {{ item.address.streetName }},
                    {{ item.address.districtName }}, {{ item.address.provinceName }}</small
                  >
                </span>
              </v-list-item>
            </template>
          </v-virtual-scroll>
          <v-select
            v-model="selectedGroupInMobile"
            :items="groups.data"
            item-value="groupId"
            label="Nhà trọ"
            class="text-body-2 hidden-md-and-up"
            filled
            dense
            solo
            outlined
            color="#3645f1"
            background-color="white"
            :style="{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
            }"
          >
            <template slot="selection" slot-scope="{ item }">
              <span class="font-nunito font-weight-medium text-body-2">{{ item.groupName }}</span>
            </template>
            <template slot="item" slot-scope="{ item }">
              <span class="d-flex flex-column" @click="clickGroup(item)">
                <span class="font-weight-bold size9rem font-nunito cursor text-primary mt-3">{{
                  item.groupName
                }}</span>
                <small class="text-gray font-nunito"
                  >{{ item.buildingNo }} {{ item.address.streetName }},
                  {{ item.address.districtName }}, {{ item.address.provinceName }}</small
                >
              </span>
            </template>
          </v-select>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" class="py-0 mb-3">
        <v-card class="pa-4">
          <div class="d-flex flex-column">
            <span
              style="letter-spacing: 0.02em; font-weight: 700;"
              class="text-gray font-nunito size9rem mb-3"
              >THỐNG KÊ</span
            >
            <div style="height: 280px;" class="d-flex flex-column">
              <HostelGroupStatistic :group="selectedGroup" _v-if="!isMobile" />
              <span
                style="letter-spacing: 0.02em; font-weight: 700;"
                class="text-gray font-nunito size9rem mt-4 mb-3"
                >CÁC PHÒNG SẮP HẾT HẠN HỢP ĐỒNG</span
              >
              <ExpiringRoom :groupId="selectedGroup.groupId" _v-if="!isMobile" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-card
      elevation="0"
      v-if="!groups.isLoading"
      class="d-flex flex-column pa-2 mt-16"
      style="height: 100%;"
    >
      <v-divider />
      <div
        v-if="groups.data.length > 0"
        style="height: calc(100% - 32px);"
        class="d-flex flex-row flex-nowrap"
      >
        <div style="min-width: 30%; overflow-y: auto;">
          <vue-scroll>
            <v-list three-line>
              <v-list-item-group v-model="selectedGroupIndex" mandatory>
                <v-list-item
                  v-for="group in groups.data"
                  :key="group.groupId"
                  @click="openMobileDialog"
                >
                  <v-list-item-avatar>
                    <v-avatar color="green" size="36"
                      ><span class="white--text headline">{{
                        getShortName(group.groupName)
                      }}</span></v-avatar
                    >
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ group.groupName }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon>location_on</v-icon>
                      {{ group.address.streetName }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action v-if="isMobile">
                    <v-btn icon large>
                      <v-icon color="grey lighten-1">insert_link</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </vue-scroll>
        </div>
        <div style="max-width: 40%; overflow-y: hidden;" class="d-flex flex-row">
          <v-divider vertical />
          <ExpiringRoom :groupId="selectedGroup.groupId" v-if="!isMobile" />
        </div>
        <div style="max-width: 30%; overflow-y: hidden;" class="d-flex flex-row">
          <v-divider vertical />
          <HostelGroupStatistic :group="selectedGroup" v-if="!isMobile" />
        </div>
      </div>
      <div v-if="groups.data.length == 0">
        <v-card>
          <v-card-text>
            Hiện tại bạn đang chưa có khu trọ nào.
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" tile outlined to="/vendor/management">
              <v-icon>add</v-icon> Tạo khu trọ
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-dialog
        v-model="mobileOverviewDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        class="hidden-md-and-up"
      >
        <v-card v-if="selectedGroup">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="mobileOverviewDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ selectedGroup.groupName }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <div style="height: calc(100vh - 64px); overflow-y: hidden;" class="d-flex flex-column">
            <div>
              <HostelGroupStatistic :group="selectedGroup" />
            </div>
            <v-divider />
            <div class="d-flex flex-column" style="height: 400px; overflow-y: hidden;">
              <ExpiringRoom :groupId="selectedGroup.groupId" />
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-card> -->
  </div>
</template>
<script>
import ExpiringRoom from './ExpiringRoom.vue';
import HostelGroupStatistic from './HostelGroupStatistic.vue';

export default {
  name: 'HostelGroupsOverview',
  components: { ExpiringRoom, HostelGroupStatistic },
  data: () => ({
    selectedGroupIndex: null,
    selectedGroup: null,
    mobileOverviewDialog: false,
    groupId: null,
    selectedGroupInMobile: null,
  }),
  created() {
    if (this.groups.data.length > 0) {
      this.selectedGroupIndex = 0;
      [this.selectedGroup] = this.groups.data;
      this.selectedGroupInMobile = this.groups.data[0].groupId;
    }
  },
  methods: {
    getShortName(fullName) {
      const tokens = fullName.split(' ');
      return tokens.reverse()[0].substring(0, 1);
    },
    expiredDate(startTime, duration) {
      // startTime : milisecond
      // duration : number of months
      console.log(startTime);
      console.log(duration);
      const date = new Date(startTime);
      date.setMonth(date.getMonth() + duration);
      console.log(date);
      return this.convertDateToString(date);
    },
    convertDateToString(d) {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const date = d.getDate();
      return `${date}/${month}/${year}`;
    },
    openMobileDialog() {
      if (this.isMobile) this.mobileOverviewDialog = true;
    },
    clickGroup(group) {
      this.selectedGroup = group;
    },
  },
  computed: {
    groups() {
      return this.$store.state.vendor.group.groups;
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true;
        case 'sm':
          return true;
        default:
          return false;
      }
    },
  },
  watch: {
    selectedGroupIndex() {
      this.selectedGroup = this.groups.data[this.selectedGroupIndex];
    },
  },
};
</script>
<style scoped>
.text-info {
  color: #39afd1 !important;
}
</style>
