<template>
  <div class="overflow-y-auto" max-height="100%" ref="contractView" id="contractView">
    <v-dialog v-model="confirmCreate" width="350" persistent>
      <v-card>
        <v-card-title>Bạn có đồng ý ký vào hợp đồng?</v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn @click="confirmCreate = false">Hủy</v-btn>
          <v-btn @click="doCreateContract">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUserEmptyFields" width="350" persistent>
      <v-card>
        <v-card-title> Vui lòng cập nhật thông tin để tạo hợp đồng </v-card-title>
        <v-card-text v-if="!isValidRenter">
          Người thuê phòng bổ sung thêm các thông tin sau: {{ renterEmptyFields.join(', ') }}
        </v-card-text>
        <v-card-text v-if="!isValidVendor">
          Chủ trọ vui lòng bổ sung thêm các thông tin sau: {{ vendorEmptyFieldsR }}
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!isValidVendor" to="/user">Cập nhật thông tin ngay</v-btn>
          <v-btn to="/vendor">Trang chủ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUpdateSuccess" width="350" persistent>
      <v-card>
        <v-card-title v-if="updateSuccess">
          <v-icon color="green">done_outline</v-icon>
          Cập nhật hợp đồng thành công
        </v-card-title>
        <v-card-title v-if="!updateSuccess">
          <v-icon color="red">clear</v-icon>
          Cập nhật hợp đồng không thành công
        </v-card-title>
        <v-card-text>
          {{ contracts.error }}
        </v-card-text>
        <v-card-actions>
          <v-btn to="/vendor">Quay lại tổng quan</v-btn>
          <v-btn to="/vendor/view-contract">Xem hợp đồng</v-btn>
          <v-btn @click="showUpdateSuccess = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEmptyFields" width="350" persistent>
      <v-card>
        <v-card-title>Điền đầy đủ thông tin trước khi tạo hợp đồng</v-card-title>
        <v-card-text>
          <p>Chọn phòng</p>
          <p>Ngày bắt đầu hợp đồng</p>
          <p>Thời hạn hợp đồng</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showEmptyFields = false"> <v-icon>clear</v-icon> Đóng </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCreateSuccess" width="350" persistent>
      <v-card>
        <v-card-title v-if="createSuccess">
          <v-icon color="green">done_outline</v-icon>
          Tạo hợp đồng thành công
        </v-card-title>
        <v-card-title v-if="!createSuccess">
          <v-icon color="red">clear</v-icon>
          Tạo hợp đồng không thành công
        </v-card-title>
        <v-card-text>
          {{ contracts.error }}
        </v-card-text>
        <v-card-actions>
          <v-btn to="/vendor">Màn hình chính</v-btn>
          <v-btn to="/vendor/view-contract">Xem hợp đồng</v-btn>
          <v-btn @click="showCreateSuccess = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-actions>
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
    <v-tabs
      v-if="ready && isMobile"
      v-model="tabs.index"
      class="font-nunito font-weight-bold"
      color="#727cf5"
    >
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
          :booking="booking"
          @clickCreateContract="doCreateContract"
          @clickUpdateContract="doUpdateContract"
          :contractObj="contractFull"
          :mode="mode"
        />
      </v-tab-item>
    </v-tabs>
    <v-row class="d-flex justify-space-between ma-0 pl-md-13 pt-10 font-nunito" no-gutters>
      <v-col cols="12" md="1" />
      <v-col cols="12" md="10">
        <v-card>
          <v-tabs
            v-if="ready && !isMobile"
            v-model="tabs.index"
            class="font-nunito font-weight-bold"
            color="#727cf5"
          >
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
                :booking="booking"
                @clickCreateContract="confirmCreate = true"
                @clickUpdateContract="doUpdateContract"
                @clickResignContract="doResignContract"
                :contractObj="contractFull"
                :mode="mode"
              />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
      <v-col cols="12" md="1" />
    </v-row>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import InfomationSection from '../../components/vendor/contract/InfomationSection.vue';
import TermsOfContractSection from '../../components/vendor/contract/TermsOfContractSection.vue';
import processFCMForegroundMixins from '../../components/mixins/processFCMForeground';
import actions from '../../config/pushNotificationActions';
import snackBarMixin from '../../components/mixins/snackBar';

export default {
  name: 'CreateContract',
  mixins: [processFCMForegroundMixins, snackBarMixin],
  components: { InfomationSection, TermsOfContractSection },
  data: () => ({
    heading: 'THÔNG TIN HỢP ĐỒNG',
    contract: {},
    contractFull: {},
    tabs: {
      index: 0,
    },
    updating: false,
    updateSuccess: null,
    showUpdateSuccess: false,
    createSuccess: null,
    showCreateSuccess: null,
    showEmptyFields: false,
    ready: false,
    confirmCreate: false,
  }),
  methods: {
    ...mapActions({
      createContract: 'user/createContract',
      updateContract: 'user/updateContract',
      getOneBooking: 'user/getOneBooking',
      getOneContract: 'user/getOneContract',
      getUser: 'user/getUser',
      sendNotification: 'user/sendNotification',
    }),
    ...mapGetters({
      findContractById: 'user/findContractById',
      findBookingById: 'user/findBookingById',
    }),
    receiveNewTermsOfContract(terms) {
      this.contract = { ...terms };
    },
    isEmptyField() {
      const room = this.contract.roomId === null;
      const duration = this.contract.duration === null;
      const startTime = this.contract.startTime === null;
      return room || duration || startTime;
    },
    doCreateContract() {
      if (this.isEmptyField()) {
        this.showEmptyFields = true;
        return;
      }
      this.contract.bookingId = this.bookingId;
      const { deal } = this.booking;
      this.contract.dealId = deal ? deal.dealId : null;
      this.contract.renterId = this.booking.renter.userId;
      this.contract.vendorId = this.booking.vendor.userId;
      this.contract.duration = Number(this.contract.duration);
      console.log(this.contract);
      this.createContract(this.contract).then(() => {
        this.showCreateSuccess = true;
        this.createSuccess = this.contracts.success;
        if (this.createSuccess) {
          const payload = {
            title: 'Hợp đồng thuê nhà phác thảo',
            body: `${this.group.groupName}, ${this.type.title}`,
            action: actions.NEW_CONTRACT,
            id: this.contracts.newlyCreated.contractId,
            icon: this.vendor.avatar,
            vendorId: null,
            renterId: this.renter.userId,
          };
          this.sendNotification(payload);
        }
      });
    },
    updateResignStatus() {
      const constract = this.contractFull;
      constract.resign = 'AGREE';
      return this.updateContract(constract);
    },
    sendNoti() {
      this.showCreateSuccess = true;
      this.createSuccess = this.contracts.success;
      if (this.createSuccess) {
        const payload = {
          title: `${this.group.vendor.username} đồng ý gia hạn hợp đồng`,
          body: `${this.group.groupName}, ${this.type.title}`,
          action: actions.AGREE_RESIGN_REQUEST,
          id: this.contracts.newlyCreatedContract.contractId,
          icon: this.vendor.avatar,
          vendorId: null,
          renterId: this.renter.userId,
        };
        this.sendNotification(payload);
      }
    },
    doResignContract() {
      if (this.isEmptyField()) {
        this.showEmptyFields = true;
        return;
      }
      // this.contract.bookingId = this.bookingId;
      // const { deal } = this.booking;
      // this.contract.dealId = deal ? deal.dealId : null;
      this.contract.renterId = this.renter.userId;
      this.contract.vendorId = this.vendor.userId;
      this.contract.duration = Number(this.contract.duration);
      console.log(this.contract);
      this.createContract(this.contract).then(() => {
        this.updateResignStatus().then(() => {
          this.sendNoti();
        });
      });
    },
    goToNextTab() {
      this.tabs.index += 1;
      document.getElementById('contractView').scrollTop = 0;
    },
    doUpdateContract() {
      if (this.isEmptyField()) {
        this.showEmptyFields = true;
        return;
      }
      this.updateSuccess = null;
      console.log('do update contract');
      const { images, ...rest } = this.contract;
      this.updateContract(rest).then(() => {
        this.showUpdateSuccess = true;
        if (this.contracts.success === true) {
          console.log('update contract success: ', this.contracts.success, this.contracts.error);
          this.showSnackBar('cập nhật hợp đồng thành công', { color: 'green' });
          this.updateSuccess = true;
          const payload = {
            title: 'Hợp đồng thuê nhà phác thảo được cập nhật',
            body: `${this.group.groupName}, ${this.type.title}`,
            action: actions.UPDATE_CONTRACT,
            id: this.contract.contractId,
            icon: this.contractFull.vendor.avatar,
            vendorId: null,
            renterId: this.contractFull.renter.userId,
          };
          this.sendNotification(payload);
        }
        if (this.contracts.success === false) {
          this.updateSuccess = false;
          this.showSnackBar(`Lỗi: ${this.contracts.error.message}`, { color: 'red' });
        }
      });
    },
    emptyFields(newUser, isRenter) {
      const emptyFields = [];
      if (!newUser) {
        return emptyFields;
      }
      const { username } = newUser;
      if (!username) {
        emptyFields.push('Tên');
      }
      const { yearOfBirth } = newUser;
      if (!yearOfBirth) {
        emptyFields.push('năm sinh');
      }
      if (isRenter) {
        const { provinceId } = newUser.hometown;
        if (!provinceId) {
          emptyFields.push('quê quán');
        }
        const { schoolId } = newUser.school;
        if (!schoolId) {
          emptyFields.push('trường đại học');
        }
      }
      const { email } = newUser;
      if (!email) {
        emptyFields.push('email');
      }
      const { citizenIdNum } = newUser;
      if (!citizenIdNum) {
        emptyFields.push('số CMNN');
      }
      const { idIssuedLocation } = newUser;
      if (!idIssuedLocation) {
        emptyFields.push('nơi cấp CMNN');
      }
      const { idIssuedDate } = newUser;
      if (!idIssuedDate) {
        emptyFields.push('ngày cấp CMNN');
      }
      const { householdAddress } = newUser;
      if (!householdAddress) {
        emptyFields.push('địa chỉ thường trú');
      }
      const { currentAddress } = newUser;
      if (!currentAddress) {
        emptyFields.push('địa chỉ hiện tại');
      }
      const { citizenIdFrontImg } = newUser;
      if (!citizenIdFrontImg) {
        emptyFields.push('ảnh mặt trước CMNN');
      }
      const { citizenIdBackImg } = newUser;
      if (!citizenIdBackImg) {
        emptyFields.push('ảnh mắt sau CMNN');
      }
      return emptyFields;
    },
  },
  computed: {
    ...mapState({
      contracts: (state) => state.user.contracts,
      bookings: (state) => state.user.bookings,
      user: (state) => state.user.user,
    }),
    showDoingPopup() {
      return this.contracts.isLoading || this.contracts.isUpdating || this.contracts.isCreating;
    },
    bookingId() {
      return this.$route.query.bookingId;
    },
    contractId() {
      return this.$route.query.contractId;
    },
    renter() {
      if (this.mode === 'create') {
        if (this.booking) {
          return this.booking.renter;
        }
        return null;
      }
      if (this.mode === 'update' || this.mode === 'resign') {
        return this.contractFull.renter;
      }
      return null;
    },
    vendor() {
      if (this.mode === 'create' && this.booking) {
        return this.booking.vendor;
      }
      if (this.mode === 'update' || this.mode === 'resign') {
        return this.contractFull.vendor;
      }
      return null;
    },
    group() {
      if (this.mode === 'create' && this.booking) {
        return this.booking.group;
      }
      if (this.mode === 'update' || this.mode === 'resign') {
        return this.contractFull.group;
      }
      return null;
    },
    type() {
      if (this.mode === 'create' && this.booking) {
        return this.booking.type;
      }
      if (this.mode === 'update' || this.mode === 'resign') {
        return this.contractFull.type;
      }
      return null;
    },
    mode() {
      return this.$route.query.mode;
    },
    booking() {
      return this.findBookingById()(this.bookingId);
    },
    qrCodeValue() {
      if (this.newlyCreatedContract) {
        return `contract: ${this.contracts.newlyCreated.contractId}, ${this.contracts.newlyCreated.qrCode}`;
      }
      return 'nothing here';
    },
    newlyCreatedContract() {
      return this.contracts.newlyCreated;
    },
    renterEmptyFields() {
      const emptyFields = this.emptyFields(this.renter, true);
      return emptyFields;
    },
    isValidRenter() {
      return this.renterEmptyFields.length === 0;
    },
    vendorEmptyfieldsR() {
      console.log('vendor empty fields');
      const emptyFields = this.emptyFields(this.renter, true);
      return emptyFields;
    },
    isValidVendor() {
      return this.vendorEmptyfieldsR.length === 0;
    },
    showUserEmptyFields() {
      return !this.isValidRenter || !this.isValidVendor;
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
    this.ready = false;
    this.getUser().then(() => {
      console.log('mode: ', this.mode);

      if (this.mode === 'create') {
        this.getOneBooking(this.bookingId).then(() => {
          if (!this.isValidRenter) {
            this.sendNotification({
              title: 'Vui lòng cập nhật thông tin để tạo hợp đồngv',
              body: `${this.renterEmptyFields.join(', ')}`,
              action: actions.REQUIRED_UPDATE_INFO,
              id: '',
              icon: this.renter.avatar,
              vendorId: null,
              renterId: this.renter.userId,
            });
          }
        });
        console.log('here');
        this.ready = true;
      }
      if (this.mode === 'update' || this.mode === 'resign') {
        this.getOneContract(this.contractId).then(() => {
          this.contractFull = this.findContractById()(this.contractId);
          if (this.contractFull.room) {
            this.contractFull.roomId = this.contractFull.room.roomId;
          }
          this.ready = true;
        });
      }
    });
    this.registerMessaging(); // from mixins
  },
  mounted() {},
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
        if (this.newMessage.data.action === actions.SCAN_CONTRACT) {
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
