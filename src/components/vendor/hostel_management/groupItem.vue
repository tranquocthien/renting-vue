<template>
  <div>
    <div
      class="d-flex mx-4 align-center mb-0"
      v-bind:style="index % 2 !== 0 ? 'background-color: #f1f3fa;' : 'background-color: #fff;'"
      v-if="!isEmptyGroup"
    >
      <v-col cols="2" class="d-flex align-center">
        <div style="height: 50px" class="d-flex align-center">
          <span
            style="
              display: block;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            class="font-nunito text-gray size-sub-2"
          >
            {{ group.groupName }}
          </span>
        </div>
        <!-- <span class="font-nunito text-gray size-sub-2">{{ group.groupName }}</span> -->
      </v-col>
      <v-col
        cols="4"
        class="d-flex flex-column justify-center pt-2 pb-1 table-item cursor"
        @click="managementRooms()"
      >
        <HostelGroupStatistic :group="localGroup" />
        <span class="font-nunito text-info size-sub-2 ml-auto">
          {{ group.types.length }} <span>loại</span></span
        >
      </v-col>
      <v-col cols="3" class="d-flex align-center pt-2 pb-1">
        <span class="font-nunito text-gray size-sub-2"
          >{{ group.buildingNo }} {{ group.address.streetName }}, {{ group.address.wardName }},
          {{ group.address.districtName }} {{ group.address.provinceName }}</span
        >
      </v-col>
      <v-col cols="2" class="d-flex align-center justify-center pt-2 pb-1">
        <span class="font-nunito text-gray size-sub-2">{{ group.managerName }}</span>
      </v-col>
      <v-col cols="1" class="d-flex align-center justify-center pt-2 pb-1">
        <v-btn icon><v-icon small color="#98a6ad">mdi mdi-pencil</v-icon></v-btn>
        <v-btn icon><v-icon small color="#98a6ad">mdi mdi-delete</v-icon></v-btn>
      </v-col>
    </div>
    <div
      class="d-flex mx-4 align-center mb-0"
      v-bind:style="index % 2 !== 0 ? 'background-color: #f1f3fa;' : 'background-color: #fff;'"
      v-else
    >
      <v-col cols="2" class="d-flex align-center">
        <div style="height: 50px" class="d-flex align-center">
          <span
            style="
              display: block;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            class="font-nunito text-gray size-sub-2"
          >
            {{ group.groupName }}
          </span>
        </div>
      </v-col>
      <v-col cols="4" class="d-flex flex-column justify-center pt-2 pb-1">
        <v-row class="d-flex ma-0 pa-0">
          <v-col cols="9" class="pa-0">
            <v-btn
              @click="showTypeManagementdialog = true"
              min-width="100%"
              class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start"
              value="done"
              style="letter-spacing: 0.01rem !important"
              ><v-icon small class="mr-1">mdi-door-closed</v-icon>Tạo nhanh danh sách phòng</v-btn
            >
          </v-col>
          <v-col cols="3" class="pa-0 d-flex flex-column align-end text-gray font-nunito size9rem">
            <span class="font-nunito text-danger size9rem ml-auto">0 phòng</span>
            <span class="font-nunito text-info size-sub-2 ml-auto" v-if="group.types.length > 0"
              >{{ group.types.length }} <span>loại</span></span
            >
            <span class="font-nunito text-danger size-sub-2 ml-auto" v-else
              >{{ group.types.length }} <span>loại</span></span
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="d-flex align-center pt-2 pb-1">
        <span class="font-nunito text-gray size-sub-2"
          >{{ group.buildingNo }} {{ group.address.streetName }}, {{ group.address.wardName }},
          {{ group.address.districtName }}, {{ group.address.provinceName }}</span
        >
      </v-col>
      <v-col cols="2" class="d-flex align-center justify-center pt-2 pb-1">
        <span class="font-nunito text-gray size-sub-2">{{ group.managerName }}</span>
      </v-col>
      <v-col cols="1" class="d-flex align-center justify-center pt-2 pb-1">
        <v-btn icon><v-icon small color="#98a6ad">mdi mdi-pencil</v-icon></v-btn>
        <v-btn icon><v-icon small color="#98a6ad">mdi mdi-delete</v-icon></v-btn>
      </v-col>
    </div>
    <TypeManagementDialog
      :show="showTypeManagementdialog"
      @close="showTypeManagementdialog = false"
      :group="group"
    />
  </div>
</template>

<script>
import HostelGroupStatistic from '../overview/HostelGroupStatistic.vue';
import TypeManagementDialog from './type_management/TypesManagement.vue';

export default {
  name: 'groupItem',
  props: { group: Object, index: Number },
  components: { HostelGroupStatistic, TypeManagementDialog },
  data: () => ({
    showTypeManagementdialog: false,
  }),
  methods: {
    managementRooms() {
      // const route = this.$router.resolve(`managementRooms/${this.group.groupId}`);
      const route = this.$router.resolve({
        path: 'rooms',
        query: { hostel: `${this.group.groupId}` },
      });
      window.open(route.href, '_blank');
    },
  },
  computed: {
    isEmptyGroup() {
      if (this.localGroup.types.length === 0) {
        return true;
      }
      if (this.rooms.length === 0) {
        return true;
      }
      return false;
    },
    rooms() {
      let rooms = [];
      const { types } = this.$store.state.vendor.group.groups.data.find(
        (item) => item.groupId === this.group.groupId,
      );
      types.forEach((item) => {
        rooms = [...rooms, ...item.rooms];
      });
      return rooms;
    },
    localGroup() {
      return this.$store.state.vendor.group.groups.data.find(
        (item) => item.groupId === this.group.groupId,
      );
    },
  },
  created() {},
};
</script>

<style>
.table-item:hover {
  border: 1px solid #f1f3fa !important;
}
</style>
