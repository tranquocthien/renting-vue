<template>
  <div :class="isMobile ? 'pa-1' : 'pa-8'" height="100%" elevation="0" :loading="isServiceLoading">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Thêm dịch vụ</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="services"
                  label="Dịch vụ"
                  item-text="serviceName"
                  item-value="serviceId"
                  dense
                  hide-details
                  v-model="addNew.serviceId"
                  class="pa-1"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="addNew.price"
                  dense
                  hide-details
                  label="Giá tiền"
                  type="number"
                  class="pa-1"
                  suffix="nghìn đ"
                  solo
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="servicesBox.units"
                  label="Đơn vị"
                  dense
                  hide-details
                  v-model="addNew.userUnit"
                  class="pa-1"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="servicesBox.times"
                  label="Tần suất thanh toán"
                  dense
                  hide-details
                  v-model="addNew.timeUnit"
                  class="pa-1"
                  solo
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="dialog = false"> Hủy </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="
              dialog = false;
              addService();
            "
          >
            Tạo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <span class="text-muted pl-2 pt-10 font-weight-medium font-italic" v-if="check !== 1"
      >Chọn dịch vụ mà bạn sẽ tính tiền</span
    >
    <v-data-table
      :headers="servicesBox.headers"
      v-model="selects"
      :items="newServices"
      item-key="serviceId"
      show-select
      hide-default-footer
      locale="vi-VN"
      class="mt-2"
      :loading="isServiceLoading"
    >
      <template v-slot:header.data-table-select> </template>
      <template v-slot:item.data-table-select="{ item }">
        <v-simple-checkbox
          v-model="item.select"
          v-if="!item.required"
          color="#727CF5"
        ></v-simple-checkbox>
        <v-simple-checkbox
          v-model="item.select"
          v-if="item.required"
          disabled
          color="#727CF5"
        ></v-simple-checkbox>
      </template>
      <template v-slot:item.price="{ item }">
        <v-text-field
          :disabled="mode === 'view'"
          v-model="item.price"
          hide-details
          dense
          solo
          suffix="nghìn đồng"
        ></v-text-field>
      </template>
      <template v-slot:item.unit="{ item }">
        <v-select
          v-model="item.userUnit"
          menu-props="auto"
          label="Select"
          hide-details
          dense
          single-line
          :items="servicesBox.units"
        ></v-select>
      </template>
      <template v-slot:item.time="{ item }">
        <v-select
          v-model="item.timeUnit"
          menu-props="auto"
          label="Select"
          hide-details
          dense
          single-line
          :items="servicesBox.times"
        ></v-select>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn v-if="!select" @click="removeService(item)" icon>
          <v-icon>clear</v-icon>
        </v-btn>
        <div v-if="select">
          <span v-if="item.required"> bắt buộc </span>
        </div>
      </template>
    </v-data-table>
    <v-divider />
    <v-card v-if="select">
      <v-card-subtitle v-if="selects.length === 0"> Chưa có dịch vụ nào được chọn </v-card-subtitle>
      <v-card-subtitle v-if="selects.length != 0">
        <span class="font-weight-bold" style="color: #727cf5; font-size: 18px"
          >Những dịch vụ được chọn :
        </span>
        <span style="font-size: 16px">{{ selects.map((s) => s.serviceName).join(', ') }}</span>
      </v-card-subtitle>
    </v-card>
    <v-divider />
    <v-card class="pa-1 mt-2 hidden-sm-and-up" v-if="!select">
      <p class="text-h6 text-center pa-0 ma-2">Tạo mới dịch vụ</p>
      <div class="d-flex flex-column">
        <div class="d-flex flex-row flex-nowrap">
          <v-select
            :items="services"
            label="Dịch vụ"
            item-text="serviceName"
            item-value="serviceId"
            dense
            hide-details
            v-model="addNew.serviceId"
            class="pa-1"
            solo
          ></v-select>
          <v-text-field
            v-model="addNew.price"
            dense
            hide-details
            label="Giá tiền"
            type="number"
            class="pa-1"
            suffix="nghìn đ"
            solo
          />
        </div>
        <div class="d-flex flex-row flex-nowrap">
          <v-select
            :items="servicesBox.units"
            label="Đơn vị"
            dense
            hide-details
            v-model="addNew.userUnit"
            class="pa-1"
            solo
          ></v-select>
          <v-select
            :items="servicesBox.times"
            label="Tần suất thanh toán"
            dense
            hide-details
            v-model="addNew.timeUnit"
            class="pa-1"
            solo
          ></v-select>
        </div>
        <v-btn small color="primary" @click="addService" :disabled="!addable" class="mt-2">
          Tạo mới
        </v-btn>
      </div>
    </v-card>
    <v-snackbar
      v-model="snackBarMixin.show"
      :multi-line="snackBarMixin.multiLine"
      :timeout="snackBarMixin.timeout"
      :absolute="snackBarMixin.absolute"
      :color="snackBarMixin.color"
    >
      {{ snackBarMixin.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false"> Đóng </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import snackBarMixin from '../../mixins/snackBar';

export default {
  name: 'HostelGroupServiceEditor',
  props: ['groupService', 'create', 'update', 'select', 'mode', 'check'],
  mixins: [snackBarMixin],
  data: () => ({
    selects: [],
    dialog: false,
    servicesBox: {
      headers: [
        {
          text: 'Tên',
          align: 'start',
          sortable: false,
          value: 'serviceName',
        },
        { text: 'Giá (Nghìn đồng)', value: 'price', sortable: true },
        { text: 'Đơn vị', value: 'userUnit', sortable: false },
        { text: 'Tần suất thanh toán', value: 'timeUnit', sortable: false },
        { text: () => (this.select ? 'Chọn' : 'Xoá'), value: 'delete', sortable: false },
      ],
      units: ['m³', 'kWh', 'người', 'phòng', 'xe'],
      times: ['tuần', 'tháng', 'năm'],
    },
    addNew: {
      serviceName: '',
      serviceId: null,
      price: null,
      userUnit: '',
      timeUnit: '',
      priceUnit: 'Nghìn',
    },
    newServices: [],
  }),
  computed: {
    groupServiceDesserts() {
      return this.groupService.map((service) => ({
        serviceName: service.serviceName,
        price: service.price,
        timeUnit: service.timeUnit,
        userUnit: service.userUnit,
        serviceId: service.serviceId,
        select: service.required,
        groupServiceId: service.groupServiceId,
        active: service.active,
        required: service.required,
      }));
    },
    services() {
      return this.$store.state.renter.common.services.data;
    },
    serviceNames() {
      return this.services.map((item) => item.serviceName);
    },
    isServiceLoading() {
      return this.$store.state.renter.common.services.isLoading;
    },
    addable() {
      // eslint-disable-next-line
      const { serviceId, userUnit, timeUnit } = this.addNew;
      if (!serviceId || !userUnit || !timeUnit) {
        return false;
      }
      return true;
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
  methods: {
    ...mapActions({
      getAllFacilities: 'renter/common/getAllFacilities1',
      getAllServices: 'renter/common/getAllServices1',
    }),
    getService(serviceId) {
      return this.services.find((service) => service.serviceId === serviceId);
    },
    isDuplicateService(serviceId) {
      return this.newServices.findIndex((service) => service.serviceId === serviceId) > -1;
    },
    isNewServiceValid() {
      if (this.isDuplicateService(this.addNew.serviceId)) {
        this.showSnackBar('Dịch vụ bị trùng', { color: 'black' });
        return false;
      }
      // eslint-disable-next-line
      const { serviceId, price, userUnit, timeUnit } = this.addNew;
      if (!serviceId || !userUnit || !timeUnit) {
        this.showSnackBar('Vui lòng điền đầy đủ tất cả các trường', { color: 'black' });
        return false;
      }
      if (price < 0) {
        this.showSnackBar('Giá tiền phải là số dương', { color: 'black' });
        return false;
      }
      return true;
    },
    addService() {
      if (this.isNewServiceValid()) {
        this.addNew.serviceName = this.getService(this.addNew.serviceId).serviceName;
        this.newServices.push(this.addNew);
        this.resetAddNew();
      }
    },
    resetAddNew() {
      this.addNew = {
        serviceName: '',
        serviceId: null,
        price: null,
        timeUnit: '',
        userUnit: '',
        priceUnit: 'Nghìn',
        required: false,
      };
    },
    removeService(item) {
      const index = this.newServices.findIndex((i) => i === item);
      if (index > -1) {
        this.newServices = [
          ...this.newServices.slice(0, index),
          ...this.newServices.slice(index + 1),
        ];
      }
    },
  },
  created() {
    console.log('hostel group service editor is created');
    if (this.services.length === 0) {
      this.getAllServices();
    }
    if (this.update) {
      this.newServices = [...this.groupServiceDesserts];
    }
    if (this.select) {
      this.newServices = [...this.groupServiceDesserts];
      this.newServices = this.newServices.filter((service) => service.active);
      this.selects = this.newServices.filter((service) => service.required);
    }
    if (this.mode === 'view') {
      //
    }
  },
  watch: {
    newServices: {
      handler() {
        this.$emit('newValue', this.newServices);
        this.selects = this.newServices.filter((s) => s.select);
      },
      deep: true,
    },
    selects: {
      handler() {
        const selectedServiceIds = this.selects.map((s) => ({ groupServiceId: s.groupServiceId }));
        this.$emit('newSelects', selectedServiceIds);
      },
    },
  },
};
</script>
