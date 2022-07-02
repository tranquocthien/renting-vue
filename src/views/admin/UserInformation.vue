<template>
  <div style="overflow-y: auto">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog width="500" persistent :value="uncheckedReserveFee.length > 0">
      <UnCheckedReservedFeeContracts :contracts="uncheckedReserveFee"/>
    </v-dialog>
    <div v-if="!isLoading">
      <v-row class="d-flex justify-space-between ma-0 pl-md-13 mt-5 font-nunito">
        <v-col cols="12" md="1" />
        <v-col cols="12" md="3" class="py-0 mb-3">
          <v-card class="pa-3">
            <div class="d-flex">
              <span
                style="letter-spacing: 0.02em; font-weight: 700"
                class="text-gray font-nunito size9rem mt-2"
                >KHU TRỌ</span
              >
              <!-- <v-spacer/>
            <div>
              <v-btn icon>
                <v-icon color="#727cf5">search</v-icon>
              </v-btn>
            </div> -->
            </div>
            <v-text-field
              label="Tìm kiếm khu trọ"
              v-model="searchQuery"
              append-icon="search"
              solo
              hide-details
              class="mt-3 text-muted pa-0 size-sub-2 chat mb-7 hidden-sm-and-down"
              height="35"
              rounded
            ></v-text-field>
            <v-virtual-scroll
              :items="groupSearch"
              :item-height="90"
              height="500px"
              class="pa-3 hidden-sm-and-down scrollbar"
              style="background-color: white"
              id="style-1"
            >
              <template v-slot="{ item, index }">
                <v-list-item :key="item.groupId" class="px-0 d-flex justify-start align-start">
                  <span class="d-flex flex-column" v-if="groupSearch.length !== 0">
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
                  <!-- <span class="d-flex flex-column" v-if="groupSearch.length === 0">
                  <span
                    class="font-weight-bold size9rem font-nunito cursor"
                    v-bind:style="index % 2 === 0 ? 'color: #727cf5;' : 'color: #39afd1;'"
                    >Không có khu trọ</span
                  >
                </span> -->
                </v-list-item>
                <!-- <v-list-item class="px-0 d-flex justify-start align-start" v-if="groupSearch.length === 0">
                <span class="d-flex flex-column">
                  <span
                    class="font-weight-bold size9rem font-nunito cursor"
                    v-bind:style="index % 2 === 0 ? 'color: #727cf5;' : 'color: #39afd1;'"
                    >Không có khu trọ</span
                  >
                </span>
              </v-list-item> -->
              </template>
            </v-virtual-scroll>
            <v-autocomplete
              :items="groups.data"
              :filter="customFilter"
              item-text="groupName"
              label="Nhà trọ"
              persistent-hint
              :style="{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
              }"
              solo
              filled
              dense
              outlined
              hide-no-data
              class="text-body-2 hidden-md-and-up mt-3"
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
            </v-autocomplete>
          </v-card>
        </v-col>
        <v-col cols="12" md="7" class="py-0 mb-3">
          <v-card class="pa-4" v-if="selectedGroup !== null">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-row no-gutters class="hidden-md-and-down">
                <v-col cols="9" class="pr-2">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Tìm kiếm"
                    single-line
                    height="35"
                    rounded
                    hide-details
                    solo
                    class="text-muted size-sub-2 chat"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <!-- <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon class="btn-hover pa-0" v-bind="attrs" v-on="on"
                        ><v-icon size="20">mdi-sort-ascending</v-icon></v-btn
                      >
                    </template>
                    <v-list>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = ''"
                          >Tất cả</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'sắp hết hạn'"
                          >Sắp hết hạn</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'đang thuê'"
                          >Đang thuê</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'chờ xác nhận'"
                          >Chờ xác nhận</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'hết hiệu lực'"
                          >Hết hiệu lực</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu> -->
                  <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        class="font-nunito text-subtitle-2 pl-3 pr-1"
                        color="#727CF5"
                        dark
                      >
                        {{ statusName.toUpperCase() }}
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="statusName = 'tất cả'">
                        <v-list-item-title>Tất cả</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'sắp hết hạn'">
                        <v-list-item-title>Sắp hết hạn</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'đang thuê'">
                        <v-list-item-title>Đang thuê</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'chờ xác nhận'">
                        <v-list-item-title>Chờ xác nhận</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'hết hiệu lực'">
                        <v-list-item-title>Hết hiệu lực</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row no-gutters class="hidden-md-and-up">
                <v-col cols="10">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Tìm kiếm"
                    single-line
                    height="35"
                    rounded
                    hide-details
                    solo
                    class="text-muted size-sub-2 chat"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-menu offset-y left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon class="btn-hover pa-0" v-bind="attrs" v-on="on"
                        ><v-icon size="20">mdi-sort-ascending</v-icon></v-btn
                      >
                    </template>
                    <v-list>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'tất cả'"
                          >Tất cả</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'sắp hết hạn'"
                          >Sắp hết hạn</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'đang thuê'"
                          >Đang thuê</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'chờ xác nhận'"
                          >Chờ xác nhận</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'hết hiệu lực'"
                          >Hết hiệu lực</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="allContracts"
              :search="search"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-1 ma-3 mt-0 hidden-md-and-down"
              style="background-color: white"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>{{ toolbarGroupName }}</v-toolbar-title>
                  <v-dialog
                    v-model="dialog"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                  >
                    <v-card v-if="currentContract">
                      <v-toolbar dark color="#727cf5">
                        <v-btn icon dark @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Thông tin hợp đồng</v-toolbar-title>
                      </v-toolbar>
                      <div style="height: calc(100vh - 64px); overflow: hidden">
                        <v-progress-linear
                          v-model="progressBar.value"
                          :active="true"
                          :indeterminate="false"
                          :query="true"
                        ></v-progress-linear>
                        <pdfDocument :url="currentContract.contractUrl" :scale="scale" />
                      </div>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.status="{ item }">
                <v-icon small :color="item.color" left>fiber_manual_record</v-icon>
                <span class="size9rem">{{ item.status.toUpperCase() }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn color="#727cf5" @click="findContract(item.contractId)" text>
                  Chi tiết
                </v-btn>
                <v-btn
                  depressed
                  icon
                  v-if="item.statusCode === 'INACTIVE'"
                  :to="`/vendor/contract?contractId=${item.contractId}&mode=update`"
                >
                  <v-icon>create</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p style="font-size: 18px">Không có hợp đồng</p>
                <v-btn color="#727cf5" @click="allContracts" class="ma-2" dark> Tải lại </v-btn>
              </template>
            </v-data-table>
            <v-data-table
              :headers="headersInMobile"
              :items="allContracts"
              :search="search"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              @page-count="pageCount = $event"
              class="elevation-1 ma-3 mt-0 hidden-md-and-up"
              style="background-color: white"
            >
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <v-card v-if="currentContract">
                  <v-toolbar dark color="#727cf5">
                    <v-btn icon dark @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Thông tin hợp đồng</v-toolbar-title>
                  </v-toolbar>
                  <div style="height: calc(100vh - 64px); overflow: hidden">
                    <v-progress-linear
                      v-model="progressBar.value"
                      :active="true"
                      :indeterminate="false"
                      :query="true"
                    ></v-progress-linear>
                    <pdfDocument :url="currentContract.contractUrl" :scale="scale" />
                  </div>
                </v-card>
              </v-dialog>
              <template v-slot:item.status="{ item }">
                <v-chip :color="item.color">{{ item.status.toUpperCase() }}</v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn color="#727cf5" @click="findContract(item.contractId)" text>
                  Chi tiết
                </v-btn>
                <v-btn
                  depressed
                  icon
                  v-if="item.statusCode === 'INACTIVE'"
                  :to="`/vendor/contract?contractId=${item.contractId}&mode=update`"
                >
                  <v-icon>create</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <p style="font-size: 18px">Không có hợp đồng</p>
                <v-btn color="#727cf5" @click="allContracts" class="ma-2" dark> Tải lại </v-btn>
              </template>
            </v-data-table>
            <div class="text-center pt-2 pb-4">
              <v-pagination v-model="page" :length="pageCount" color="#727cf5"></v-pagination>
            </div>
          </v-card>
          <v-card class="pa-4 d-flex justify-center" v-if="selectedGroup === null">
            Chọn khu phòng trọ
          </v-card>
        </v-col>
        <v-col cols="12" md="1" />
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import pdfDocument from '../../components/vendor/pdfviewer/PDFDocument.vue';
import mobileMixin from '../../components/mixins/mobile';
import UnCheckedReservedFeeContracts from '../../components/view_contracts/UnCheckedReservedFeeContracts.vue';

export default {
  name: 'UserInformation',
  mixins: [mobileMixin],
  components: { pdfDocument, UnCheckedReservedFeeContracts },
  data: () => ({
    // search
    search: '',
    // paging
    page: 1,
    pageCount: 0,
    itemsPerPage: 7,
    // dialog show detail
    dialog: false,
    showIndex: -1,
    showItemDetail: {
      renterName: '',
      groupName: '',
      roomName: '',
      startTime: '',
      endTime: '',
      status: '',
    },
    // tab in detail
    tabs: {
      index: 0,
    },
    headers: [
      {
        text: 'Người thuê',
        align: 'start',
        value: 'renterName',
      },
      { text: 'Phòng', value: 'roomName', sortable: false },
      { text: 'Ngày bắt đầu', value: 'startTime' },
      { text: 'Ngày hết hạn', value: 'endTime' },
      { text: 'Trạng thái', value: 'status', sortable: false },
      { value: 'actions', sortable: false },
    ],
    headersInMobile: [
      {
        text: 'Người thuê',
        align: 'start',
        value: 'renterName',
        sortable: false,
      },
      { text: 'Phòng', value: 'roomName', sortable: false },
      { text: 'Trạng thái', value: 'status', sortable: false },
      { value: 'actions', sortable: false },
    ],
    currentContract: null,
    color: undefined,
    vendor: {},
    renter: {},
    school: {},
    address: {},
    rules: [],
    groupName: {},
    roomName: {},
    startTime: {},
    duration: 0,
    price: 0,
    deposit: 0,
    services: [],
    facilities: [],
    progressBar: {
      value: 0,
    },
    pdfViewer: {
      pdf: null,
      currentPage: 1,
      zoom: 1,
      isLoading: false,
    },
    selectedGroup: null,
    toolbarGroupName: null,
    searchQuery: '',
    statusName: 'tất cả',
    // selectedGroupInMobile: null,
  }),
  // watch: {
  //   searchInAC(val) {
  //     return val && val !== this.selectInAC && this.groupSearch();
  //   },
  // },
  methods: {
    ...mapActions({
      getContracts: 'user/getContracts',
      getUser: 'user/getUser',
      getGroups: 'vendor/group/getGroups',
    }),
    ...mapGetters({
      findContractById: 'user/findContractById',
    }),
    updateProgressBar(p) {
      // console.log(p);
      this.progressBar.value = Math.ceil(p * 100);
    },
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    getDateByTimestamp(time) {
      const date = new Date(time);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    },
    getEndDate(startDate, duration) {
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);
      return endDate.getTime();
    },
    getStatus(status, startTime, duration) {
      let contractStatus = '';
      let color = 'blue';
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateP = Date.parse(date);
      const endTime = new Date(startTime);
      endTime.setMonth(endTime.getMonth() + duration + 1);
      const temp = endTime.getTime();
      // console.log(`aa${dateP}`);
      // console.log(`bb${endTime}`);
      // console.log(`cc${temp}`);

      // switch (status) {
      //   case 'ACTIVATED':
      //     contractStatus = 'sắp hết hạn';
      //     color = 'rgb(244, 128, 36)';
      //     break;
      //   default:
      //     contractStatus = 'hết hiệu lực';
      //     color = 'rgb(235, 96, 96)';
      //     break;
      // }
      // if (status === 'REVERSED') {
      //   contractStatus = 'cọc';
      //   color = 'rgb(235, 84, 36)';
      // }
      // if (status === 'ACTIVATED') {
      //   contractStatus = 'đang thuê';
      //   color = 'rgb(124, 217, 146)';
      // }
      // if (status === 'INACTIVE') {
      //   contractStatus = 'chờ xác nhận';
      //   color = 'rgb(247, 228, 99)';
      // }
      // contractStatus = 'hết hiệu lực';
      // color = 'rgb(235, 96, 96)';
      switch (status) {
        case 'REVERSED':
          contractStatus = 'cọc';
          color = 'rgb(235, 84, 36)';
          break;
        case 'ACTIVATED':
          if (temp >= dateP) {
            contractStatus = 'sắp hết hạn';
            color = 'rgb(255,179,2)';
            break;
          } else {
            contractStatus = 'đang thuê';
            color = 'rgb(86,240,0)';
            break;
          }
        case 'INACTIVE':
          contractStatus = 'chờ xác nhận';
          color = 'rgb(45,204,255)';
          break;
        default:
          contractStatus = 'hết hiệu lực';
          color = 'rgb(158,167,173)';
          break;
      }
      return { contractStatus, color };
    },
    getStatusForCompare(status, startTime, duration) {
      let contractStatus = '';
      let color = 'blue';
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dateP = Date.parse(date);
      const endTime = new Date(startTime);
      endTime.setMonth(endTime.getMonth() + duration + 1);
      const temp = endTime.getTime();
      switch (status) {
        case 'REVERSED':
          contractStatus = 'cọc';
          color = 'rgb(235, 84, 36)';
          break;
        case 'ACTIVATED':
          if (temp >= dateP) {
            contractStatus = 'sắp hết hạn';
            color = 'rgb(255,179,2)';
            break;
          } else {
            contractStatus = 'đang thuê';
            color = 'rgb(86,240,0)';
            break;
          }
        case 'INACTIVE':
          contractStatus = 'chờ xác nhận';
          color = 'rgb(45,204,255)';
          break;
        default:
          contractStatus = 'hết hiệu lực';
          color = 'rgb(158,167,173)';
          break;
      }
      return { contractStatus, color };
    },
    findContract(contractId) {
      // console.log(contractId);
      const createdContract = this.findContractById()(contractId);
      this.currentContract = createdContract;
      this.vendor = createdContract.vendor;
      this.renter = createdContract.renter;
      // this.school = createdContract.renter.school;
      // this.address = createdContract.renter.school.address;
      // this.rules = createdContract.group.regulations;
      this.groupName = createdContract.group.groupName;
      this.roomName = createdContract.room.roomName;
      // this.startTime = this.getDateByTimestamp(createdContract.startTime);
      // this.duration = createdContract.duration;
      this.price = createdContract.type.price;
      this.deposit = createdContract.type.deposit;
      // this.services = createdContract.group.services;
      // this.facilities = createdContract.type.facilities;
      // console.log(this.contractDetail);
      // console.log(this.rules);
      this.dialog = true;
    },
    goToNextTab() {
      this.tabs.index += 1;
      document.getElementById('contractView').scrollTop = 0;
    },
    getIdNumber(time) {
      return new Date(time).toLocaleDateString('vi-vn');
    },
    clickGroup(group) {
      this.selectedGroup = group.groupName;
      this.toolbarGroupName = group.groupName;
    },
    customFilter(item, queryText) {
      const textOne = item.groupName.toLowerCase();
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1;
    },
    groupFilter(status) {
      console.log(`a${this.allContracts.status}`);
      console.log(`b${status}`);
      if (!status) {
        return this.allContracts;
      }
      return this.allContracts.filter((item) => item.status === status);
    },
  },
  created() {
    this.getUser().then(() => {
      this.getGroups().then(() => {
        this.getContracts();
        // this.searchQuery = this.groups.data[0].groupName;
        // this.selectedGroupInMobile = this.groups.data[0].groupId;
      });
    });
  },
  computed: {
    isLoading() {
      const loadingUser = this.$store.state.user.user.isLoading;
      const loadingContracts = this.$store.state.user.contracts.isLoading;
      const loadingGroups = this.$store.state.vendor.group.groups.isLoading;
      // const loadingDeals = this.$store.state.user.deals.isLoading;
      // const loadingProvinces = this.$store.state.renter.common.provinces.isLoading;
      return loadingUser || loadingGroups || loadingContracts;
    },
    uncheckedReserveFee() {
      return this.contracts.data.filter(
        (c) => c.reserved && c.paid === true && c.status === 'INACTIVE',
      );
    },
    contracts() {
      return this.$store.state.user.contracts;
    },
    groupSearch() {
      if (!this.searchQuery) {
        return this.groups.data;
      }
      return this.groups.data.filter(
        (item) => item.groupName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1,
      );
    },
    allContracts() {
      if (this.statusName === 'tất cả') {
        return this.contracts.data
          .filter((itemFilter) => itemFilter.group.groupName === this.selectedGroup)
          .map((item) => ({
            contractId: item.contractId,
            renterName: item.renter.username,
            groupName: item.group.groupName,
            roomName: item.room.roomName,
            startTime: this.getDateByTimestamp(item.startTime),
            endTime: this.getDateByTimestamp(this.getEndDate(item.startTime, item.duration)),
            status: this.getStatus(item.status, item.startTime, item.duration).contractStatus,
            statusCode: item.status,
            color: this.getStatus(item.status, item.startTime, item.duration).color,
            buildingNo: item.group.buildingNo,
            streetName: item.group.address.streetName,
            wardName: item.group.address.wardName,
            districtName: item.group.address.districtName,
            provinceName: item.group.address.provinceName,
            contractUrl: item.contractUrl,
            paid: item.paid,
            downPayment: item.downPayment,
            reserve: item.reserve,
          }));
      }
      return this.contracts.data.filter((itemFilter) => itemFilter.group.groupName === this.selectedGroup)
        .filter((itemFilter2) => this.statusName === this.getStatusForCompare(itemFilter2.status, itemFilter2.startTime, itemFilter2.duration).contractStatus).map((item) => ({
          contractId: item.contractId,
          renterName: item.renter.username,
          groupName: item.group.groupName,
          roomName: item.room.roomName,
          startTime: this.getDateByTimestamp(item.startTime),
          endTime: this.getDateByTimestamp(this.getEndDate(item.startTime, item.duration)),
          status: this.getStatus(item.status, item.startTime, item.duration).contractStatus,
          statusCode: item.status,
          color: this.getStatus(item.status, item.startTime, item.duration).color,
          buildingNo: item.group.buildingNo,
          streetName: item.group.address.streetName,
          wardName: item.group.address.wardName,
          districtName: item.group.address.districtName,
          provinceName: item.group.address.provinceName,
          contractUrl: item.contractUrl,
          paid: item.paid,
          downPayment: item.downPayment,
          reserve: item.reserve,
        }));
    },
    items() {
      return this.rules.map((item) => ({
        name: item.regulationName,
        no: item.regulationId,
        allowed: item.allowed,
      }));
    },
    groups() {
      return this.$store.state.vendor.group.groups;
    },
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.btn-primary {
  color: #6c757d !important;
  background-color: #eef2f7 !important;
  border-color: #727cf5 !important;
  /* box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important; */
  border-radius: 0.15rem !important;
  height: 2.5rem !important;
  opacity: 1 !important;
}
.v-btn-toggle > .v-btn.v-btn {
  opacity: 1 !important;
  border-style: none !important;
}
.v-btn-toggle > .v-btn.v-btn--active {
  color: #fff !important;
  background-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  opacity: 1 !important;
}
.scrollbar {
  overflow-y: scroll;
}
.force-overflow {
  min-height: 450px;
}
#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(179, 184, 240);
  border-radius: 10px;
}

#style-1::-webkit-scrollbar {
  width: 10px;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #727cf5;
}
</style>
