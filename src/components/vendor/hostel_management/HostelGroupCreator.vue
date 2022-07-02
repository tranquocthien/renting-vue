<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    class="hidden-md-and-up"
  >
    <v-dialog v-model="groups.isCreating" hide-overlay persistent width="300">
      <v-card color="#727CF5" dark>
        <v-card-text>
          Đang tạo khu trọ mới
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackBarMixin.show"
      :multi-line="snackBarMixin.multiLine"
      :timeout="snackBarMixin.timeout"
      :absolute="snackBarMixin.absolute"
      :color="snackBarMixin.color"
    >
      {{ snackBarMixin.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="white">
      <v-toolbar dark color="#727CF5">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title v-if="this.create">Tạo khu phòng trọ mới</v-toolbar-title>
        <v-toolbar-title v-if="this.update">Cập nhật thông tin khu trọ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="doCreateHostelGroup" v-if="this.create">
            <v-icon left>add</v-icon>
            Tạo ngay
          </v-btn>
          <v-btn dark text v-if="this.update">
            <v-icon left>update</v-icon>
            Cập nhật ngay
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <TableOfContent :toc="toc" class="d-none" />
      <v-container fluid style="height: 300px;">
        <v-row>
          <v-col cols="12" md="6">
            <v-row id="name">
              <v-col cols="12">
                <v-card class="pa-5">
                  <span class="text-h6 ma-1"> <v-icon left>info</v-icon> Thông tin </span>
                  <v-row class="hidden-sm-and-down">
                    <v-col cols="9">
                      <v-text-field
                        v-model="newGroup.groupName"
                        placeholder="Tên của khu phòng trọ"
                        prepend-icon="closed_caption"
                        hide-details
                        class="ma-1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-switch
                        label="Chung chủ"
                        v-model="newGroup.ownerJoin"
                        hide-details
                        color="success"
                        class="ml-15 filter"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <v-row class="hidden-sm-and-up">
                    <v-col cols="12">
                      <v-text-field
                        v-model="newGroup.groupName"
                        placeholder="Tên của khu phòng trọ"
                        prepend-icon="closed_caption"
                        hide-details
                        class="ma-1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        label="Chung chủ"
                        v-model="newGroup.ownerJoin"
                        hide-details
                        color="success"
                        class="ml-3 filter"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newGroup.managerName"
                        placeholder="Chủ trọ"
                        prepend-icon="person"
                        hide-details
                        class="ma-1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newGroup.managerPhone"
                        placeholder="Số điện thoại"
                        prepend-icon="local_phone"
                        hide-details
                        class="ma-1"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
                <!-- <v-divider class="mt-6 mb-3" /> -->
                <!-- <HostelGroupRules @newValue="receiveNewRulesData" class="mt-3"/> -->
              </v-col>
              <v-col cols="12">
                <PlacePicker @newValue="receiveNewAddress" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" id="address" class="pa-0">
            <v-row>
              <v-col cols="12">
                <HostelGroupRules @newValue="receiveNewRulesData" class="mt-3" />
              </v-col>
              <v-col cols="12">
                <HostelGroupServiceEditor
                  :groupService="[]"
                  :create="true"
                  :update="false"
                  @newValue="receiveNewServiceData"
                />
              </v-col>
              <v-col cols="12">
                <v-card class="pa-5">
                  <span class="text-h6 ma-1"> <v-icon left>date_range</v-icon> Lịch rảnh </span>
                  <!-- <div class="d-flex justify-center">
                      <v-btn
                      color="#727CF5"
                      @click="e1 = 1"
                      dark
                    >
                      Thêm
                    </v-btn>
                    </div> -->
                  <div class="mt-2">
                    <ScheduleForCreated @newValue="receiveNewSchedule" />
                    <!-- <v-btn @click="receiveNewSchedule">a</v-btn> -->
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-dialog>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import snackBarMixin from '../../mixins/snackBar';
import PlacePicker from './PlacePicker.vue';
import HostelGroupRules from './HostelGroupRules.vue';
import HostelGroupServiceEditor from './HostelGroupServiceEditor.vue';
import TableOfContent from './TableOfContent.vue';
import ScheduleForCreated from '../schedule/ScheduleTableForCreated.vue';

export default {
  name: 'HostelGroupCreator',
  props: ['show', 'create', 'update'],
  mixins: [snackBarMixin],
  components: {
    PlacePicker,
    HostelGroupRules,
    HostelGroupServiceEditor,
    TableOfContent,
    ScheduleForCreated,
  },
  data: () => ({
    newGroup: {
      vendorId: 0,
      groupName: '',
      buildingNo: '',
      longitude: '',
      latitude: '',
      managerName: '',
      managerPhone: '',
      ownerJoin: false,
      imgUrl: null,
      address: {
        provinceId: 1,
        provinceName: 'Thành phố Hồ Chí Minh',
        districtId: null,
        districtName: '',
        wardId: null,
        wardName: '',
        streetId: null,
        streetName: '',
      },
      services: [],
      schedules: [],
    },
    toc: [
      {
        to: 'name',
        text: 'Tên khu trọ',
      },
      {
        to: 'address',
        text: 'Địa chỉ',
      },
      {
        to: 'service',
        text: 'Dịch vụ',
      },
    ],
  }),
  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      createHostelGroup: 'vendor/group/createHostelGroup',
    }),
    receiveNewServiceData(serviceList) {
      if (this.create) {
        this.newGroup.services = serviceList;
      }
    },
    receiveNewRulesData(obj) {
      if (this.create) {
        this.newGroup.regulations = obj.rule;
        if (!obj.time.openAllDay && obj.time.startTime && obj.time.endTime) {
          this.newGroup.curfewTime = `${obj.time.startTime} - ${obj.time.endTime}`;
        } else {
          this.newGroup.curfewTime = null;
        }
      }
    },
    receiveNewAddress(addressObj) {
      const { coords, address } = addressObj;
      this.newGroup.longitude = coords.longitude;
      this.newGroup.latitude = coords.latitude;
      this.newGroup.address = address;
      this.newGroup.buildingNo = address.buildingNo;
    },
    receiveNewSchedule(scheduleObj) {
      this.newGroup.schedules = scheduleObj;
      // console.log('new group');
      // console.log(this.newGroup.schedules);
    },
    checkCreatingGroup() {
      if (this.groups.success) {
        // this.showSnackBar(`Khu trọ ${this.newGroup.groupName} đã được tạo thành công`, {
        //   color: 'green',
        // });
        this.changeShow();
      } else {
        this.showSnackBar('Tạo khu trọ thất bại', { color: 'red' });
      }
    },
    changeShow() {
      this.show = false;
    },
    doCreateHostelGroup() {
      this.createHostelGroup(this.newGroup).then(() => this.checkCreatingGroup());
    },
  },
  computed: {
    ...mapState({
      groups: (state) => state.vendor.group.groups,
    }),
    user() {
      return this.$store.state.user.user.data;
    },
  },
  created() {
    if (!this.user) {
      this.getUser().then(() => {
        this.newGroup.vendorId = this.user.userId;
      });
    } else {
      this.newGroup.vendorId = this.user.userId;
    }
  },
};
</script>
