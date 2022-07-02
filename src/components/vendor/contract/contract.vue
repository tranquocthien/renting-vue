<template>
  <v-card class="overflow-y-auto" max-height="100%" ref="contractView" id="contractView">
    <v-dialog v-model="bookings.isLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Đang chuẩn bị hợp đồng
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDoingPopup" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          <span v-if="contracts.isCreating"> Hợp đồng đang được tạo </span>
          <span v-if="contracts.isUpdating"> Hợp đồng đang được cập nhật </span>
          <span v-if="contracts.isLoading"> Hợp đồng đang được tải </span>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showQRDialog" width="350" persistent>
      <v-card v-if="!scanQRSuccess">
        <v-card-title style="background-color: #98b7d7; color: white">Mã quét</v-card-title>
        <v-card-text>
          <p>Người xem phòng quét mã để xem lại và kích hoạt hợp đồng.</p>
          <div class="d-flex justify-center align-center">
            <QrcodeVue :value="qrCodeValue" v-if="contracts.newlyCreated" :size="200" level="H" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/vendor">Màn hình chính</v-btn>
          <v-btn to="/vendor/view-contract">Xem hợp đồng</v-btn>
          <v-btn @click="showQRDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="scanQRSuccess">
        <v-card-title>
          <v-icon color="green">done_outline</v-icon>
          Tạo hợp đồng thành công!
        </v-card-title>
        <v-card-actions>
          <v-btn to="/vendor">Màn hình chính</v-btn>
          <v-btn to="/vendor/view-contract">Xem hợp đồng</v-btn>
          <v-btn @click="showQRDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
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
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <!-- <div class="d-flex justify-center title">{{ heading }}</div> -->
    <v-tabs v-if="ready" v-model="tabs.index" class="font-nunito font-weight-bold" color="#727cf5">
      <v-tab> 1. Thông tin hai bên </v-tab>
      <v-tab> 2. THÔNG TIN HỢP ĐỒNG </v-tab>
      <v-tab-item v-if="contract">
        <div class="d-flex flex-column justify-center align-end">
          <InfomationSection :renter="renter" :vendor="vendor" />
          <v-btn class="ma-4 btn-primary" @click="goToNextTab"
            >Tiếp tục <v-icon small>arrow_forward_ios</v-icon></v-btn
          >
        </div>
      </v-tab-item>
      <v-tab-item v-if="contract">
        <TermsOfContractSection
          @newValue="receiveNewTermsOfContract"
          :type="type"
          :group="group"
          @clickCreateContract="doCreateContract"
          @clickUpdateContract="doUpdateContract"
          :contractObj="contractFull"
          :mode="mode"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import QrcodeVue from 'qrcode.vue';
import InfomationSection from './InfomationSection.vue';
import TermsOfContractSection from './TermsOfContractSection.vue';
import processFCMForegroundMixins from '../../mixins/processFCMForeground';
import pushNotificationAction from '../../../config/pushNotificationActions';
import snackBarMixin from '../../mixins/snackBar';

export default {
  name: 'contract',
  mixins: [processFCMForegroundMixins, snackBarMixin],
  props: ['bookingId', 'contractId', 'mode'],
  components: { InfomationSection, TermsOfContractSection, QrcodeVue },
  data: () => ({
    heading: 'THÔNG TIN HỢP ĐỒNG',
    contract: {},
    contractFull: {},
    showQRDialog: false,
    tabs: {
      index: 0,
    },
    scanQRSuccess: false,
  }),
  methods: {
    ...mapActions({
      getBooking: 'user/getOneBooking',
      getOneBooking: 'user/getOneBooking',
      createContract: 'user/createContract',
      updateContract: 'user/updateContract',
    }),
    ...mapGetters({
      findBookingById: 'user/findBookingById',
      findContractById: 'user/findContractById',
    }),
    receiveNewTermsOfContract(terms) {
      this.contract = { ...terms };
    },
    doCreateContract() {
      this.contract.bookingId = this.bookingId;
      const { deal } = this.booking;
      this.contract.dealId = deal ? deal.dealId : null;
      this.contract.renterId = this.booking.renter.userId;
      this.contract.vendorId = this.booking.vendor.userId;
      this.contract.duration = Number(this.contract.duration);
      console.log(this.contract);
      this.createContract(this.contract);
    },
    goToNextTab() {
      this.tabs.index += 1;
      document.getElementById('contractView').scrollTop = 0;
    },
    closeDialog() {
      this.showQRDialog = false;
      this.scanQRSuccess = false;
    },
    doUpdateContract() {
      console.log('do update contract');
      this.updateContract(this.contract).then(() => {
        console.log('update contract success: ', this.contracts.success, this.contracts.error);
        if (this.contracts.success === true) {
          this.showSnackBar('cập nhật hợp đồng thành công', { color: 'green' });
        }
        if (this.contracts.success === false) {
          this.showSnackBar(`Lỗi: ${this.contracts.error.message}`, { color: 'red' });
        }
      });
    },
    showDoingPopup() {
      return this.contracts.isLoading || this.contracts.isUpdating || this.contracts.isCreating;
    },
  },
  computed: {
    ...mapState({
      bookings: (state) => state.user.bookings,
      contracts: (state) => state.user.contracts,
    }),
    ready() {
      switch (this.mode) {
        case 'create':
          return !this.bookings.isLoading;
        case 'update':
          return Object.entries(this.contractFull).length !== 0;
        case 'view':
          return Object.entries(this.contractFull).length !== 0;
        default:
          return false;
      }
    },
    renter() {
      if (this.mode === 'create') {
        return this.booking.renter;
      }
      if (this.mode === 'update' || this.mode === 'view') {
        return this.contractFull.renter;
      }
      return null;
    },
    vendor() {
      if (this.mode === 'create') {
        return this.booking.vendor;
      }
      if (this.mode === 'update' || this.mode === 'view') {
        return this.contractFull.vendor;
      }
      return null;
    },
    group() {
      if (this.mode === 'create') {
        return this.booking.group;
      }
      if (this.mode === 'update' || this.mode === 'view') {
        return this.contractFull.group;
      }
      return null;
    },
    type() {
      if (this.mode === 'create') {
        return this.booking.type;
      }
      if (this.mode === 'update' || this.mode === 'view') {
        return this.contractFull.type;
      }
      return null;
    },
    booking() {
      return this.findBookingById()(this.bookingId);
    },
    qrCodeValue() {
      return `contract: ${this.contracts.newlyCreated.contractId}, ${this.contracts.newlyCreated.qrCode}`;
    },
    newlyCreatedContract() {
      return this.contracts.newlyCreated;
    },
  },
  created() {
    console.log('contract.vue is created');
    if (this.mode === 'create') {
      this.getOneBooking(this.bookingId);
    }
    if (this.mode === 'update' || this.mode === 'view') {
      this.contractFull = this.findContractById()(this.contractId);
      if (this.contractFull.room) {
        this.contractFull.roomId = this.contractFull.room.roomId;
      }
    }
    this.registerMessaging(); // from mixins
  },
  watch: {
    newlyCreatedContract: {
      handler() {
        this.showQRDialog = true;
      },
      deep: true,
    },
    newMessage: {
      // from mixins
      handler() {
        if (this.newMessage.data.action === pushNotificationAction.SCAN_CONTRACT) {
          this.scanQRSuccess = true;
        }
      },
      deep: true,
    },
  },
};
</script>
<style>
.headline {
  text-align: center;
}
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
