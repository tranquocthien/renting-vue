<template>
  <v-row class="ma-0 d-flex flex-column">
    <div>
      <v-btn
        class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start ml-auto"
        style="letter-spacing: 0.01rem !important"
        @click="dialog.addGroupService = true"
        ><v-icon small class="mr-1">mdi-cash-plus</v-icon>Thêm dịch vụ mới</v-btn
      >
    </div>
    <v-dialog
      v-model="dialog.addGroupService"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="d-flex flex-column" _v-if="!isLoading">
        <div
          class="d-flex px-4 py-3 align-center ma-0"
          style="height: 50px; box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15)"
        >
          <v-btn icon @click="dialog.addGroupService = false"
            ><v-icon size="20" color="#727cf5">close</v-icon></v-btn
          >
          <span
            class="ma-auto font-nunito text-primary font-weight-bold"
            style="font-size: 1.125rem !important"
            >Thêm dịch vụ mới
          </span>
        </div>
        <v-card-text class="d-flex pa-0 px-2">
          <v-row class="ma-0">
            <v-col cols="4" class="d-flex flex-column justify-center">
              <span class="font-nunito sizerem text-gray-dark font-weight-medium"
                >Loại dịch vụ<span class="red--text ml-1">(*)</span></span
              >
            </v-col>
            <v-col cols="8" class="d-flex flex-column justify-center">
              <v-text-field
                label="Tên dịch vụ"
                v-model="searchQuery"
                solo
                hide-details
                prepend-inner-icon="search"
                class="text-muted size-sub-2 light-text-field-small font-nunito"
                clearable
                rounded
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex flex-column">
              <v-card
                max-height="270"
                v-if="allServices.length > 0"
                class="overflow-y-auto d-flex flex-column"
                style="box-shadow: none !important"
              >
                <v-row class="ma-0">
                  <v-col
                    cols="3"
                    v-for="item in allServices"
                    :key="item.serviceId"
                    class="d-flex flex-column pa-2"
                  >
                    <div
                      style="
                        border-radius: 0.25rem;
                        border: 1px solid rgba(152, 166, 173, 0.7);
                        height: 100%;
                        min-height: 50px;
                      "
                      v-bind:style="
                        item.serviceId === serviceSelected
                          ? 'background-color: #727cf5;'
                          : 'background-color: #fff;'
                      "
                      class="d-flex justify-center align-center px-2 cursor"
                      @click="selectService(item)"
                    >
                      <span
                        class="font-nunito size-caption"
                        style="text-align: center"
                        v-bind:style="
                          item.serviceId === serviceSelected ? 'color: #fff;' : 'color: #343a40;'
                        "
                      >
                        {{ upperCaseFirstCharacter(item.serviceName) }}</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" class="d-flex flex-column justify-center">
              <span
                class="font-nunito sizerem text-gray-dark font-weight-medium"
                v-if="userUnitSuggested"
                >Giá tiền<span class="red--text ml-1">(*)</span></span
              >
              <span class="font-nunito sizerem text-gray-dark font-weight-medium" v-else
                >Giá tiền: <span class="text-primary ml-1">{{ priceSuggestion }}</span></span
              >
            </v-col>
            <v-col cols="11" class="pr-0 d-flex pb-0">
              <v-text-field
                v-model="addNew.price"
                dense
                label="Giá tiền"
                class="py-1 form size9rem font-nunito addnew-service"
                solo
                step="10000"
                min="0"
                _:rules="[rules.min(addNew.price)]"
                v-if="userUnitSuggested"
                style="width: 60%"
                @input="inputDownPayment()"
              />
              <v-text-field
                v-model="addNew.userUnit"
                dense
                class="py-1 size9rem font-nunito userUnit-textfield"
                filled
                prefix="VNĐ/"
                v-if="userUnitSuggested && userUnitSuggested === 'VNĐ/Phòng'"
                append-icon="mdi mdi-pencil"
                style="width: 40%"
              />
              <span
                v-if="userUnitSuggested && userUnitSuggested !== 'VNĐ/Phòng'"
                class="my-1 mx-0 px-2 d-flex align-center"
                style="
                  background-color: rgba(57, 175, 209, 0.25) !important;
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                  color: #39afd1 !important;
                  height: 38px;
                "
              >
                <span class="font-nunito size9rem">{{ userUnitSuggested }}</span>
              </span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center mt-auto">
          <v-btn class="btn btn-primary font-nunito" width="90%" @click="addNewService()">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ServiceManagementMobile',
  data: () => ({
    dialog: {
      addGroupService: false,
    },
    serviceSelected: 0,
    searchQuery: '',
    addNew: {
      serviceId: 0,
      price: null,
      priceSuggestion: null,
      userUnit: 'phòng',
      timeUnit: '1 tháng',
      serviceName: null,
      isRequired: false,
    },
    userUnitSuggested: 'VNĐ/Phòng',
    priceSuggestion: null,
  }),
  methods: {
    ...mapActions({
      getAllServices: 'renter/common/getAllServices1',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    selectService(item) {
      this.serviceSelected = item.serviceId;
      this.initUserUnit(item.serviceName);
    },
    inputDownPayment() {
      this.addNew.price = this.formatCurency(this.addNew.price.replaceAll('.', ''));
    },
    formatCurency(price) {
      const format = price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return format;
    },
    initUserUnit(serviceName) {
      //   if (this.serviceSelected) {
      switch (serviceName.toLowerCase()) {
        case 'điện cố định theo đồng hồ':
          this.userUnitSuggested = 'VNĐ/Kwh';
          this.addNew.userUnit = 'kwh';
          this.addNew.priceSuggestion = null;
          // this.addNew.priceSuggestion = '';
          break;
        case 'điện cố định theo người':
          this.userUnitSuggested = 'VNĐ/Người';
          this.addNew.userUnit = 'người';
          this.addNew.priceSuggestion = null;
          // this.addNew.priceSuggestion = '';
          break;
        case 'điện lũy tiến':
          this.userUnitSuggested = null;
          this.priceSuggestion = 'Giá bậc thang';
          this.addNew.price = null;
          this.addNew.priceSuggestion = this.priceSuggestion;
          this.addNew.userUnit = 'phòng';
          break;
        case 'điện biến động':
          this.userUnitSuggested = null;
          this.priceSuggestion = 'Giá không cố định';
          this.addNew.price = null;
          this.addNew.priceSuggestion = this.priceSuggestion;
          this.addNew.userUnit = 'phòng';
          break;
        case 'nước lũy tiến':
          this.userUnitSuggested = null;
          this.priceSuggestion = 'Giá bậc thang';
          this.addNew.price = null;
          this.addNew.priceSuggestion = this.priceSuggestion;
          this.addNew.userUnit = 'phòng';
          break;
        case 'nước cố định theo người':
          this.userUnitSuggested = 'VNĐ/Người';
          this.addNew.userUnit = 'người';
          this.addNew.priceSuggestion = null;
          break;
        case 'nước cố định theo đồng hồ':
          this.userUnitSuggested = 'VNĐ/Khối';
          this.addNew.userUnit = 'khối';
          this.addNew.priceSuggestion = null;
          break;
        case 'nước biến động':
          this.userUnitSuggested = null;
          this.priceSuggestion = 'Giá không cố định';
          this.addNew.price = null;
          this.addNew.priceSuggestion = this.priceSuggestion;
          this.addNew.userUnit = 'phòng';
          break;
        case 'gửi xe':
          this.userUnitSuggested = 'VNĐ/Chiếc';
          this.addNew.userUnit = 'chiếc';
          this.addNew.priceSuggestion = null;
          break;
        default:
          this.userUnitSuggested = 'VNĐ/Phòng';
          this.addNew.userUnit = 'phòng';
          this.addNew.priceSuggestion = null;
          break;
      }
      //   } else {
      //     this.addNew.serviceId = 0;
      //   }
    },
    checkDuplicateService() {
      if (!this.otherService.checkbox) {
        if (this.addNew.serviceId) {
          const { serviceName } = this.allServices.find(
            (service) => service.serviceId === Number(this.addNew.serviceId),
          );
          if (
            serviceName.includes('điện') &&
            this.newGroup.services.filter((item) => item.serviceName.includes('điện')).length > 0
          ) {
            this.duplicateMsg = 'Bạn không thể tạo 2 loại dịch vụ về điện';
          }
          if (
            serviceName.includes('nước') &&
            this.newGroup.services.filter((item) => item.serviceName.includes('nước')).length > 0
          ) {
            this.duplicateMsg = 'Bạn không thể tạo 2 loại dịch vụ về nước';
          }
          if (
            !serviceName.includes('nước') &&
            !serviceName.includes('điện') &&
            this.newGroup.services.filter((item) => item.serviceName.includes(serviceName)).length >
              0
          ) {
            this.duplicateMsg = `Bạn không thể tạo 2 loại dịch vụ "${serviceName}"`;
          }
        }
      } else if (
        this.newGroup.services.filter(
          (item) => item.serviceName.includes(this.otherService.serviceName), // eslint-disable-line
        ).length > 0
      ) {
        this.duplicateMsg = `Bạn không thể tạo 2 loại dịch vụ "${this.otherService.serviceName}"`;
      } else {
        this.duplicateMsg = '';
      }
    },
    validate() {
      this.message = '';
      if (!this.otherService.checkbox) {
        if (this.addNew.serviceId === 0) {
          this.message += 'Vui lòng nhập thông tin (loại dịch vụ';
        }
        if (!this.addNew.price && !this.addNew.priceSuggestion) {
          this.message += this.message === '' ? 'Vui lòng nhập thông tin (giá' : ', giá';
        }
        if (this.addNew.userUnit.trim() === '') {
          this.message +=
            this.message === ''
              ? 'Vui lòng nhập thông tin (đơn vị tính tiền' // eslint-disable-line
              : ', đơn vị tính tiền'; // eslint-disable-line
        }
        if (this.addNew.timeUnit === '') {
          this.message +=
            this.message === ''
              ? 'Vui lòng nhập thông tin (tần suất thanh toán' // eslint-disable-line
              : ', tần suất thanh toán'; // eslint-disable-line
        }
        if (this.message !== '') {
          this.message += ')';
        }
      } else {
        if (this.otherService.serviceName.trim() === '') {
          this.message += 'Vui lòng nhập thông tin (tên dịch vụ';
        }
        if (
          !this.otherService.price &&
          !this.otherService.isDynamicPrice &&
          !this.otherService.isProgressivePrice
        ) {
          this.message += this.message === '' ? 'Vui lòng nhập thông tin (giá' : ', giá';
        }
        if (this.otherService.userUnit.trim() === '') {
          this.message +=
            this.message === ''
              ? 'Vui lòng nhập thông tin (đơn vị tính tiền' // eslint-disable-line
              : ', đơn vị tính tiền'; // eslint-disable-line
        }
        if (this.otherService.timeUnit === '') {
          this.message +=
            this.message === ''
              ? 'Vui lòng nhập thông tin (tần suất thanh toán' // eslint-disable-line
              : ', tần suất thanh toán'; // eslint-disable-line
        }
        if (this.message !== '') {
          this.message += ')';
        }
      }
    },
    addService() {
      this.validate();
      this.checkDuplicateService();
      if (this.message === '' && this.duplicateMsg === '') {
        if (!this.otherService.checkbox) {
          const { serviceName } = this.allServices.find(
            (service) => service.serviceId === Number(this.addNew.serviceId),
          );
          let servicePrice = this.addNew.price;
          if (this.addNew.priceSuggestion === 'Giá bậc thang') {
            servicePrice = -1;
          }
          if (this.addNew.priceSuggestion === 'Giá không ổn định') {
            servicePrice = -2;
          }
          this.addNew.serviceName = serviceName;
          this.newGroup.services.push({
            serviceId: this.addNew.serviceId,
            serviceName: this.addNew.serviceName,
            price: servicePrice,
            priceSuggestion: this.addNew.priceSuggestion,
            timeUnit: this.addNew.timeUnit,
            userUnit: this.addNew.userUnit,
            isRequired: true,
          });
          this.resetAddnewValue();
          this.setNewGroupValue(this.newGroup);
          this.dialog.addGroupService = false;
        } else {
          let newServicePrice = this.otherService.price;
          let newServicePriceSugg = null;
          if (this.otherService.isProgressivePrice) {
            newServicePrice = -1;
            newServicePriceSugg = 'Giá bậc thang';
          }
          if (this.otherService.isDynamicPrice) {
            newServicePrice = -2;
            newServicePriceSugg = 'Giá không cố định';
          }
          this.newGroup.services.push({
            serviceName: this.otherService.serviceName,
            price: newServicePrice,
            priceSuggestion: newServicePriceSugg,
            timeUnit: this.addNew.timeUnit,
            userUnit: this.addNew.userUnit,
            isRequired: true,
          });
          this.setNewGroupValue(this.newGroup);
          this.resetAddnewValue();
          this.dialog.addGroupService = false;
        }
      }
    },
    resetMessage() {
      this.message = '';
      this.duplicateMsg = '';
    },
    resetAddnewValue() {
      const newValue = {
        serviceId: 0,
        price: null,
        userUnit: 'phòng',
        timeUnit: '1 tháng',
        serviceName: null,
      };
      this.addNew = newValue;
      const otherValue = {
        checkbox: false,
        serviceName: '',
        price: null,
        userUnit: 'phòng',
        timeUnit: '1 tháng',
        isDynamicPrice: false,
        isProgressivePrice: false,
      };
      this.otherService = otherValue;
    },
    removeService(serviceName) {
      this.newGroup.services = this.newGroup.services.filter(
        (item) => item.serviceName !== serviceName,
      );
      this.setNewGroupValue(this.newGroup);
      this.resetMessage();
    },
    upperCaseFirstCharacter(serviceName) {
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    },
  },
  computed: {
    allServices() {
      let services = this.$store.state.renter.common.services.data;
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        services = services.filter((item2) => {
          const res =
            item2.serviceName.toLowerCase().indexOf(this.searchQuery.trim().toLowerCase()) !== -1;
          return res;
        });
      }
      if (services.filter((item) => item.serviceId === -1).length === 0) {
        services.unshift({ serviceId: -1, serviceName: 'Dịch vụ khác' });
      }
      return services;
    },
    newGroup() {
      return this.$store.state.vendor.group.newGroup;
    },
  },
};
</script>
