<template>
  <v-card class="mb-2 pa-4">
    <v-row>
      <v-row no-gutters class="d-flex">
        <v-col cols="12" md="2" class="d-flex align-center">
          <v-row class="ma-0">
            <v-col cols="3" class="hidden-sm-and-up">
              <span class="font-nunito text-primary size-sub-2">Chủ trọ: </span>
            </v-col>
            <v-col cols="9" md="12" class="d-flex">
              <v-avatar color="#727cf5" height="50px" min-width="50px" class="hidden-xs-only mr-2">
                <v-img
                  height="50px"
                  min-width="60px"
                  v-if="contract.vendor.avatar"
                  :src="contract.vendor.avatar"
                />
                <span class="text-overline white--text">{{
                  getAvatarTitle(contract.vendor.username)
                }}</span>
              </v-avatar>
              <span class="d-flex flex-column align-start">
                <span class="text-gray font-nunito size9rem font-weight-bold">{{
                  contract.vendor.username
                }}</span>
                <span class="text-muted size-sub-3 font-nunito">{{ contract.vendor.phone }}</span>
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3" class="d-flex flex-column">
          <v-row class="ma-0">
            <v-col cols="3" class="hidden-sm-and-up">
              <span class="font-nunito text-primary size-sub-2">Nhà trọ: </span>
            </v-col>
            <v-col cols="9" md="12" class="d-flex flex-column">
              <span class="text-gray font-nunito size9rem font-weight-bold">{{
                contract.group.groupName
              }}</span>
              <span class="font-nunito text-muted size-caption">
                {{ contract.group.buildingNo }} {{ contract.group.address.streetName }},
                {{ contract.group.address.wardName }}, {{ contract.group.address.districtName }},
                {{ contract.group.address.provinceName }}
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="1" class="d-flex flex-column">
          <v-row class="ma-0">
            <v-col cols="3" class="hidden-sm-and-up">
              <span class="font-nunito text-primary size-sub-2">Phòng:</span>
            </v-col>
            <v-col cols="9" md="12" class="d-flex justify-start justify-sm-center align-center">
              <span class="font-nunito text-primary size-sub-2">{{ contract.room.roomName }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2" class="d-flex justify-center align-center">
          <v-row class="ma-0">
            <v-col cols="3" class="hidden-sm-and-up">
              <span class="font-nunito text-primary size-sub-2">Bắt đầu: </span>
            </v-col>
            <v-col cols="9" md="12" class="d-flex justify-start justify-sm-center align-center">
              <span class="font-nunito text-gray size-sub-2">{{
                getDateByTimestamp(contract.startTime)
              }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2" class="d-flex justify-center align-center">
          <v-row class="ma-0">
            <v-col cols="3" class="hidden-sm-and-up">
              <span class="font-nunito text-primary size-sub-2">Kết thúc: </span>
            </v-col>
            <v-col cols="9" md="12" class="d-flex justify-start justify-sm-center align-center">
              <span class="font-nunito text-gray size-sub-2">{{
                getDateByTimestamp(getEndDate(contract.startTime, contract.duration))
              }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2" class="d-flex flex-column justify-center align-center">
          <v-chip color="red" v-if="isExpired">Hết hạn</v-chip>
          <v-dialog v-model="evidences.show" width="400">
            <v-card class="pa-2">
              <v-container>
                <ImageEditor :oldImages="notDeletedImgs" :mode="'view'" />
              </v-container>
            </v-card>
          </v-dialog>
          <v-chip v-if="contract.images.length > 0" @click="showEvidences">
            <v-icon>wallpaper</v-icon>
            Hình ảnh</v-chip
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="contract.status !== 'CANCELLED'">
          <v-stepper v-model="step" v-if="contract.reserved" class="elevation-0">
            <v-stepper-header class="elevation-0" v-if="step <= 4">
              <v-stepper-step :complete="step > 0" step="1" color="#727CF5">
                <span v-if="step <= 0">Hợp đồng được tạo</span>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 1" step="2" color="#727CF5">
                <span v-if="step <= 1">Đóng tiền cọc giữ chỗ</span>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 2" step="3" color="#727CF5">
                <span v-if="step <= 2">Chủ trọ đã nhận tiền</span>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 3" step="4" color="#727CF5">
                <span v-if="step <= 3">Thanh toán phần còn lại</span>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 4" step="5" color="#727CF5">
                <span v-if="step <= 4">Hợp đồng hoàn tất</span>
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items class="elevation-0">
              <v-stepper-content step="1" class="elevation-0">
                <div>
                  <v-row>
                    <v-col
                      cols="12"
                      class="d-flex justify-center font-weight-bold font-nunito"
                      style="font-size: 18px"
                      ><p class="hidden-sm-and-up">Hợp đồng được tạo</p></v-col
                    >
                    <v-col
                      cols="12"
                      class="d-flex justify-center font-nunito"
                      style="font-size: 18px"
                      ><p class="hidden-sm-and-down">
                        Bạn cần thanh toán tiền cọc giữ chân và gửi thông tin thanh toán để chủ nhà
                        xác nhận
                      </p></v-col
                    >
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-timeline align-top dense>
                        <v-timeline-item color="#727CF5" small v-if="!signable && !payableReserve">
                          Hết hạn ký và thanh toán tiền giữ chỗ.
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="signable">
                          <v-chip @click="$emit('activate', contract.contractId)"
                            >Ký hợp đồng</v-chip
                          >
                          trước {{ lastSignDate.split(',')[0].slice(0, -3) }} giờ, ngày
                          {{ lastSignDate.split(',')[1] }}
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          Đã ký vào lúc {{ new Date(contract.lastPayAt).toLocaleString('vi') }}
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          <div>
                            Thanh toán tiền cọc giữ chỗ cho chủ trọ {{ contract.downPayment }}
                            triệu đồng,
                            {{
                              contract.lastPayAt
                                ? ` trước ${lastPayDate.split(',')[0].slice(0, -3)} giờ, ngày ${
                                    lastPayDate.split(',')[1]
                                  }`
                                : ''
                            }}
                            <v-card-subtitle class="pt-0 pb-0 hidden-sm-and-down">
                              Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán
                              trực tuyến.<br />
                              Hỗ trợ thanh toán bằng
                              <v-btn :href="getPayReservedUrl" target="_blank" rounded text>
                                <v-img
                                  height="30px"
                                  width="30px"
                                  src="../../assets/logo-momo.png"
                                ></v-img>
                              </v-btn>
                            </v-card-subtitle>
                            <v-card-text class="pt-0 pb-0 hidden-sm-and-up">
                              * Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán
                              trực tuyến.<br />
                              * Hỗ trợ thanh toán bằng
                              <!-- <v-btn @click="$emit('momo-payment', getParamForUrl)" rounded text> -->
                              <v-btn :href="getPayReservedUrl" rounded text>
                                <v-img
                                  height="30px"
                                  width="30px"
                                  src="../../assets/logo-momo.png"
                                ></v-img>
                                <!-- <v-card-subtitle class="pl-1 pr-0">Bạn phải có tài khoản MoMo</v-card-subtitle> -->
                              </v-btn>
                            </v-card-text>
                          </div>
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          <div>
                            Yêu cầu chủ nhà xác nhận tiền cọc giữ chỗ :
                            <!-- <v-chip
                              @click="$emit('pay-reserve-fee', contract.contractId)"
                              color="#727CF5"
                              class="ml-2"
                              dark
                              >Yêu cầu xác nhận</v-chip
                            > -->
                            <v-chip
                              @click="$emit('show-pay-reserve-fee', contract.contractId)"
                              color="#727CF5"
                              class="ml-2"
                              dark
                              >Yêu cầu xác nhận</v-chip
                            >
                          </div>
                        </v-timeline-item>
                      </v-timeline>
                    </v-col>
                  </v-row>
                </div>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-center font-weight-bold font-nunito"
                    style="font-size: 18px"
                    ><p class="hidden-sm-and-up">Đã đóng tiền giữ chỗ</p></v-col
                  >
                  <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
                    Yêu cầu xác nhận tiền của bạn đã được gửi tới chủ nhà. Hãy đợi cho tới khi chủ
                    nhà xác nhận.
                  </v-col>
                  <v-col>
                    <v-btn @click="changeMode">
                      {{ imageEditorMode === 'view' ? 'Cập nhật' : 'Hoàn tất' }}
                    </v-btn>
                    <ImageEditor
                      :mode="imageEditorMode"
                      @newValues="updateEvidence"
                      :oldImages="reservedBills"
                    />
                  </v-col>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-center font-weight-bold font-nunito"
                    style="font-size: 18px"
                    ><p class="hidden-sm-and-up">Chủ trọ đã nhận tiền cọc</p></v-col
                  >
                  <v-col>
                    <v-timeline align-top dense>
                      <v-timeline-item color="#727CF5" small>
                        <div>
                          Bạn hoàn tất việc đóng tiền cọc giữ chỗ. Thanh toán phần tiền còn lại cho
                          chủ trọ: {{ (totalPrice - contract.downPayment).toFixed(2) }} triệu đồng,
                          {{
                            contract.lastPayAt
                              ? ` trước ${lastPayDate.split(',')[0].slice(0, -3)} giờ, ngày ${
                                  lastPayDate.split(',')[1]
                                }`
                              : ''
                          }}
                          <v-card-subtitle class="pt-0 pb-0 hidden-sm-and-down">
                            Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán trực
                            tuyến.<br />
                            Hỗ trợ thanh toán bằng
                            <v-btn :href="getPayTheRestUrl" target="_blank" rounded text>
                              <v-img
                                height="30px"
                                width="30px"
                                src="../../assets/logo-momo.png"
                              ></v-img>
                            </v-btn>
                          </v-card-subtitle>
                          <v-card-text class="pt-0 pb-0 hidden-sm-and-up">
                            * Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán
                            trực tuyến.<br />
                            * Hỗ trợ thanh toán bằng
                            <!-- <v-btn @click="$emit('momo-payment', getParamForUrl)" rounded text> -->
                            <v-btn :href="getPayTheRestUrl" rounded text>
                              <v-img
                                height="30px"
                                width="30px"
                                src="../../assets/logo-momo.png"
                              ></v-img>
                              <!-- <v-card-subtitle class="pl-1 pr-0">Bạn phải có tài khoản MoMo</v-card-subtitle> -->
                            </v-btn>
                          </v-card-text>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item color="#727CF5" small>
                        <div>
                          Yêu cầu chủ nhà xác nhận tiền cọc giữ chỗ :
                          <v-chip @click="$emit('paid-rest', contract.contractId)"
                            >nhấn vào đây</v-chip
                          >
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-col>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="4">
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-center font-weight-bold font-nunito"
                    style="font-size: 18px"
                    ><p class="hidden-sm-and-up">Đóng phần tiền còn lại</p></v-col
                  >
                  <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
                    Bạn đã thanh toán đầy đủ tiền, hãy chờ chủ trọ xác nhận đã nhận tiền để hợp đồng
                    có hiệu lực.
                  </v-col>
                  <v-col>
                    <v-btn @click="changeMode">
                      {{ imageEditorMode === 'view' ? 'Cập nhật' : 'Hoàn tất' }}
                    </v-btn>
                    <ImageEditor
                      :mode="imageEditorMode"
                      :oldImages="restBills"
                      @newValues="updateEvidence"
                    />
                  </v-col>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="5">
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-center font-weight-bold font-nunito"
                    style="font-size: 18px"
                    ><p class="hidden-sm-and-up">Hợp đồng có hiệu lực</p></v-col
                  >
                  <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
                    <v-chip @click="$emit('view-detail', contract.contractId)" color="#727CF5" dark>
                      xem chi tiết hợp đồng</v-chip
                    >
                    <v-chip
                      v-if="resignable"
                      @click="$emit('resign', contract.contractId)"
                      color="#727CF5"
                      dark
                    >
                      Gia hạn hợp đồng</v-chip
                    >
                    <v-chip v-if="contract.resign === 'REJECT'"> Từ chối gia hạn </v-chip>
                    <v-chip v-if="contract.resign === 'AGREE'"> Đã gia hạn </v-chip>
                    <v-chip v-if="contract.resign === 'REQUEST'"> Đang chờ trả lời </v-chip>
                    <v-spacer />
                  </v-col>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-stepper v-model="step" v-if="!contract.reserved" class="elevation-0">
            <v-stepper-header v-if="step < 3">
              <v-stepper-step :complete="step > 0" step="1" color="#727CF5">
                Hợp đồng được tạo
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 1" step="2" color="#727CF5">
                Thanh toán tiền
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 2" step="3" color="#727CF5">
                Hợp đồng có hiệu lực
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items class="elevation-0">
              <v-stepper-content step="1">
                <div class="d-flex justify-center">
                  <v-row>
                    <v-col
                      cols="12"
                      class="d-flex justify-center font-weight-bold font-nunito"
                      style="font-size: 18px"
                      ><p class="hidden-sm-and-up">Hợp đồng được tạo</p></v-col
                    >
                    <v-col
                      cols="12"
                      class="d-flex justify-center font-nunito"
                      style="font-size: 18px"
                      ><p class="hidden-sm-and-down">
                        Bạn cần thanh toán tiền và gửi thông tin thanh toán để chủ nhà xác nhận
                      </p></v-col
                    >
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-timeline align-top dense>
                        <v-timeline-item color="#727CF5" small v-if="!signable && !payableReserve">
                          Hết hạn ký và thanh toán tiền.
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="signable">
                          <v-chip @click="$emit('activate', contract.contractId)"
                            >Ký hợp đồng</v-chip
                          >
                          trước {{ lastSignDate.split(',')[0].slice(0, -3) }} giờ, ngày
                          {{ lastSignDate.split(',')[1] }}
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          Đã ký vào lúc {{ new Date(contract.lastPayAt).toLocaleString('vi') }}
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          <div>
                            Thanh toán tiền toàn bộ cho chủ trọ {{ totalPrice }}
                            triệu đồng,
                            {{
                              contract.lastPayAt
                                ? ` trước ${lastPayDate.split(',')[0].slice(0, -3)} giờ, ngày ${
                                    lastPayDate.split(',')[1]
                                  }`
                                : ''
                            }}
                            <v-card-subtitle class="pt-0 pb-0 hidden-sm-and-down">
                              Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán
                              trực tuyến.<br />
                              Hỗ trợ thanh toán bằng
                              <v-btn :href="getPayTotalUrl" target="_blank" rounded text>
                                <v-img
                                  height="30px"
                                  width="30px"
                                  src="../../assets/logo-momo.png"
                                ></v-img>
                              </v-btn>
                            </v-card-subtitle>
                            <v-card-text class="pt-0 pb-0 hidden-sm-and-up">
                              * Thanh toán bằng tiền mặt, chuyển khoản và các hình thức thanh toán
                              trực tuyến.<br />
                              * Hỗ trợ thanh toán bằng
                              <!-- <v-btn @click="$emit('momo-payment', getParamForUrl)" rounded text> -->
                              <v-btn :href="getPayTotalUrl" rounded text>
                                <v-img
                                  height="30px"
                                  width="30px"
                                  src="../../assets/logo-momo.png"
                                ></v-img>
                                <!-- <v-card-subtitle class="pl-1 pr-0">Bạn phải có tài khoản MoMo</v-card-subtitle> -->
                              </v-btn>
                            </v-card-text>
                          </div>
                        </v-timeline-item>
                        <v-timeline-item color="#727CF5" small v-if="payableReserve">
                          <div>
                            Yêu cầu chủ nhà xác nhận tiền cọc giữ chỗ :
                            <!-- <v-chip
                              @click="$emit('pay-reserve-fee', contract.contractId)"
                              color="#727CF5"
                              class="ml-2"
                              dark
                              >Yêu cầu xác nhận</v-chip
                            > -->
                            <v-chip
                              v-if="payableReserve"
                              @click="$emit('show-pay-reserve-fee', contract.contractId)"
                              color="#727CF5"
                              class="ml-2"
                              dark
                              >Yêu cầu xác nhận</v-chip
                            >
                          </div>
                        </v-timeline-item>
                      </v-timeline>
                    </v-col>
                  </v-row>
                </div>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-row>
                  <v-col
                    cols="12"
                    class="d-flex justify-center font-weight-bold font-nunito"
                    style="font-size: 18px"
                    ><p class="hidden-sm-and-up">Thanh toán tiền</p></v-col
                  >
                  <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
                    Thông tin thanh toán đã được gửi tới chủ trọ, hãy đợi đến khi chủ trọ xác nhận
                    đã nhận được tiền.
                  </v-col>
                  <v-col>
                    <v-btn @click="changeMode">
                      {{ imageEditorMode === 'view' ? 'Cập nhật' : 'Hoàn tất' }}
                    </v-btn>
                    <ImageEditor
                      :mode="imageEditorMode"
                      @newValues="updateEvidence"
                      :oldImages="restBills"
                    />
                  </v-col>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-row>
                  <v-col cols="12" class="d-flex justify-center pb-0 pt-0">
                    <v-chip @click="$emit('view-detail', contract.contractId)" color="#727CF5" dark>
                      xem chi tiết hợp đồng</v-chip
                    >
                    <v-chip
                      v-if="resignable"
                      @click="$emit('resign', contract.contractId)"
                      color="#727CF5"
                      dark
                    >
                      Gia hạn hợp đồng</v-chip
                    >
                    <v-chip v-if="contract.resign === 'REJECT'"> Từ chối gia hạn </v-chip>
                    <v-chip v-if="contract.resign === 'AGREE'"> Đã gia hạn </v-chip>
                    <v-chip v-if="contract.resign === 'REQUEST'"> Đang chờ trả lời </v-chip>
                    <v-spacer />
                  </v-col>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
        <v-col v-if="contract.status === 'CANCELLED'">
          <v-row>
            <v-col>
              <p>
                Hợp đồng đã bị hủy bởi chủ trọ
                <v-chip
                  v-if="contract.contractUrl"
                  @click="$emit('view-detail', contract.contractId)"
                  color="#727CF5"
                  dark
                >
                  xem chi tiết hợp đồng</v-chip
                >
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
  </v-card>
</template>
<style scoped></style>
<script>
import { mapActions } from 'vuex';
import ImageEditor from '../vendor/hostel_management/ImageEditor.vue';
import actions from '../../config/pushNotificationActions';

export default {
  name: 'ContractItem',
  props: ['contract'],
  components: { ImageEditor },
  data: () => ({
    evidences: {
      show: false,
      images: [],
    },
    dialog: false,
    mapDialog: false,
    imageEditorMode: 'view',
  }),
  computed: {
    lastSignDate() {
      const date = new Date(this.contract.createdAt);
      date.setDate(date.getDate() + 3);
      return date.toLocaleString('vi');
    },
    lastPayDate() {
      const date = new Date(this.contract.lastPayAt);
      date.setDate(date.getDate() + 5);
      return new Date(date).toLocaleString('vi');
    },
    price() {
      if (this.contract.deal) {
        return this.contract.deal.offeredPrice;
      }
      return this.contract.type.price;
    },
    restBills() {
      return this.contract.images.filter((c) => c.type === 'REST_BILL').filter((c) => !c.deleted);
    },
    reservedBills() {
      return this.contract.images
        .filter((c) => c.type === 'RESERVED_BILL')
        .filter((c) => !c.deleted);
    },
    papers() {
      return this.contract.images.filter((c) => c.type === 'PAPER').filter((c) => !c.deleted);
    },
    totalPrice() {
      const t = (this.contract.type.deposit + 1) * this.price;
      return t.toFixed(2);
    },
    resignable() {
      console.log('called');
      // eslint-disable-next-line
      const { status, resign, startTime, duration } = this.contract;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      const endTime = this.getEndDate(startTime, duration);
      const now = Date.now();
      const diff = endTime - now;
      console.log({ endTime, now, oneMonth });
      console.log(diff - oneMonth);
      if (status === 'ACTIVATED' && diff > 0 && !resign && diff < oneMonth) {
        return true;
      }
      return false;
    },
    signable() {
      const curr = new Date().getTime();
      let boundary = new Date(this.contract.createdAt);
      boundary = boundary.setDate(boundary.getDate() + 3);
      console.log(boundary);
      if (curr < boundary && this.contract.status === 'INACTIVE') {
        return true;
      }
      return false;
    },
    isExpired() {
      const { startTime, duration } = this.contract;
      const endTime = this.getEndDate(startTime, duration);
      const now = Date.now();
      const diff = endTime - now;
      return diff < 0;
    },
    contractSignable() {
      if (this.contract.reserved) {
        if (this.contract.status === 'RESERVED') {
          return true;
        }
        return false;
      }
      if (!this.contract.reserved) {
        if (this.contract.status === 'INACTIVE') {
          return true;
        }
        return false;
      }
      return false;
    },
    step() {
      if (this.contract.reserved) {
        if (this.contract.status === 'INACTIVE') {
          return 1;
        }
        if (this.contract.status === 'ACCEPTED') {
          if (this.contract.paid === false) {
            return 1;
          }
          if (this.contract.paid === true) {
            return 2;
          }
        }
        if (this.contract.status === 'RESERVED') {
          if (this.contract.paid === false) {
            return 3;
          }
          return 4;
        }
        if (this.contract.status === 'ACTIVATED') {
          return 5;
        }
      }
      if (!this.contract.reserved) {
        if (this.contract.status === 'INACTIVE') {
          return 1;
        }
        if (this.contract.status === 'ACCEPTED') {
          if (this.contract.paid === false) {
            return 1;
          }
          if (this.contract.paid === true) {
            return 2;
          }
        }
        if (this.contract.status === 'ACTIVATED') {
          return 3;
        }
      }
      if (this.contract.status === 'EXPIRED') {
        return 5;
      }
      return null;
    },
    timestamp() {
      return new Date(this.booking.meetTime);
    },
    group() {
      return this.booking.group;
    },
    ward() {
      const { streetId } = this.group.street;
      const res = this.$store.getters['renter/common/getWardByStreetId'](streetId);
      return res;
    },
    district() {
      const { wardId } = this.ward;
      return this.$store.getters['renter/common/getDistrictByWardId'](wardId);
    },
    province() {
      const { districtId } = this.district;
      return this.$store.getters['renter/common/getProvinceByDistrictId'](districtId);
    },
    getPayReservedUrl() {
      const { downPayment } = this.contract;
      const money = downPayment * 1000000;
      let url = null;
      const { phone } = this.contract.vendor;
      url = `https://nhantien.momo.vn/${phone}/${money}`;
      return url;
    },
    getPayTheRestUrl() {
      const { downPayment } = this.contract;
      const money = (this.totalPrice - downPayment) * 1000000;
      let url = null;
      const { phone } = this.contract.vendor;
      url = `https://nhantien.momo.vn/${phone}/${money}`;
      return url;
    },
    getPayTotalUrl() {
      const money = this.totalPrice * 1000000;
      let url = null;
      const { phone } = this.contract.vendor;
      url = `https://nhantien.momo.vn/${phone}/${money}`;
      return url;
    },
    imageType() {
      if (this.contract.reserved && this.contract.status === 'ACCEPTED') {
        return 'RESERVED_BILL';
      }
      return 'REST_BILL';
    },
    payableReserve() {
      const curr = new Date().getTime();
      let boundary = new Date(this.contract.lastPayAt);
      boundary = boundary.setDate(boundary.getDate() + 3);
      const { status, paid } = this.contract;
      if (status === 'ACCEPTED' && paid === false && curr < boundary) {
        return true;
      }
      return false;
    },
    notDeletedImgs() {
      return this.contract.images.filter((img) => !img.deleted);
    },
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
      getUserByIds: 'vendor/overview/getUserByIds',
      updateContract: 'user/updateContract',
      sendNotification: 'user/sendNotification',
    }),
    showEvidences() {
      this.evidences.show = true;
    },
    changeMode() {
      if (this.imageEditorMode === 'view') {
        this.imageEditorMode = 'edit';
      } else {
        this.imageEditorMode = 'view';
      }
    },
    updateEvidence(newImages) {
      console.log(newImages);
      this.contract.roomId = this.contract.room.roomId;
      this.contract.paid = true;
      const images = newImages.map((image) => ({
        resourceUrl: image.resourceUrl,
        type: this.imageType,
      }));
      let theRest;
      if (this.imageType === 'REST_BILL') {
        theRest = this.reservedBills.map((image) => ({
          resourceUrl: image.resourceUrl,
          type: 'RESERVED_BILL',
        }));
      } else if (this.imageType === 'RESERVED_BILL') {
        theRest = this.restBills.map((image) => ({
          resourceUrl: image.resourceUrl,
          type: 'REST_BILL',
        }));
      }
      const papers = this.papers.map((image) => ({
        resourceUrl: image.resourceUrl,
        type: 'PAPER',
      }));
      this.contract.images = [...papers, ...theRest, ...images];
      const { contractId } = this.contract;
      this.updateContract(this.contract).then(() => {
        const { success } = this.contracts;
        this.payReserveFee.success = success;
        this.payReserveFee.showResult = true;
        if (success) {
          this.signAndPay.step += 1;
          const payload = {
            title: `${this.contract.renter.username}`,
            body: `Cập nhật thông tin về giao dịch thanh toán cho phòng ${this.contract.room.roomName}`,
            action: actions.RESERVE_FEE_PAID,
            id: this.contract.contractId,
            vendorId: this.contract.vendor.userId,
            renterId: null,
            icon: this.contract.renter.avatar,
          };
          this.sendNotification(payload);
          this.contractOverlay.contract = this.contracts.data.find(
            (c) => c.contractId === contractId,
          );
        }
      });
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
    getStatus(status, paid) {
      let contractStatus = '';
      let color = 'red';
      switch (status) {
        case 'REVERSED':
          contractStatus = 'Đặt cọc giữ chỗ thành công';
          color = 'rgba(255,188,0,.25)';
          break;
        case 'ACTIVATED':
          contractStatus = 'đang thuê';
          color = 'rgba(57,175,209,.25)';
          break;
        case 'INACTIVE':
          contractStatus = 'Chưa đóng tiền cọc giữ chỗ';
          color = 'rgba(10,207,151,.25)';
          if (paid) {
            contractStatus = 'Đang chờ chủ trọ xác nhận';
          }
          break;
        case 'EXPIRED':
          contractStatus = 'hết hiệu lực';
          color = 'rgba(250,92,124,.25)';
          break;
        default:
          break;
      }
      return { contractStatus, color };
    },
    getColor() {
      return '#f1f3fa';
    },
  },
  created() {
    this.getProvinces();
  },
};
</script>
<style scoped>
.group-name {
  color: #6c757d !important;
  font-weight: 600 !important;
  font-size: 0.9rem;
  text-align: center;
  background-color: #f0f4f9;
  border-radius: 2rem !important;
}
.group-name:hover {
  color: #fff !important;
  background-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  cursor: pointer;
}
.type-name {
  color: #727cf5 !important;
}
.type-name:hover {
  color: #4250f2 !important;
  cursor: pointer;
}
.address {
  color: #6c757d !important;
}
.address:hover {
  color: #33cc33 !important;
  cursor: pointer;
}
.v-list-item__title {
  color: #6c757d;
  font-family: 'Nunito', sans-serif !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
}
.v-menu__content {
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #e4eaf2 !important;
  border-radius: 0.25rem !important;
  color: #6c757d !important;
}
.item-menu:hover {
  background-color: #f8f9fa;
}
.item-hover:hover {
  color: #272e37 !important;
}
.dialog-title {
  font-weight: 700 !important;
}
.title-content {
  font-size: 0.9rem !important;
}
</style>
