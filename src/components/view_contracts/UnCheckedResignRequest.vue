<template>
  <v-card>
    <v-toolbar color="#727cf5" dark class="font-nunito">
      <v-toolbar-title>Danh sách người thuê yêu cầu gia hạn hợp đồng</v-toolbar-title>
    </v-toolbar>
    <v-dialog v-model="evidences.show" max-width="350">
      <div class="d-flex justify-center align-center">
        <v-card
          width="350"
          v-if="evidences.show && !evidences.showResult"
          :loading="contractsStore.isUpdating"
        >
          <v-toolbar color="#727cf5" dark class="font-nunito">
            <v-toolbar-title>Thông tin</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-3 font-nunito" v-if="evidences.contract">
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
                ><span style="font-size: 18px" class="font-weight-bold">Giá thuê:</span></v-col
              >
              <v-col cols="7"
                ><span style="font-size: 18px"
                  >{{ evidences.contract.type.price }} triệu đồng/tháng</span
                ></v-col
              >
            </v-row>
            <v-row>
              <v-col>
                <v-chip @click="pdf.show = true">Xem hợp đồng</v-chip>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="evidences.show = false">Đóng</v-btn>
            <v-btn @click="agreeResign" dark color="#727CF5">Gia hạn</v-btn>
            <v-btn @click="rejectResign" dark color="#727CF5">Từ chối gia hạn</v-btn>
          </v-card-actions>
        </v-card>
        <v-card width="350" v-if="evidences.show && evidences.showResult">
          <v-card-title v-if="evidences.success">Thao tác thành công</v-card-title>
          <v-card-title v-if="!evidences.success">Thao tác thất bại</v-card-title>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog v-model="pdf.show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card v-if="pdf.contract">
        <v-toolbar dark color="#727cf5">
          <v-btn icon dark @click="pdf.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Thông tin hợp đồng</v-toolbar-title>
        </v-toolbar>
        <div style="height: calc(100vh - 64px); overflow: hidden">
          <pdfDocument :url="pdf.contract.contractUrl" :scale="pdf.scale"> </pdfDocument>
        </div>
      </v-card>
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
        <v-btn text color="amber" @click="showPdfContract(item.contractId)">Chi tiết</v-btn>
      </template>
    </v-data-table>
    <v-card-subtitle class="pt-3">
      <v-row>
        <v-col cols="1"><v-icon color="amber" left>warning</v-icon></v-col>
        <v-col cols="11"
          >Kiểm tra hết tất cả các yêu cầu gia hạn hợp đồng để có thể tiếp tục sử dụng ứng
          dụng.</v-col
        >
      </v-row>
    </v-card-subtitle>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import actions from '../../config/pushNotificationActions';
import mobileMixin from '../mixins/mobile';

export default {
  name: 'UnCheckedRestFeeContracts',
  props: ['contracts'],
  mixins: [mobileMixin],
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
    pdf: {
      show: false,
      contract: null,
    },
    search: '',
    evidences: {
      show: false,
      contract: {},
      showResult: false,
      success: false,
    },
  }),
  computed: {
    ...mapState({
      contractsStore: (state) => state.user.contracts,
    }),
    scale() {
      if (this.isMobile) {
        return 2;
      }
      return 1;
    },
    tableItems() {
      return this.contracts.map((c) => ({
        renterName: c.renter.username,
        roomName: c.room.roomName,
        groupName: c.group.groupName,
        status: c.status,
        contractId: c.contractId,
        images: c.images,
        downPayment: c.downPayment,
        address: `${c.group.streetName}, ${c.group.wardName}, ${c.group.districtName}`,
      }));
    },
  },
  methods: {
    ...mapActions({
      updateContract: 'user/updateContract',
      activateContract: 'user/activateContract',
      sendNotification: 'user/sendNotification',
    }),
    agreeResign() {
      const { contractId } = this.evidences.contract;
      this.$router.push(`/vendor/contract?contractId=${contractId}&mode=resign`);
    },
    rejectResign() {
      const { contract } = this.evidences;
      contract.resign = 'REJECT';
      contract.roomId = contract.room.roomId;
      this.updateContract(contract).then(() => {
        const { success } = this.contracts;
        this.evidences.success = success;
        this.evidences.showResult = true;
        if (success) {
          this.sendNotification({
            title: `${contract.vendor.username} từ chối gia hạn hợp đồng`,
            body: `${contract.group.groupName}, ${contract.type.title}, ${contract.room.roomName}`,
            action: actions.UPDATE_CONTRACT,
            id: contract.contractId,
            icon: contract.vendor.avatar,
            vendorId: null,
            renterId: contract.renter.userId,
          });
        }
      });
    },
    showPdfContract(contractId) {
      this.pdf.contract = this.contracts.find((c) => c.contractId === contractId);
      this.evidences.show = true;
      this.evidences.contract = this.pdf.contract;
      this.evidences.showResult = false;
      this.evidences.success = null;
      // this.pdf.show = true;
    },
  },
};
</script>
