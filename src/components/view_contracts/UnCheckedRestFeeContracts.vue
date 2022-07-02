<template>
  <v-card>
    <v-toolbar color="#727cf5" dark class="font-nunito">
      <v-toolbar-title>Danh sách người thuê đóng tiền hoàn tất hợp đồng</v-toolbar-title>
    </v-toolbar>
    <v-dialog v-model="evidences.lighbox" max-width="600">
      <div
        class="d-flex justify-center align-center"
        style="overflow: scroll; background-color: white"
      >
        <v-img :src="evidences.currentImgUrl" contain max-height="400" max-width="300"></v-img>
      </div>
    </v-dialog>
    <v-dialog v-model="evidences.show" max-width="350">
      <div class="d-flex justify-center align-center">
        <v-card
          width="350"
          v-if="evidences.show && !evidences.showResult"
          :loading="contractsStore.isUpdating"
        >
          <v-toolbar color="#727cf5" dark class="font-nunito">
            <v-toolbar-title>Hình ảnh của biên lai chuyển tiền</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-3 font-nunito">
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold">Người thuê:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px">{{
                  evidences.contract.renter.username
                }}</span></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold">Khu trọ:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px">{{
                  evidences.contract.group.groupName
                }}</span></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold">Loại phòng:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px">{{ evidences.contract.type.title }}</span></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold">Phòng số:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px">{{ evidences.contract.room.roomName }}</span></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold"
                  >Tiền cọc giữ chỗ:</span
                ></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px"
                  >{{ evidences.contract.downPayment }} triệu đồng</span
                ></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold">Tổng tiền:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px"
                  >{{ evidences.row.totalPrice }} triệu đồng</span
                ></v-col
              >
            </v-row>
            <v-row>
              <v-col cols="5"
                ><span style="font-size: 18px" class="font-weight-bold"
                  >Số tiền còn lại cần phải trả:</span
                ></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px"
                  >{{ evidences.row.totalPrice - evidences.row.downPayment }} triệu
                  đồng</span
                ></v-col
              >
            </v-row>
            <v-row
              ><v-col cols="12"
                ><span style="font-size: 18px" class="font-weight-bold">Hình ảnh</span></v-col
              ></v-row
            >
            <div class="d-flex flex-row flex-wrap pt-3">
              <v-img
                contain
                v-for="url in evidences.imageUrls"
                @click="showImageLightBox(url)"
                :key="url"
                :src="url"
                width="64"
                height="64"
              />
            </div>
          </v-card-text>
          <v-card-text v-if="evidences.imageUrls.length === 0"> Không có hình ảnh </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="confirmInvalidReserved">Không hợp lệ</v-btn>
            <v-btn @click="confirmValidReserved" dark color="#727CF5">Hợp lệ</v-btn>
          </v-card-actions>
        </v-card>
        <v-card width="350" v-if="evidences.show && evidences.showResult">
          <v-card-title v-if="evidences.success">Xác nhận thành công</v-card-title>
          <v-card-title v-if="!evidences.success">Xác nhận thất bại</v-card-title>
        </v-card>
      </div>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="tableItems"
      :loading="contracts.isLoading"
      item-key="contractId"
      class="elevation-1 mt-3"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text color="amber" @click="showEvidences(item.contractId, item)">Kiểm tra</v-btn>
      </template>
    </v-data-table>
    <v-card-subtitle class="pt-3">
      <v-row>
        <v-col cols="1"><v-icon color="amber" left>warning</v-icon></v-col>
        <v-col cols="11"
          >Kiểm tra hết tất cả các yêu cầu xác nhận đóng tiền hoàn tất hợp đồng để có thể tiếp tục
          sử dụng ứng dụng.</v-col
        >
      </v-row>
    </v-card-subtitle>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import actions from '../../config/pushNotificationActions';

export default {
  name: 'UnCheckedRestFeeContracts',
  props: ['contracts'],
  data: () => ({
    headers: [
      {
        text: 'Người thuê',
        align: 'start',
        value: 'renterName',
        sortable: false,
      },
      { text: 'Khu trọ', value: 'groupName', sortable: false },
      { text: 'Phòng', value: 'roomName', sortable: false },
      { value: 'actions', sortable: false },
    ],
    search: '',
    evidences: {
      show: false,
      imageUrls: [],
      currentImgUrl: null,
      contract: {},
      lighbox: false,
      showResult: false,
      success: false,
      row: null,
    },
  }),
  computed: {
    ...mapState({
      contractsStore: (state) => state.user.contracts,
    }),
    tableItems() {
      return this.contracts.map((c) => {
        const price = c.deal ? c.deal.offeredPrice : c.type.price;
        let totalPrice = (c.type.deposit + 1) * price;
        totalPrice = totalPrice.toFixed(2);
        const obj = {
          renterName: c.renter.username,
          roomName: c.room.roomName,
          groupName: c.group.groupName,
          status: c.status,
          contractId: c.contractId,
          images: c.images,
          downPayment: c.downPayment,
          price,
          totalPrice,
          address: `${c.group.streetName}, ${c.group.wardName}, ${c.group.districtName}`,
        };
        return obj;
      });
    },
  },
  methods: {
    ...mapActions({
      updateContract: 'user/updateContract',
      activateContract: 'user/activateContract',
      sendNotification: 'user/sendNotification',
    }),
    confirmInvalidReserved() {
      const contract = this.evidences;
      contract.roomId = contract.room.roomId;
      contract.status = '';
      this.evidences.show = false;
    },
    confirmValidReserved() {
      this.evidences.showResult = false;
      this.evidences.success = false;
      const { contract } = this.evidences;
      contract.roomId = contract.room.roomId;
      contract.status = 'ACTIVATED';
      contract.paid = false;
      const price = contract.deal ? contract.deal.offeredPrice : contract.type.price;
      const totalPrice = ((contract.type.deposit + 1) * price).toFixed(2);
      const { contractId, qrCode } = contract;
      const payload = { contractId, qrCode, status: 'ACTIVATED' };
      this.activateContract(payload).then(() => {
        this.evidences.success = this.contractsStore.success;
        if (this.evidences.success) {
          const p = {
            title: `${contract.vendor.username} xác nhận đã nhận đủ số tiền theo hợp đồng`,
            body: `${(totalPrice - contract.type.downPayment).toFixed(2)} triệu đồng, phòng ${contract.room.roomName}`,
            action: actions.RESERVE_FEE_RECEIVED,
            id: contract.contractId,
            vendorId: null,
            renterId: contract.renter.userId,
            icon: contract.renter.avatar,
          };
          this.sendNotification(p);
        }
        this.evidences.show = false;
      });
    },
    showImageLightBox(url) {
      this.evidences.currentImgUrl = url;
      this.evidences.lighbox = true;
    },
    showEvidences(contractId, row) {
      const contract = this.contracts.find((c) => c.contractId === contractId);
      this.evidences.imageUrls = contract.images
        .filter((img) => img.type === 'REST_BILL')
        .filter((img) => !img.deleted)
        .map((img) => img.resourceUrl);
      this.evidences.show = true;
      this.evidences.contract = contract;
      this.evidences.row = row;
    },
  },
};
</script>
