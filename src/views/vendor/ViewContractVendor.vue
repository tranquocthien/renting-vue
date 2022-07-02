<template>
  <div style="overflow-y: auto">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog width="500" persistent :value="uncheckedReserveFee.length > 0">
      <UnCheckedReservedFeeContracts :contracts="uncheckedReserveFee" />
    </v-dialog>
    <v-dialog width="500" persistent :value="uncheckedRestFee.length > 0">
      <UnCheckedRestFeeContracts :contracts="uncheckedRestFee" />
    </v-dialog>
    <v-dialog width="500" persistent :value="uncheckedAllFee.length > 0">
      <UnCheckedAllFeeContracts :contracts="uncheckedAllFee" />
    </v-dialog>
    <v-dialog width="500" persistent :value="uncheckedResignRequest.length > 0">
      <UnCheckedResignRequest :contracts="uncheckedResignRequest" />
    </v-dialog>
    <v-dialog width="300" persistent v-model="cancelContract.show">
      <v-card
        v-if="cancelContract.show && !cancelContract.showResult"
        :loading="contracts.isUpdating"
      >
        <v-card-title>Hủy hợp đồng</v-card-title>
        <v-card-text>
          Hợp đồng thuê nhà giữ bạn và {{ cancelContract.tableItem.renterName }} có thời hạn đến
          ngày {{ cancelContract.tableItem.endTime }}, bạn có chắc chắn muốn hủy?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelContract.show = false"> Đóng </v-btn>
          <v-btn @click="findContract(cancelContract.contract.contractId)"> Hủy hợp đồng </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="cancelContract.show && cancelContract.showResult">
        <v-card-title v-if="cancelContract.success">Hủy hợp đồng thành công</v-card-title>
        <v-card-title v-if="!cancelContract.success">Hủy hợp đồng thất bại</v-card-title>
        <v-card-text> </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelContract.show = false"> Đóng </v-btn>
          <v-btn
            v-if="!cancelContract.showResult"
            @click="findContract(cancelContract.contract.contractId)"
          >
            Hủy hợp đồng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
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
          <pdfDocument :url="currentContract.contractUrl" :scale="scale">
            <template v-slot:footer>
              <v-card v-if="cancelContract.show">
                <v-card-text>
                  <v-checkbox
                    v-model="cancelContract.agree"
                    label="Tôi đã đọc và muốn hủy hợp đồng"
                  ></v-checkbox>
                </v-card-text>
                <v-card-actions>
                  <v-btn :disabled="!cancelContract.agree" @click="doCancelContract"
                    >Hủy hợp đồng</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </pdfDocument>
        </div>
      </v-card>
    </v-dialog>
    <div v-if="!isLoading">
      <v-row class="d-flex justify-space-between ma-0 pl-md-13 mt-5 font-nunito">
        <v-col cols="12" md="3" class="py-0 mb-3">
          <v-card class="pa-3">
            <div class="d-flex">
              <span
                style="letter-spacing: 0.02em; font-weight: 700"
                class="text-gray font-nunito size9rem mt-2"
                >KHU TRỌ</span
              >
              <v-btn @click="clickGroup(null)" class="ml-2" elevation="0">Tất cả hợp đồng</v-btn>
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
                </v-list-item>
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
        <v-col cols="12" md="9" class="py-0 mb-3">
          <v-card class="pa-4">
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
                      <v-list-item @click="statusName = 'Tất cả'">
                        <v-list-item-title>Tất cả</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Chờ ký'">
                        <v-list-item-title>Chờ ký</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Đã ký'">
                        <v-list-item-title>Đã ký</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Đã thanh toán cọc'">
                        <v-list-item-title>Đã thanh toán cọc</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Đã nhận cọc'">
                        <v-list-item-title>Đã nhận cọc</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Đã thanh toán toàn bộ'">
                        <v-list-item-title>Đã thanh toán toàn bộ</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Đang thuê'">
                        <v-list-item-title>Đang thuê</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Sắp hết hạn'">
                        <v-list-item-title>Sắp hết hạn</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="statusName = 'Hết hiệu lực'">
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
                          @click="statusName = 'Tất cả'"
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
                          @click="statusName = 'Chờ ký'"
                          >Chờ ký</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'Đã ký'"
                          >Đã ký</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'Đã thanh toán cọc'"
                          >Đã thanh toán cọc</v-list-item-title
                        >
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito size9rem text-gray"
                          @click="statusName = 'Đã nhận cọc'"
                          >Đã nhận cọc</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'Đang thuê'"
                          >Đang thuê</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'Sắp hết hạn'"
                          >Sắp hết hạn</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'Hết hiệu lực'"
                          >Hết hiệu lực</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        style="min-height: 20px !important"
                        class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                      >
                        <v-list-item-title
                          class="item-hover font-nunito text-gray size9rem"
                          @click="statusName = 'Bị hủy'"
                          >Bị hủy</v-list-item-title
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              show-expand
              class="elevation-1 ma-3 mt-0 hidden-md-and-down"
              style="background-color: white"
            >
              <template v-slot:expanded-item="{ item }">
                <v-container>
                  <ImageEditor :oldImages="item.images" :mode="'view'" />
                </v-container>
              </template>
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>{{ toolbarGroupName }}</v-toolbar-title>
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
                <v-btn
                  depressed
                  icon
                  v-if="item.statusCode !== 'INACTIVE'"
                  @click="showCancelContract(item)"
                >
                  <v-icon>cancel</v-icon>
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
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              show-expand
              @page-count="pageCount = $event"
              class="elevation-1 ma-3 mt-0 hidden-md-and-up"
              style="background-color: white"
            >
              <template v-slot:expanded-item="{ item }">
                <v-container>
                  <ImageEditor :oldImages="item.images" :mode="'view'" />
                </v-container>
              </template>
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
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import pdfDocument from '../../components/vendor/pdfviewer/PDFDocument.vue';
import mobileMixin from '../../components/mixins/mobile';
import UnCheckedReservedFeeContracts from '../../components/view_contracts/UnCheckedReservedFeeContracts.vue';
import UnCheckedRestFeeContracts from '../../components/view_contracts/UnCheckedRestFeeContracts.vue';
import UnCheckedAllFeeContracts from '../../components/view_contracts/UnCheckedAllFeeContracts.vue';
import UnCheckedResignRequest from '../../components/view_contracts/UnCheckedResignRequest.vue';
import actions from '../../config/pushNotificationActions';
import ImageEditor from '../../components/vendor/hostel_management/ImageEditor.vue';

export default {
  name: 'ViewContractVendor',
  mixins: [mobileMixin],
  components: {
    pdfDocument,
    UnCheckedReservedFeeContracts,
    UnCheckedRestFeeContracts,
    UnCheckedAllFeeContracts,
    UnCheckedResignRequest,
    ImageEditor,
  },
  data: () => ({
    expanded: [],
    singleExpand: true,
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
    groupName: null,
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
    statusName: 'Tất cả',
    // selectedGroupInMobile: null,
    statusNames: [
      'Đã thanh toán cọc',
      'Đã ký',
      'Đã thanh toán toàn bộ',
      'Đã nhận cọc',
      'Sắp hết hạn',
      'Đang thuê',
      'Chờ ký',
      'Hết hiệu lực',
      'Bị hủy',
    ],
    cancelContract: {
      show: false,
      contract: null,
      tableItem: null,
      showResult: false,
      success: false,
    },
  }),
  methods: {
    ...mapActions({
      getContracts: 'user/getContracts',
      getUser: 'user/getUser',
      getGroups: 'vendor/group/getGroups',
      activateContract: 'user/activateContract',
      sendNotification: 'user/sendNotification',
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
    getStatus(contract) {
      // eslint-disable-next-line
      const { status, startTime, duration, paid, reserved } = contract;
      let contractStatus = '';
      let color = 'blue';
      let now = new Date();
      now.setHours(0, 0, 0, 0);
      now = now.getTime();
      let endTime = new Date(startTime);
      endTime.setMonth(endTime.getMonth() + duration + 1);
      endTime = endTime.getTime();
      const diff = (endTime - now) / 1000; // seconds
      const oneMonth = 30 * 24 * 60 * 60;
      if (reserved) {
        switch (status) {
          case 'ACCEPTED':
            if (paid) {
              contractStatus = 'Đã thanh toán cọc';
              color = 'light-green';
              break;
            } else {
              contractStatus = 'Đã ký';
              color = 'light-green';
              break;
            }
          case 'RESERVED':
            if (paid) {
              contractStatus = 'Đã thanh toán toàn bộ';
              color = 'light-green';
              break;
            } else {
              contractStatus = 'Đã nhận cọc';
              color = 'light-green';
              break;
            }
          case 'ACTIVATED':
            if (diff < oneMonth) {
              contractStatus = 'Sắp hết hạn';
              color = 'rgb(255,179,2)';
              break;
            } else {
              contractStatus = 'Đang thuê';
              color = 'rgb(86,240,0)';
              break;
            }
          case 'INACTIVE':
            contractStatus = 'Chờ ký';
            color = 'rgb(45,204,255)';
            break;
          case 'EXPIRED':
            contractStatus = 'Hết hiệu lực';
            color = 'rgb(158,167,173)';
            break;
          case 'CANCELLED':
            contractStatus = 'Bị hủy';
            color = 'rgb(158,167,173)';
            break;
          default:
            break;
        }
      } else {
        switch (status) {
          case 'ACCEPTED':
            if (paid) {
              contractStatus = 'Đã thanh toán';
              color = 'light-green';
              break;
            } else {
              contractStatus = 'Đã ký';
              color = 'light-green';
              break;
            }
          case 'ACTIVATED':
            if (diff < oneMonth) {
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
          case 'EXPIRED':
            contractStatus = 'hết hiệu lực';
            color = 'rgb(158,167,173)';
            break;
          case 'CANCELLED':
            contractStatus = 'Bị hủy';
            color = 'rgb(158,167,173)';
            break;
          default:
            break;
        }
      }
      return { contractStatus, color };
    },
    findContract(contractId) {
      const createdContract = this.findContractById()(contractId);
      this.currentContract = createdContract;
      this.vendor = createdContract.vendor;
      this.renter = createdContract.renter;
      this.groupName = createdContract.group.groupName;
      this.roomName = createdContract.room.roomName;
      this.deposit = createdContract.type.deposit;
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
      if (group === null) {
        this.toolbarGroupName = 'Hợp đồng từ tất cả khu trọ';
        this.selectedGroup = null;
      } else {
        this.toolbarGroupName = group.groupName;
        this.selectedGroup = group.groupName;
      }
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
    mapContract(item) {
      return {
        contractId: item.contractId,
        renterName: item.renter.username,
        groupName: item.group.groupName,
        roomName: item.room.roomName,
        startTime: this.getDateByTimestamp(item.startTime),
        endTime: this.getDateByTimestamp(this.getEndDate(item.startTime, item.duration)),
        status: this.getStatus(item).contractStatus,
        statusCode: item.status,
        color: this.getStatus(item).color,
        buildingNo: item.group.buildingNo,
        streetName: item.group.address.streetName,
        wardName: item.group.address.wardName,
        districtName: item.group.address.districtName,
        provinceName: item.group.address.provinceName,
        contractUrl: item.contractUrl,
        paid: item.paid,
        downPayment: item.downPayment,
        reserve: item.reserve,
        images: item.images.filter((img) => !img.deleted),
      };
    },
    showCancelContract(item) {
      const { contractId } = item;
      const contract = this.findContractById()(contractId);
      this.cancelContract.show = true;
      this.cancelContract.contract = contract;
      this.cancelContract.tableItem = item;
      this.cancelContract.success = null;
      this.cancelContract.showResult = false;
    },
    doCancelContract() {
      this.dialog = false;
      const { contract } = this.cancelContract;
      const { contractId, qrCode } = contract;
      const payload = {
        qrCode,
        contractId,
        status: 'CANCELLED',
      };
      this.cancelContract.showResult = true;
      this.activateContract(payload).then(() => {
        const { success } = this.contracts;
        if (success) {
          this.sendNotification({
            title: `${contract.vendor.username} đã hủy hợp đồng`,
            body: `${contract.group.groupName}, ${contract.type.title}, ${contract.room.roomName}`,
            action: actions.CANCEL_CONTRACT,
            id: contract.contractId,
            icon: contract.vendor.avatar,
            vendorId: null,
            renterId: contract.renter.userId,
          });
        }
        this.cancelContract.showResult = true;
        this.cancelContract.success = success;
      });
    },
  },
  created() {
    this.getUser().then(() => {
      this.getGroups().then(() => {
        // this.clickGroup(this.groups.data[0]);
        this.getContracts();
      });
    });
  },
  computed: {
    scale() {
      if (this.isMobile) {
        return 2;
      }
      return 1;
    },
    isLoading() {
      const loadingUser = this.$store.state.user.user.isLoading;
      const loadingContracts = this.$store.state.user.contracts.isLoading;
      const updatingContracts = this.$store.state.user.contracts.isUpdating;
      const creatingContracts = this.$store.state.user.contracts.isCreating;
      const loadingGroups = this.$store.state.vendor.group.groups.isLoading;
      return (
        loadingUser || loadingGroups || loadingContracts || creatingContracts || updatingContracts
      );
    },
    uncheckedReserveFee() {
      const l = this.contracts.data.filter(
        (c) => c.reserved && c.paid === true && c.status === 'ACCEPTED',
      );
      console.log(l);
      return l;
    },
    uncheckedRestFee() {
      const l = this.contracts.data.filter(
        (c) => c.reserved && c.paid === true && c.status === 'RESERVED',
      );
      console.log(l);
      return l;
    },
    uncheckedAllFee() {
      const l = this.contracts.data.filter(
        (c) => !c.reserved && c.paid === true && c.status === 'ACCEPTED',
      );
      console.log(l);
      return l;
    },
    uncheckedResignRequest() {
      const l = this.contracts.data.filter((c) => c.resign === 'REQUEST');
      console.log(l);
      return l;
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
      let result = this.contracts.data;
      if (this.selectedGroup) {
        result = result.filter((contract) => contract.group.groupName === this.selectedGroup);
      }
      if (this.statusName !== 'Tất cả') {
        result = result.filter((contract) => {
          const s1 = this.getStatus(contract).contractStatus.toLowerCase();
          const s2 = this.statusName.toLowerCase();
          return s1 === s2;
        });
      }
      return result.map((contract) => this.mapContract(contract));
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
