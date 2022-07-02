<template>
  <div v-if="!isLoading" class="d-flex justify-center" style="height: calc(100vh - 120px)">
    <v-col cols="12" md="6">
      <v-card style="height: 90%">
        <p></p>
        <p class="error text-center">{{ error }}</p>
        <!-- <p class="decode-result">
              Last result: <b>{{ result }}</b>
            </p> -->
        <qrcode-drop-zone
          v-if="!noStreamApiSupport"
          @decode="onDecode"
          @init="onInit"
          style="height: 100%"
        >
          <qrcode-stream @decode="onDecode" @init="onInit" />
        </qrcode-drop-zone>
        <qrcode-capture v-if="noStreamApiSupport" @decode="onDecode" />
      </v-card>
      <v-dialog v-model="bookings.isUpdating" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Đang xác thực
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline">
            <span v-if="!bookings.success" class="red--text"
              ><v-icon>report</v-icon> Xác thực thất bại</span
            >
            <span v-if="bookings.success" class="green--text"
              ><v-icon>done_outline</v-icon>Xác thực thành công</span
            >
          </v-card-title>
          <v-card-text v-if="bookings.success && booking">
            <p>Chủ trọ: {{ booking.vendor.username }}</p>
            <p>Nhà trọ: {{ booking.group.groupName }}</p>
            <p>Loại phòng: {{ booking.type.title }}</p>
            <p>Giá gốc: {{ booking.type.price }} triệu đồng</p>
            <p v-if="booking.deal">Giá thương lượng: {{ booking.deal.offeredPrice }} triệu đồng</p>
          </v-card-text>
          <v-card-text v-if="bookings.error" class="d-flex justify-center mt-5">
            <span
              >Mã QR của booking này không thuộc về bạn. Hãy yêu cầu chủ trọ chọn booking
              khác.</span
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> Đóng </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        :value="previewDialog.constract !== null"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        id="contractView"
      >
        <v-card :loading="contracts.isLoading">
          <!-- <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="activateContract">
                Kích hoạt hợp đồng
              </v-btn>
            </v-toolbar-items>
          </v-toolbar> -->
          <!-- <v-progress-linear :value="previewDialog.pdfProgress"></v-progress-linear>
          <pdf :src="previewDialog.pdf" :page="1" @progress="progressPdf" /> -->
          <!-- <span v-if="previewDialog.constract">{{ previewDialog.constract.type.title }}</span> -->
          <v-tabs
            v-model="tabs.index"
            class="font-nunito font-weight-bold"
            color="#727cf5"
            v-if="previewDialog.constract"
          >
            <v-tab> 1. Thông tin hai bên </v-tab>
            <v-tab> 2. THÔNG TIN HỢP ĐỒNG </v-tab>
            <v-tab-item>
              <div class="d-flex flex-column justify-center align-end">
                <InfomationSection
                  :renter="previewDialog.constract.renter"
                  :vendor="previewDialog.constract.vendor"
                />
                <v-btn class="ma-4 btn-primary" @click="goToNextTab"
                  >Tiếp tục <v-icon small>arrow_forward_ios</v-icon></v-btn
                >
              </div>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-row no-gutters>
                  <v-col>
                    <v-card>
                      <v-row no-gutters>
                        <v-col cols="12" md="6">
                          <v-card-text class="py-0">
                            <v-row>
                              <v-col cols="12" class="d-flex flex-column mt-5">
                                <span class="text-h6">THÔNG TIN PHÒNG TRỌ</span>
                                <span class="font-weight-bold text-gray-black mt-5">Nhà trọ </span>
                                <span class="text size-sub-2 px-3 py-2 mt-2">{{
                                  previewDialog.constract.group.groupName
                                }}</span>
                              </v-col>
                              <v-col cols="12" class="d-flex flex-column">
                                <span class="font-weight-bold text-gray-black">Phòng </span>
                                <span class="text size-sub-2 px-3 py-2 mt-2">{{
                                  previewDialog.constract.room.roomName
                                }}</span>
                              </v-col>

                              <v-col cols="12" sm="6" class="d-flex flex-column">
                                <span class="font-weight-bold text-gray-black"
                                  >Ngày bắt đầu hợp đồng<span class="text-danger"></span>
                                </span>
                                <span class="text size-sub-2 px-3 py-2 mt-2">{{
                                  startTimeString(previewDialog.constract.startTime)
                                }}</span>
                              </v-col>
                              <v-col cols="12" sm="6" class="d-flex flex-column">
                                <span class="font-weight-bold text-gray-black"
                                  >Thời hạn hợp đồng</span
                                >
                                <span class="text size-sub-2 px-3 py-2 mt-2">
                                  {{ previewDialog.constract.duration }} tháng
                                </span>
                              </v-col>
                              <v-col cols="6" sm="6" class="d-flex flex-column">
                                <span class="font-weight-bold text-gray-black">Tiền thuê </span>
                                <span class="text size-sub-2 px-3 py-2 mt-2 d-flex"
                                  ><span>
                                    {{ previewDialog.constract.type.price }}
                                    {{ previewDialog.constract.type.priceUnit }}
                                  </span>
                                </span>
                              </v-col>
                              <v-col cols="6" sm="6" class="d-flex flex-column">
                                <span class="font-weight-bold text-gray-black">Tiền cọc</span>
                                <span class="text size-sub-2 px-3 py-2 mt-2 d-flex"
                                  ><span>
                                    {{ previewDialog.constract.type.deposit }}
                                  </span>
                                  <span class="ml-auto">tháng tiền phòng</span>
                                </span>
                              </v-col>
                              <v-col cols="12" class="d-flex flex-column">
                                <span class="font-weight-bold text-warning">Tổng tiền</span>
                                <span class="text size-sub-2 px-3 py-2 mt-2 d-flex"
                                  ><span>
                                    {{
                                      previewDialog.constract.type.price +
                                      previewDialog.constract.type.price *
                                        previewDialog.constract.type.deposit
                                    }}
                                    {{ previewDialog.constract.type.priceUnit }}
                                  </span>
                                </span>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-card-text class="py-0">
                            <v-row>
                              <v-col cols="12" class="d-flex flex-column justify-center">
                                <span class="text-h6 mt-5">THÔNG TIN DỊCH VỤ</span>
                                <servicesBox
                                  :services="previewDialog.constract.group.services"
                                  class="mt-5"
                                />
                              </v-col>
                              <v-col cols="12" class="d-flex flex-column justify-center">
                                <span class="text-h6 mt-5">NỘI THẤT</span>
                                <span class="d-flex flex-wrap">
                                  <span
                                    v-for="item in previewDialog.constract.type.facilities"
                                    v-bind:key="item.facilityId"
                                    class="font-nunito text-lowercase mr-2"
                                    color="#f1f3fa"
                                  >
                                    {{ item.facilityName }},
                                  </span>
                                </span>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" class="d-flex flex-column">
                                <span
                                  >Tiền đặt cọc sẽ được trả lại đầy đủ cho bên B khi hết hợp đồng
                                  thuê phòng trọ với điều kiện thanh toán đầy đủ tiền điện, nước,
                                  phí dịch vụ và các khoản khác liên quan.</span
                                >
                                <span class="mt-2"
                                  >Bên A ngưng hợp đồng (lấy lại nhà) trước thời hạn thì bồi thường
                                  gấp đôi số tiền bên B đã đặt cọc.</span
                                >
                                <span class="mt-2"
                                  >Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế
                                  chân.</span
                                >
                              </v-col>
                              <v-col cols="12"> </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>
                        <v-row>
                          <v-col cols="12" md="6" class="ml-auto pa-0">
                            <v-btn class="ma-4 btn-primary" @click="doActivateContract">
                              Đồng ý với các điều khoản và kích hoạt hợp đồng
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-dialog>
      <v-dialog v-model="contracts.isUpdating" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Đang kích hoạt hợp đồng
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
    </v-col>
  </div>
</template>
<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader';
import { mapActions, mapState, mapGetters } from 'vuex';
import snackBarMixin from '../../components/mixins/snackBar';
import InfomationSection from '../../components/vendor/contract/InfomationSection.vue';
import servicesBox from '../../components/hostel_type/servicesBox.vue';
import actions from '../../config/pushNotificationActions';

export default {
  name: 'QR-Reader',
  mixins: [snackBarMixin],
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    InfomationSection,
    servicesBox,
    // RegulationTable,
    // FacilityTable,
    // TermsOfContractSection,
    // pdf,
  },
  data: () => ({
    result: '',
    error: '',
    dialog: false,
    booking: null,
    updating: false,
    noStreamApiSupport: false,
    previewDialog: {
      show: false,
      pdf: null,
      contractId: null,
      contractSecret: null,
      pdfProgress: 0,
      constract: null,
    },
    tabs: {
      index: 0,
    },
  }),
  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      getBookings: 'user/getBookings',
      updateBookingStatus: 'user/updateBookingStatus',
      getContracts: 'user/getContracts',
      getOneContract: 'user/getOneContract',
      activateContract: 'user/activateContract',
      sendNotification: 'user/sendNotification',
    }),
    startTimeString(time) {
      return new Date(time).toLocaleDateString('vi-vn');
    },
    ...mapGetters({
      findContractById: 'user/findContractById',
    }),
    goToNextTab() {
      this.tabs.index += 1;
      document.getElementById('contractView').scrollTop = 0;
    },
    onDecode(result) {
      this.result = result;
      console.log(result);
      const [type, bookingId, qrCode] = this.result.split(':');
      const content = { bookingId, qrCode };
      console.log(type, content);
      switch (type) {
        case 'booking':
          console.log('booking', content);
          this.booking = null;
          this.updateBookingStatus(content).then(() => {
            const booking = this.bookings.data.find((item) => item.bookingId === Number(bookingId));
            this.booking = booking;
            this.dialog = true;
            this.sendNotification({
              title: `${booking.renter.username} xác nhận gặp mặt`,
              body: `${booking.type.title}`,
              action: actions.SCAN_BOOKING,
              id: Number(bookingId),
              icon: booking.renter.avatar,
              vendorId: booking.vendor.userId,
              renterId: null,
            });
          });
          break;
        case 'contract':
          this.showPreviewDialog(content);
          break;
        default:
          console.log('error');
      }
    },
    showPreviewDialog(content) {
      let [contractId, contractSecret] = content.split(',');
      contractId = contractId.trim();
      contractSecret = contractSecret.trim();
      console.log(contractId, contractSecret);
      this.previewDialog.contractId = contractId;
      this.previewDialog.contractSecret = contractSecret;
      this.getOneContract(contractId).then(() => {
        this.findContract(contractId);
        this.previewDialog.show = true;
      });
      // const createdContract = this.findContractById()(contractId);
      // this.previewDialog.constract = createdContract;
      this.previewDialog.pdf = 'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf'; // createdContract.pdf;
    },
    findContract(contractId) {
      console.log(contractId);
      const createdContract = this.findContractById()(contractId);
      this.previewDialog.constract = createdContract;
    },
    doActivateContract() {
      const payload = {
        contractId: this.previewDialog.contractId.trim(),
        qrCode: this.previewDialog.contractSecret.trim(),
        status: 'ACTIVATED',
      };
      this.activateContract(payload).then(() => {
        this.previewDialog.show = false;
        const { success, error } = this.contracts;
        if (success) {
          console.log(success);
          this.showSnackBar('Kích hoạt hợp đồng thành công', { color: 'green' });
          this.$router.push('/contract');
        } else {
          console.log(error);
          this.showSnackBar(`Kích hoạt hợp đồng thất bại ${error.message}`, { color: 'red' });
        }
      });
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'ERROR: you need to grant camera access permisson';
        } else if (error.name === 'NotFoundError') {
          this.error = 'ERROR: no camera on this device';
        } else if (error.name === 'NotSupportedError') {
          this.error = 'ERROR: secure context required (HTTPS, localhost)';
        } else if (error.name === 'NotReadableError') {
          this.error = 'ERROR: is the camera already in use?';
        } else if (error.name === 'OverconstrainedError') {
          this.error = 'ERROR: installed cameras are not suitable';
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = 'ERROR: Stream API is not supported in this browser';
          this.noStreamApiSupport = true;
        }
      }
    },
    progressPdf(progress) {
      this.previewDialog.pdfProgress = Math.ceil(progress * 100);
    },
  },
  computed: {
    ...mapState('user', ['bookings', 'user', 'contracts']),
    isLoading() {
      return this.bookings.isLoading || this.user.isLoading;
    },
  },
  created() {
    this.getUser().then(() => {
      this.getBookings();
      this.getContracts();
    });
  },
};
</script>
