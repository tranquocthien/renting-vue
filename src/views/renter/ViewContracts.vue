<template>
  <!-- eslint-disable max-len -->
  <div>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="signingResult.show" hide-overlay persistent width="300">
      <v-card>
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="signingResult.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="d-flex justify-center pt-3" style="font-size: 18px">
          <span v-if="signingResult.success"> Ký hợp đồng thành công </span>
          <span v-if="!signingResult.success"> Ký hợp đồng thất bại </span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="payReserveFee.show" hide-overlay persistent width="450">
      <v-card v-if="!payReserveFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận đã thanh toán</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payReserveFee.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          Tải lên hình ảnh của biên lai đóng tiền giữ chỗ cho chủ trọ
          <image-editor :oldImages="[]" @newValues="receiveNewImages" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="payReserveFee.images.length === 0"
            @click="doPayReserveFee"
            :color="payReserveFee.images.length === 0 ? '' : '#727CF5'"
            :dark="payReserveFee.images.length === 0 ? false : true"
            >Gửi xác nhận</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-if="payReserveFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payReserveFee.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3 d-flex justify-center" style="font-size: 18px">
          <span v-if="payReserveFee.success">Gửi thông tin giao dịch thanh toán thành công</span>
          <span v-if="!payReserveFee.success">Gửi thông tin giao dịch thanh toán thất bại</span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="payReserveFee.showPaidRest" hide-overlay persistent width="450">
      <v-card v-if="!payReserveFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận thanh toán phần tiền còn lại</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payReserveFee.showPaidRest = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          Tải lên hình ảnh của biên lai chuyển khoản cho chủ trọ
          <image-editor :oldImages="[]" @newValues="receiveNewImagesRest" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="payReserveFee.images.length === 0"
            @click="doPaidRestFee"
            :color="payReserveFee.images.length === 0 ? '' : '#727CF5'"
            :dark="payReserveFee.images.length === 0 ? false : true"
            >yêu cầu</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-if="payReserveFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payReserveFee.showPaidRest = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3 d-flex justify-center" style="font-size: 18px">
          <span v-if="payReserveFee.success">Gửi thông tin giao dịch thanh toán thành công</span>
          <span v-if="!payReserveFee.success">Gửi thông tin giao dịch thanh toán thất bại</span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="payAllFee.show" hide-overlay persistent width="450">
      <v-card v-if="!payAllFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận đã thanh toán</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payAllFee.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3">
          Tải lên hình ảnh của biên lai đóng tiền giữ chỗ cho chủ trọ
          <image-editor :oldImages="[]" @newValues="receiveNewImagesAll" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="payAllFee.images.length === 0"
            @click="doPayAllFee"
            :color="payAllFee.images.length === 0 ? '' : '#727CF5'"
            :dark="payAllFee.images.length === 0 ? false : true"
            >Gửi xác nhận</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card v-if="payAllFee.showResult">
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Xác nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="payAllFee.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-3 d-flex justify-center" style="font-size: 18px">
          <span v-if="payAllFee.success">Gửi thông tin giao dịch thanh toán thành công</span>
          <span v-if="!payAllFee.success">Gửi thông tin giao dịch thanh toán thất bại</span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="signAndPay.show" persistent max-width="300">
      <v-card>
        <v-stepper v-model="signAndPayStep" vertical class="elevation-0 pt-3">
          <v-stepper-step :complete="signAndPayStep > 1" step="1"> Ký hợp đồng </v-stepper-step>
          <v-stepper-content step="1">
            <v-card>
              <v-card-text>
                <v-chip @click="contractOverlay.show = true">Nhấn vào đây</v-chip> để đọc và ký hợp
                đồng.
              </v-card-text>
            </v-card>
          </v-stepper-content>
          <v-stepper-step :complete="signAndPayStep > 2" step="2">
            Gửi thông tin thanh toán
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card>
              <v-card-text>
                Chuyển khoản tiền cọc giữ chỗ cho chủ trọ. Sau đó
                <v-chip v-if="!signAndPay.payAll" @click="payReserveFee.show = true"
                  >Nhấn vào đây</v-chip
                >
                <v-chip v-if="signAndPay.payAll" @click="payAllFee.show = true"
                  >Nhấn vào đây</v-chip
                >
                để gửi ảnh biên lai chuyển tiền cho chủ trọ.
              </v-card-text>
            </v-card>
          </v-stepper-content>
        </v-stepper>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="signAndPay.show = false"> Đóng </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="contractOverlay.show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card v-if="contractOverlay.contract">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closePdf">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Hợp đồng</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="d-flex flex-column justify-center" style="height: calc(100vh - 64px)">
          <PDFDocument :url="contractOverlay.contract.contractUrl" :scale="scale">
            <template v-slot:footer>
              <div class="d-flex flex-column justify-center align-center">
                <v-card
                  v-if="contractOverlay.action === 'activate'"
                  class="d-flex flex-column justify-center"
                  width="200"
                >
                  <v-checkbox
                    class="filter font-nunito text-primary"
                    v-model="contractOverlay.agree"
                    label="Tôi đồng ý với các điều khoản trong hợp đồng"
                  ></v-checkbox>
                  <v-btn
                    :disabled="!contractOverlay.agree"
                    class="ma-1"
                    outlined
                    color="red"
                    text
                    @click="doActivateContract"
                  >
                    <v-icon>edit</v-icon> Ký hợp đồng
                  </v-btn>
                </v-card>
              </div>
            </template>
          </PDFDocument>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="momoPayment.show" hide-overlay persistent width="350">
      <v-card>
        <v-toolbar color="#727cf5" dark class="font-nunito">
          <v-toolbar-title>Yêu cầu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="d-flex justify-end" @click="momoPayment.show = false" icon>
            <v-icon class="mr-3"> clear </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="d-flex justify-center pt-3" style="font-size: 18px">
          <v-row>
            <v-col cols="12">
              <span>Bạn cần có: </span>
            </v-col>
            <v-col cols="12">
              <span>1. Mật khẩu đăng nhập ví MoMo.</span>
            </v-col>
            <v-col cols="12">
              <span>2. Số điện thoại đăng kí với MoMo vẫn đang hoạt động.</span>
            </v-col>
            <v-col cols="12">
              <span>3. Đã cài đặt ứng dụng MoMo trên điện thoại.</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                color="#727CF5"
                dark
                :href="momoPayment.url"
                target="_blank"
                @click="momoPayment.show = false"
              >
                Xác nhận
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resign.show" hide-overlay persistent width="350">
      <v-card v-if="resign.contract && !resign.showResult" :loading="contracts.isUpdating">
        <v-card-title>Gia hạn hợp đồng</v-card-title>
        <v-card-text>
          Hợp đồng thuê nhà giữa bạn và {{ resign.contract.vendor.username }} còn đến ngày
          {{ getEndDate(resign.contract) }}, bạn có muốn gửi yêu cầu gia hạn hợp đồng?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="resign.show = false">Đóng</v-btn>
          <v-btn @click="doResignContract">Gia hạn</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="resign.showResult">
        <v-card-title v-if="resign.success">Gửi yêu cầu gia hạn hợp đồng thành công</v-card-title>
        <v-card-title v-if="!resign.success">Gửi yêu cầu gia hạn hợp đồng thất bại</v-card-title>
        <v-card-actions>
          <v-btn @click="resign.show = false">Đóng</v-btn>
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
    <v-container v-if="!isLoading">
      <v-row
        :class="isMobile ? 'd-flex justify-end pr-10 pb-0' : 'd-flex justify-center pr-10 pb-0'"
      >
        <v-col cols="11" sm="11" md="11" lg="11" xl="10">
          <v-row no-gutters class="d-flex justify-end pr-10 pb-0">
            <v-col :cols="isMobile ? '7' : '3'">
              <v-text-field
                label="Tìm kiếm chủ trọ, nhà trọ"
                v-model="searchQuery"
                append-icon="search"
                solo
                hide-details
                class="mt-3 text-muted pa-0 size-sub-2 chat mb-7 hidden-sm-and-down"
                height="35"
                rounded
              ></v-text-field>
              <v-text-field
                label="Tìm kiếm"
                v-model="searchQuery"
                append-icon="search"
                solo
                hide-details
                class="mt-3 text-muted pa-0 size-sub-2 chat hidden-sm-and-up"
                height="35"
                rounded
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="11" sm="11" md="11" lg="11" xl="10">
          <v-row class="hidden-xs-only">
            <div class="d-flex px-4" style="width: 100%">
              <v-col cols="3" class="d-flex align-center pl-0">
                <span class="font-nunito text-gray size-sub-2">Chủ trọ</span>
              </v-col>
              <v-col cols="3" class="d-flex align-center pl-0">
                <span class="font-nunito text-gray size-sub-2">Nhà trọ</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-center align-center">
                <span class="font-nunito text-gray size-sub-2">Phòng</span>
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <span class="font-nunito text-gray size-sub-2">Ngày bắt đầu</span>
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <span class="font-nunito text-gray size-sub-2">Ngày hết hạn</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-center align-center">
                <span class="font-nunito text-gray size-sub-2"></span>
              </v-col>
              <!-- </v-col><v-col cols="1" class="d-flex justify-center align-center">
                <span class="font-nunito text-gray size-sub-2">Trạng thái</span>
              </v-col> -->
            </div>
          </v-row>
          <v-row class="mt-2">
            <div
              v-for="contract in searchContract"
              v-bind:key="contract.contractId"
              style="width: 100%"
            >
              <contractItem
                :contract="contract"
                @view-detail="viewContractDetail"
                @activate="openActivateContract"
                @pay-reserve-fee="showPayReserveFee"
                @momo-payment="showMoMoPayment"
                @paid-rest="paidTheRestOfContract"
                @pay-all-fee="showPayAllFee"
                @resign="showResignContract"
                @show-pay-reserve-fee="showFirstPay"
              />
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style scoped></style>
<script>
import { mapActions } from 'vuex';
import contractItem from '@/components/view_contracts/contractItem.vue';
import snackBarMixin from '../../components/mixins/snackBar';
import PDFDocument from '../../components/vendor/pdfviewer/PDFDocument.vue';
import mobileMixin from '../../components/mixins/mobile';
import ImageEditor from '../../components/vendor/hostel_management/ImageEditor.vue';
import actions from '../../config/pushNotificationActions';

export default {
  name: 'ViewContracts',
  components: { contractItem, PDFDocument, ImageEditor },
  mixins: [snackBarMixin, mobileMixin],
  data: () => ({
    contractOverlay: {
      show: false,
      action: null, // view or activate
      contract: null,
      agree: false,
    },
    signingResult: {
      show: false,
      success: null,
    },
    payReserveFee: {
      show: false,
      images: [],
      contractId: null,
      success: false,
      showResult: false,
      showPaidRest: false,
    },
    signAndPay: {
      show: false,
      step: 1,
      payAll: false,
    },
    searchQuery: '',
    momoPayment: {
      show: false,
      url: null,
    },
    payAllFee: {
      show: false,
      images: [],
      contractId: null,
      success: false,
      showResult: false,
    },
    resign: {
      show: false,
      contract: null,
      showResult: false,
      success: null,
    },
  }),
  methods: {
    ...mapActions({
      getContracts: 'user/getContracts',
      getUser: 'user/getUser',
      activateContract: 'user/activateContract',
      updateContract: 'user/updateContract',
      sendNotification: 'user/sendNotification',
    }),
    closePdf() {
      this.contractOverlay.show = false;
      this.contractOverlay.contract = null;
    },
    showFirstPay(contractId) {
      const contract = this.contracts.data.find((c) => c.contractId === contractId);
      this.payReserveFee.contractId = contractId;
      this.payAllFee.contractId = contractId;
      if (contract.reserved) {
        this.payReserveFee.show = true;
      } else {
        this.payAllFee.show = true;
      }
    },
    getEndDate(contract) {
      const { startTime, duration } = contract;
      const endDate = new Date(startTime);
      endDate.setMonth(endDate.getMonth() + duration);
      return endDate.toLocaleDateString('vi');
    },
    showResignContract(contractId) {
      this.resign.show = true;
      this.resign.contract = this.contracts.data.find((c) => c.contractId === contractId);
      this.resign.showResult = false;
      this.resign.success = null;
    },
    doResignContract() {
      const { contract } = this.resign;
      contract.resign = 'REQUEST';
      this.updateContract(contract).then(() => {
        const { success } = this.contracts;
        this.resign.showResult = true;
        this.resign.success = success;
        if (success) {
          this.sendNotification({
            title: `${contract.renter.username} yêu cầu gia hạn hợp đồng`,
            body: `${contract.group.groupName}, ${contract.type.title}, ${contract.room.roomName}`,
            action: actions.RESIGN_REQUEST,
            id: contract.contractId,
            icon: contract.renter.avatar,
            vendorId: contract.vendor.userId,
            renterId: null,
          });
        }
      });
    },
    doPayAllFee() {
      const contract = this.contracts.data.find((c) => c.contractId === this.payAllFee.contractId);
      contract.roomId = contract.room.roomId;
      contract.paid = true;
      contract.images = [...this.payAllFee.images, ...contract.images];
      const { contractId } = contract;
      this.updateContract(contract).then(() => {
        const { success } = this.contracts;
        this.payAllFee.success = success;
        this.payAllFee.showResult = true;
        if (success) {
          this.signAndPay.step += 1;
          const payload = {
            title: `${contract.renter.username} đóng tiền`,
            body: `${contract.type.price} triệu đồng`,
            action: actions.ALL_FEE_PAID,
            id: contract.contractId,
            vendorId: contract.vendor.userId,
            renterId: null,
            icon: contract.renter.avatar,
          };
          this.sendNotification(payload);
          this.contractOverlay.contract = this.contracts.data.find(
            (c) => c.contractId === contractId,
          );
        }
      });
    },
    showPayAllFee(contractId) {
      this.signAndPay.show = true;
      this.signAndPay.payAll = true;
      this.payAllFee.showResult = false;
      this.payAllFee.success = false;
      this.payAllFee.contractId = contractId;
      this.contractOverlay.action = 'activate';
      this.contractOverlay.contract = this.contracts.data.find((c) => c.contractId === contractId);
    },
    doPaidRestFee() {
      this.payReserveFee.showResult = false;
      this.payReserveFee.success = false;
      const contract = this.contracts.data.find(
        (c) => c.contractId === this.payReserveFee.contractId,
      );
      contract.roomId = contract.room.roomId;
      contract.paid = true;
      contract.images = [...this.payReserveFee.images, ...contract.images];
      const { contractId } = contract;
      this.updateContract(contract).then(() => {
        const { success } = this.contracts;
        this.payReserveFee.success = success;
        this.payReserveFee.showResult = true;
        if (success) {
          this.signAndPay.step += 1;
          const payload = {
            title: `${contract.renter.username} đóng phần tiền còn lại để hoàn tất hợp đồng`,
            body: `${contract.type.price - contract.downPayment} triệu đồng`,
            action: actions.RESERVE_FEE_PAID,
            id: contract.contractId,
            vendorId: contract.vendor.userId,
            renterId: null,
            icon: contract.renter.avatar,
          };
          this.sendNotification(payload);
          this.contractOverlay.contract = this.contracts.data.find(
            (c) => c.contractId === contractId,
          );
        }
      });
    },
    paidTheRestOfContract(contractId) {
      this.payReserveFee.showPaidRest = true;
      this.payReserveFee.showResult = false;
      this.payReserveFee.success = false;
      this.payReserveFee.contractId = contractId;
    },
    receiveNewImages(images) {
      this.payReserveFee.images = images.map((img) => ({ ...img, type: 'RESERVED_BILL' }));
    },
    receiveNewImagesRest(images) {
      this.payReserveFee.images = images.map((img) => ({ ...img, type: 'REST_BILL' }));
    },
    receiveNewImagesAll(images) {
      this.payAllFee.images = images.map((img) => ({ ...img, type: 'REST_BILL' }));
    },
    showPayReserveFee(contractId) {
      this.signAndPay.show = true;
      this.payReserveFee.contractId = contractId;
      this.payReserveFee.showResult = false;
      this.payReserveFee.success = false;
      this.contractOverlay.action = 'activate';
      this.contractOverlay.contract = this.contracts.data.find((c) => c.contractId === contractId);
    },
    showMoMoPayment(url) {
      this.momoPayment.url = url;
      this.momoPayment.show = true;
    },
    doPayReserveFee() {
      const contract = this.contracts.data.find(
        (c) => c.contractId === this.payReserveFee.contractId,
      );
      contract.roomId = contract.room.roomId;
      contract.paid = true;
      contract.images = [...this.payReserveFee.images, ...contract.images];
      const { contractId } = contract;
      this.updateContract(contract).then(() => {
        const { success } = this.contracts;
        this.payReserveFee.success = success;
        this.payReserveFee.showResult = true;
        if (success) {
          this.signAndPay.step += 1;
          const payload = {
            title: `${contract.renter.username} đóng tiền cọc giữ chân`,
            body: `${contract.downPayment} triệu đồng`,
            action: actions.RESERVE_FEE_PAID,
            id: contract.contractId,
            vendorId: contract.vendor.userId,
            renterId: null,
            icon: contract.renter.avatar,
          };
          this.sendNotification(payload);
          this.contractOverlay.contract = this.contracts.data.find(
            (c) => c.contractId === contractId,
          );
        }
      });
    },
    doActivateContract() {
      const status = 'ACCEPTED';
      const { contractId } = this.contractOverlay.contract;
      const { qrCode } = this.contractOverlay.contract;
      const payload = {
        contractId,
        qrCode,
        status,
      };
      this.activateContract(payload).then(() => {
        this.contractOverlay.show = false;
        this.signingResult.show = true;
        const { contract } = this.contractOverlay;
        const { success, error } = this.contracts;
        if (success) {
          this.signingResult.success = true;
          console.log(success);
          this.showSnackBar('Kích hoạt hợp đồng thành công', { color: 'green' });
          this.signAndPay.step += 1;
          const p = {
            title: `${contract.renter.username} đã ký vào hợp đồng`,
            body: `phòng ${contract.room.roomName}, ${contract.type.title}`,
            action: actions.CONTRACT_ACCEPTED,
            id: contract.contractId,
            vendorId: contract.vendor.userId,
            renterId: null,
            icon: contract.renter.avatar,
          };
          this.sendNotification(p);
          this.contractOverlay.contract = this.contracts.data.find(
            (c) => c.contractId === contractId,
          );
        } else {
          this.signingResult.success = false;
          console.log(error);
          this.showSnackBar(`Kích hoạt hợp đồng thất bại ${error.message}`, { color: 'red' });
        }
      });
    },
    viewContractDetail(contractId) {
      console.log(contractId);
      this.contractOverlay.show = true;
      this.contractOverlay.action = 'view';
      this.contractOverlay.contract = this.contracts.data.find((c) => c.contractId === contractId);
    },
    openActivateContract(contractId) {
      console.log(contractId);
      this.contractOverlay.show = true;
      this.contractOverlay.action = 'activate';
      this.contractOverlay.contract = this.contracts.data.find((c) => c.contractId === contractId);
    },
  },
  created() {
    this.getUser().then(() => {
      this.getContracts();
    });
  },
  computed: {
    step() {
      const { contract } = this.contractOverlay;
      if (contract) {
        if (contract.status === 'ACCEPTED') {
          if (contract.paid === true) {
            return 3;
          }
          return 2;
        }
      }
      return 1;
    },
    signAndPayStep() {
      const { contract } = this.contractOverlay;
      if (contract) {
        if (contract.status === 'ACCEPTED') {
          if (contract.paid) {
            return 3;
          }
          return 2;
        }
      }
      return 1;
    },
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
      return loadingUser || loadingContracts || updatingContracts;
    },
    signing() {
      return this.$store.state.user.contracts.isUpdating;
    },
    contracts() {
      return this.$store.state.user.contracts;
    },
    searchContract() {
      if (!this.searchQuery) {
        return this.contracts.data;
      }
      return this.$store.state.user.contracts.data.filter((item) => {
        const b =
          item.vendor.username.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1 ||
          item.group.groupName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1;
        return b;
      });
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
</style>
