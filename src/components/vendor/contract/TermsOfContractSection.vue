<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col>
        <v-card>
          <v-row no-gutters v-if="!isMobile">
            <v-row>
              <v-col cols="12" md="5">
                <v-card-text class="d-flex flex-column">
                  <span class="text-h6">THÔNG TIN PHÒNG TRỌ</span>
                  <span class="text-muted font-italic"
                    >Vui lòng nhập đầy đủ các thông tin bắt buộc</span
                  >
                  <v-row>
                    <v-col cols="12" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Chọn nhà </span>
                      <span class="text size-sub-2 px-3 py-2 mt-2">{{ group.groupName }}</span>
                    </v-col>
                    <v-col cols="12" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Chọn phòng <span class="text-danger">(*)</span>
                      </span>
                      <v-select
                        :loading="rooms.isLoading"
                        v-model="contract.roomId"
                        :items="availableRooms"
                        v-if="availableRooms.length > 0"
                        item-text="roomName"
                        item-value="roomId"
                        hide-details
                        dense
                        solo
                        class="size-sub-2 mt-2"
                        :readonly="mode === 'view'"
                      >
                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Ngày bắt đầu hợp đồng<span class="text-danger">(*)</span>
                      </span>
                      <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        :disabled="mode === 'view'"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <span class="text size-sub-2 px-3 py-2 mt-2" v-bind="attrs" v-on="on">{{
                            startTimeString
                          }}</span>
                        </template>
                        <v-date-picker
                          v-model="startTime"
                          no-title
                          @input="menu1 = false"
                          locale="vi"
                          :allowed-dates="validDates"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Thời hạn hợp đồng<span class="text-danger">(*)</span></span
                      >
                      <v-text-field
                        class="size-sub-2 mt-2"
                        type="number"
                        color="#727cf5"
                        solo
                        dense
                        light
                        hide-details
                        v-model="contract.duration"
                        suffix="Tháng"
                        step="1"
                        min="1"
                        :readonly="mode === 'view'"
                      />
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Tiền thuê </span>
                      <span class="size-sub-2 px-3 py-2 mt-2 d-flex"
                        ><span>{{ this.price }}</span>
                        <span class="ml-auto">triệu/tháng</span>
                      </span>
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Tiền cọc</span>
                      <span class="size-sub-2 px-3 py-2 mt-2 d-flex"
                        ><span>{{ type.deposit }}</span>
                        <span class="ml-auto">tháng tiền phòng</span>
                      </span>
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Loại hợp đồng</span>
                      <span class="size-sub-2">
                        <v-switch
                          v-model="contract.reserved"
                          :label="contractTypeString"
                          inset
                          color="#727CF5"
                          class="filter"
                        ></v-switch>
                      </span>
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column" v-if="contract.reserved">
                      <span class="font-weight-bold text-gray-black">Tiền cọc giữ chỗ</span>
                      <v-text-field
                        v-model="contract.downPayment"
                        :rules="[
                          rules.max(contract.downPayment, price),
                          rules.min(contract.downPayment),
                        ]"
                        step="0.1"
                        type="number"
                        suffix="triệu đồng"
                        solo
                        dense
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-card>
                      <v-card-text>
                        Tổng số tiền phải thanh toán: {{ totalPrice }} triệu đồng
                      </v-card-text>
                      <v-card-text v-if="contract.reserved">
                        Lần 1: thanh toán phí giữ chỗ {{ contract.downPayment }} triệu đồng <br />
                        Lần 2: thanh toán phần còn lại
                        {{ (totalPrice - contract.downPayment).toFixed(2) }} triệu đồng
                      </v-card-text>
                    </v-card>
                  </v-row>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="7">
                <v-tabs
                  v-model="tabs.index"
                  fixed-tabs
                  background-color="#727CF5"
                  dark
                  class="font-nunito font-weight-bold pr-2"
                >
                  <v-tab> Dịch vụ </v-tab>
                  <v-tab> Nội thất </v-tab>
                  <v-tab> Quy định </v-tab>
                  <v-tab> Phụ lục </v-tab>
                  <v-tab> Tải ảnh </v-tab>
                  <v-tab-item>
                    <div style="min-height: 460px; height: 460px; max-height: 460px">
                      <HostelGroupServiceEditor
                        :groupService="group.services"
                        :select="true"
                        :mode="'view'"
                        @newSelects="receiveSelectServiceIds"
                      />
                    </div>
                  </v-tab-item>
                  <v-tab-item>
                    <FacilityTable :facilities="type.facilities" />
                  </v-tab-item>
                  <v-tab-item>
                    <RegulationTable :rules="group.regulations" />
                  </v-tab-item>
                  <v-tab-item>
                    <!-- <p class="text-h6">Phụ lục hợp đồng</p> -->
                    <TextEditor
                      v-if="mode !== 'view'"
                      @appendixContent="receiveAppendixContent"
                      :editorContent="contract.appendixContract"
                      :template="group.appendixContract"
                      class="pt-10 pa-5"
                    />
                    <span v-if="mode === 'view'" v-html="contract.appendixContract"></span>
                  </v-tab-item>
                  <v-tab-item>
                    <span
                      class="d-flex justify-center pt-3 font-nunito font-weight-bold text-gray-black"
                      >Ảnh của hợp đồng giấy <span style="color: red"> (nếu có)</span></span
                    >
                    <div class="d-flex justify-center pt-3">
                      <ImageEditor
                        :mode="'edit'"
                        :check="check"
                        @newValues="receiveNewImages"
                        class="pa-0"
                        :oldImages="physicalContractImages"
                      />
                    </div>
                  </v-tab-item>
                </v-tabs>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-center py-0">
                <v-btn
                  v-if="mode === 'create'"
                  class="ma-4 btn-primary"
                  @click="$emit('clickCreateContract')"
                >
                  Tạo hợp đồng
                </v-btn>
                <v-btn
                  v-if="mode === 'update'"
                  class="ma-4 btn-primary"
                  @click="$emit('clickUpdateContract')"
                >
                  Cập nhật hợp đồng
                </v-btn>
                <v-btn
                  v-if="mode === 'resign'"
                  class="ma-4 btn-primary"
                  @click="$emit('clickResignContract')"
                >
                  Gia hạn hợp đồng
                </v-btn>
              </v-col>
            </v-row>
          </v-row>
          <!-- </v-col> -->
          <v-row no-gutters v-if="isMobile">
            <v-row>
              <v-col cols="12" md="5">
                <v-card-text class="d-flex flex-column">
                  <span class="text-h6 mt-5">THÔNG TIN PHÒNG TRỌ</span>
                  <span class="text-muted font-italic"
                    >Vui lòng nhập đầy đủ các thông tin bắt buộc</span
                  >
                  <v-row>
                    <v-col cols="12" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Chọn nhà </span>
                      <span class="text size-sub-2 px-3 py-2 mt-2">{{ group.groupName }}</span>
                    </v-col>
                    <v-col cols="12" class="d-flex flex-column">
                      <!-- <v-textarea v-model="addressString" rows="2" readonly disabled>
                      <template v-slot:label>
                        <div>
                          Địa chỉ phòng trọ
                        </div>
                      </template>
                    </v-textarea> -->
                      <span class="font-weight-bold text-gray-black"
                        >Chọn phòng <span class="text-danger">(*)</span>
                      </span>
                      <v-select
                        :loading="rooms.isLoading"
                        v-model="contract.roomId"
                        :items="availableRooms"
                        v-if="availableRooms.length > 0"
                        item-text="roomName"
                        item-value="roomId"
                        hide-details
                        dense
                        solo
                        class="size-sub-2 mt-2"
                        :readonly="mode === 'view'"
                      >
                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Ngày bắt đầu hợp đồng<span class="text-danger">(*)</span>
                      </span>
                      <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        :disabled="mode === 'view'"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <span class="text size-sub-2 px-3 py-2 mt-2" v-bind="attrs" v-on="on">{{
                            startTimeString
                          }}</span>
                        </template>
                        <v-date-picker
                          v-model="startTime"
                          no-title
                          @input="menu1 = false"
                          locale="vi"
                          :allowed-dates="validDates"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Thời hạn hợp đồng<span class="text-danger">(*)</span></span
                      >
                      <v-text-field
                        class="size-sub-2 mt-2"
                        type="number"
                        color="#727cf5"
                        solo
                        dense
                        light
                        hide-details
                        v-model="contract.duration"
                        suffix="Tháng"
                        step="1"
                        min="1"
                        :readonly="mode === 'view'"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black"
                        >Ngày thanh toán tiền hằng tháng<span class="text-danger">(*)</span></span
                      >
                      <v-text-field
                        class="size-sub-2 mt-2"
                        type="number"
                        color="#727cf5"
                        solo
                        dense
                        light
                        hide-details
                        v-model="contract.paymentDayInMonth"
                        prefix="Ngày"
                        step="1"
                        min="1"
                        max="31"
                        :readonly="mode === 'view'"
                      />
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Tiền thuê </span>
                      <span class="size-sub-2 px-3 py-2 mt-2 d-flex">
                        <span>{{ this.price }}</span>
                        <span class="ml-auto">triệu/tháng</span>
                      </span>
                    </v-col>
                    <v-col cols="6" sm="6" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Tiền cọc</span>
                      <span class="size-sub-2 px-3 py-2 mt-2 d-flex"
                        ><span>{{ type.deposit }}</span>
                        <span class="ml-auto">tháng tiền phòng</span>
                      </span>
                    </v-col>
                    <v-col cols="12" sm="12" class="d-flex flex-column">
                      <span class="font-weight-bold text-gray-black">Loại hợp đồng</span>
                      <span class="size-sub-2 pl-1">
                        <v-switch
                          v-model="contract.reserved"
                          :label="contractTypeString"
                          inset
                          color="#727CF5"
                          class="filter"
                        ></v-switch>
                      </span>
                    </v-col>
                    <v-col cols="12" sm="12" class="d-flex flex-column" v-if="contract.reserved">
                      <span class="font-weight-bold text-gray-black">Tiền cọc giữ chỗ</span>
                      <v-text-field
                        v-model="contract.downPayment"
                        :max="price"
                        min="0.1"
                        step="0.1"
                        type="number"
                        suffix="triệu đồng"
                        solo
                        dense
                      >
                      </v-text-field>
                    </v-col>Ảnh của hợp đồng giấy
                  </v-row>
                  <v-row>
                    <v-card>
                      <v-card-text>
                        Tổng số tiền phải thanh toán: {{ totalPrice }} triệu đồng
                      </v-card-text>
                      <v-card-text v-if="contract.reserved">
                        Lần 1: thanh toán phí giữ chỗ {{ contract.downPayment }} triệu đồng <br />
                        Lần 2: thanh toán phần còn lại
                        {{ (totalPrice - contract.downPayment).toFixed(2) }} triệu đồng
                      </v-card-text>
                    </v-card>
                  </v-row>
                  <span class="text-h6 mt-5">Dịch vụ</span>
                  <span class="text-muted font-italic">Chọn dịch vụ mà bạn sẽ tính tiền</span>
                  <v-row>
                    <v-col class="12">
                      <HostelGroupServiceEditor
                        :groupService="group.services"
                        :select="true"
                        :mode="'view'"
                        :check="check"
                        @newSelects="receiveSelectServiceIds"
                      />
                    </v-col>
                  </v-row>
                  <!-- </v-container> -->
                </v-card-text>
              </v-col>
              <v-col cols="12" md="7">
                <v-row>
                  <v-col cols="12" md="5">
                    <FacilityTable :facilities="type.facilities" :check="check" />
                  </v-col>
                  <v-col cols="12" md="7"
                    ><RegulationTable :rules="group.regulations" :check="check" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <p class="text-h6">Phụ lục hợp đồng</p>
                    <TextEditor
                      v-if="mode !== 'view'"
                      @appendixContent="receiveAppendixContent"
                      :editorContent="contract.appendixContract"
                      :template="group.appendixContract"
                    />
                    <span v-if="mode === 'view'" v-html="contract.appendixContract"></span>
                  </v-col>
                  <v-col cols="12">
                    <span>Ảnh của hợp đồng giấy (nếu có)</span>
                    <ImageEditor
                      :mode="'edit'"
                      @newValues="receiveNewImages"
                      class="pa-0"
                      :oldImages="physicalContractImages"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-center py-0">
                <v-btn
                  v-if="mode === 'create'"
                  class="ma-4 btn-primary"
                  @click="$emit('clickCreateContract')"
                >
                  Tạo hợp đồng
                </v-btn>
                <v-btn
                  v-if="mode === 'update'"
                  class="ma-4 btn-primary"
                  @click="$emit('clickUpdateContract')"
                >
                  Cập nhật hợp đồng
                </v-btn>
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackBarMixin.show"
      :multi-line="snackBarMixin.multiLine"
      :timeout="snackBarMixin.timeout"
      :absolute="snackBarMixin.absolute"
      :color="snackBarMixin.color"
    >
      {{ snackBarMixin.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
<script>
import HostelGroupServiceEditor from '../hostel_management/HostelGroupServiceEditor.vue';
import RegulationTable from './RegulationTable.vue';
import FacilityTable from './FacilityTable.vue';
import ImageEditor from '../hostel_management/ImageEditor.vue';
import validateMixins from '../../mixins/validate';
import SnackBarMixins from '../../mixins/snackBar';
import TextEditor from './TextEditor.vue';

export default {
  name: 'TermsOfContractSection',
  props: {
    type: {
      type: Object,
    },
    group: {
      type: Object,
    },
    booking: {
      type: Object,
    },
    mode: {
      type: String,
      validator(value) {
        return ['create', 'view', 'update', 'resign'].indexOf(value) !== -1;
      },
    },
    contractObj: {
      type: Object,
    },
  },
  mixins: [validateMixins, SnackBarMixins],
  components: {
    HostelGroupServiceEditor,
    RegulationTable,
    FacilityTable,
    ImageEditor,
    TextEditor,
  },
  data: () => ({
    rules: {
      max(value, max) {
        return (value || 'phí giữ chỗ ') < max || `phí giữ chỗ  nhỏ hơn ${max}`;
      },
      min(value) {
        return (value || 'phí giữ chỗ ') > 0 || 'phí giữ chỗ  lớn hơn 0';
      },
    },
    contractTemplateUrl:
      'https://youthhostelstorage.blob.core.windows.net/template/contract_appendix.html',
    menu1: null,
    startTime: new Date().toISOString().substr(0, 10),
    contract: {
      paymentDayInMonth: 1,
      roomId: null,
      duration: null,
      groupServiceIds: [],
      startTime: new Date().getTime(),
      images: [],
      appendixContract: null,
      reserved: false,
      paid: false,
      downPayment: 0,
      dealId: null,
    },
    rooms: {
      data: [],
      isLoading: false,
      error: null,
      success: null,
    },
    tabs: {
      index: 0,
    },
    check: 1,
  }),
  methods: {
    validDates(dayStr) {
      let today = new Date();
      if (this.mode === 'resign') {
        const { startTime, duration } = this.contractObj;
        today = new Date(this.getEndDate(startTime, duration));
      }
      today.setHours(0, 0, 0, 0);
      const selectDay = new Date(dayStr);
      selectDay.setHours(0, 0, 0, 0);
      return selectDay.getTime() >= today.getTime();
    },
    receiveSelectServiceIds(selectServiceIds) {
      console.log(selectServiceIds);
      this.contract.groupServiceIds = selectServiceIds;
    },
    receiveNewImages(imageUrls) {
      this.contract.images = imageUrls.map((img) => ({ ...img, type: 'PAPER' }));
    },
    receiveAppendixContent(appendix) {
      this.contract.appendixContract = appendix;
    },
    async getRoomsOfType() {
      try {
        this.rooms.isLoading = true;
        const url = `/api/v1/types/${this.type.typeId}/rooms`;
        const res = await window.axios.get(url);
        this.rooms.data = res.data.data;
        this.rooms.isLoading = false;
        this.rooms.success = true;
      } catch (error) {
        this.rooms.isLoading = false;
        this.rooms.error = error;
        this.rooms.success = false;
      }
    },
    checkEmptyField() {
      if (!this.contract.roomId) {
        this.showSnackBar('Chọn phòng trước khi tạo hợp đồng', { color: 'red' });
      } else if (!this.contract.duration) {
        this.showSnackBar('Nhập Thời hạn hợp đồng', { color: 'red' });
      } else {
        this.$emit('clickCreateContract');
      }
    },
    getEndDate(startDate, duration) {
      console.log(startDate, duration);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);
      endDate.setDate(endDate.getDate() + 1);
      return endDate.toISOString().substr(0, 10);
    },
  },
  computed: {
    price() {
      return this.booking.deal ? this.booking.deal.offeredPrice : this.type.price;
    },
    totalPrice() {
      const t = (this.type.deposit + 1) * this.price;
      return t.toFixed(2);
    },
    physicalContractImages() {
      return this.contract.images.filter((img) => img.type === 'PAPER');
    },
    addressString() {
      const { address } = this.group;
      return `${this.group.buildingNo} ${address.streetName}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;
    },
    startTimeString() {
      return new Date(this.startTime).toLocaleDateString('vi');
    },
    availableRooms() {
      if (this.mode === 'resign') {
        return this.rooms.data.filter((r) => {
          const res =
            r.available ||
            r.roomId === this.contract.roomId ||
            r.roomId === this.contractObj.room.roomId;
          return res;
        });
      }
      return this.rooms.data.filter((r) => r.available || r.roomId === this.contract.roomId);
    },
    outOfRoomHint() {
      if (this.mode === 'create') {
        return 'Đã hết phòng trống';
      }
      if (this.mode === 'update') {
        return 'Chỉ còn lại duy nhất một phòng';
      }
      return '';
    },
    contractTypeString() {
      if (this.contract.reserved) {
        return 'Hợp đồng có cọc giữ chỗ';
      }
      return 'Hợp đồng không có cọc giữ chỗ';
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
  created() {
    this.getRoomsOfType();
    if (this.mode === 'update' || this.mode === 'view' || this.mode === 'resign') {
      const {
        roomId,
        duration,
        groupServiceIds,
        startTime,
        images,
        appendixContract,
        contractId,
        paid,
        downPayment,
        reserved,
        deal,
      } = this.contractObj;
      this.contract.roomId = roomId;
      this.contract.duration = duration;
      this.contract.groupServiceIds = groupServiceIds;
      this.contract.startTime = startTime;
      this.contract.images = images;
      this.contract.appendixContract = appendixContract;
      this.contract.contractId = contractId;
      this.contract.dealId = deal.dealId;
      this.startTime = new Date(startTime).toISOString().substr(0, 10);
      if (this.mode === 'resign') {
        this.startTime = this.getEndDate(startTime, duration);
      }
      this.contract.paid = paid;
      this.contract.downPayment = downPayment;
      this.contract.reserved = reserved;
    }
    if (this.mode === 'create') {
      this.contract.downPayment = this.group.downPayment;
      const { deal } = this.booking;
      if (deal) {
        this.contract.dealId = this.booking.deal.dealId;
      }
    }
  },
  watch: {
    contract: {
      handler() {
        this.$emit('newValue', this.contract);
      },
      deep: true,
    },
    startTime() {
      this.contract.startTime = new Date(this.startTime).getTime();
    },
  },
};
</script>
<style>
.text {
  border: 1px solid #e1e1e1 !important;
  border-radius: 0.25rem;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #e1e1e1;
}
</style>
