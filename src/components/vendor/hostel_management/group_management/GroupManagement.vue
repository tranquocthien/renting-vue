<template>
  <v-row justify="center">
    <v-dialog v-model="show" fullscreen scrollable transition="dialog-bottom-transition">
      <v-overlay :value="isLoading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card class="d-flex flex-column" v-if="!isLoading" style="border-radius: 0px !important">
        <v-row class="d-flex px-4 py-3 align-center ma-0 justify-space-between">
          <v-img
            alt="Hostel Renting"
            class="shrink mr-2"
            contain
            src="@/assets/logo-sac.png"
            transition="scale-transition"
            max-width="40"
            max-height="40"
          />
          <!-- <v-icon class="ml-4" color="rgb(255, 255, 255, 0.8)">mdi-home-group</v-icon> -->

          <span
            class="font-nunito text-primary font-weight-bold"
            style="font-size: 1.125rem !important"
            >Thêm nhà trọ mới
          </span>
          <v-btn icon @click="closeDialog()" class="mr-4"
            ><v-icon color="#727cf5">close</v-icon></v-btn
          >
        </v-row>
        <v-divider></v-divider>
        <v-card-text class="py-0" style="height: 500px">
          <v-row class="ma-0 d-flex justify-space-between">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="8" class="d-flex flex-column">
                  <span class="field-name font-weight-medium"
                    >Tên nhà trọ<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub-2 font-nunito form"
                    solo
                    dense
                    light
                    hide-details
                    v-model="newGroupValue.groupName"
                    @input="setNewGroupValue(newGroupValue)"
                  />
                </v-col>
                <v-col cols="4" class="d-flex flex-column">
                  <span class="field-name font-weight-medium"
                    >Loại<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-select
                    v-model="newGroupValue.categoryId"
                    @change="setNewGroupValue(newGroupValue)"
                    :items="categories"
                    item-text="categoryName"
                    item-value="categoryId"
                    label="Loại"
                    dense
                    hide-details
                    solo
                    class="size-sub-2 font-nunito form"
                  ></v-select>
                </v-col>

                <v-col cols="12" class="d-flex flex-column">
                  <span class="field-name font-weight-medium"
                    >Địa chỉ<span class="text-danger ml-1">(*)</span></span
                  >
                  <div class="d-flex">
                    <v-col cols="4" class="pl-0 py-0">
                      <v-text-field
                        class="size-sub-2 font-nunito form"
                        solo
                        dense
                        light
                        label="Số nhà"
                        hide-details
                        v-model="newGroupValue.buildingNo"
                        @input="setNewGroupValue(newGroupValue)"
                      />
                    </v-col>
                    <v-col cols="8" class="d-flex flex-column pr-0 py-0"
                      ><gmap-autocomplete
                        placeholder="Địa chỉ đầy đủ"
                        @place_changed="setPlace"
                        :options="gmap"
                        :selectFirstOnEnter="true"
                        style="border: 1px solid #dee2e6 !important; border-radius: 4px"
                        class="pa-2 address-autocomplete"
                      ></gmap-autocomplete
                    ></v-col>
                  </div>
                </v-col>
                <v-col cols="4" class="d-flex">
                  <v-checkbox
                    v-model="newGroupValue.ownerJoin"
                    @click="setNewGroupValue(newGroupValue)"
                    label="Chung chủ"
                    color="#727cf5"
                    class="filter font-nunito size-sub-2 mt-1 checkbox"
                    hide-details
                  ></v-checkbox>
                  <span class="text-danger ml-1 mt-2">(*)</span>
                </v-col>
                <v-col cols="8" class="d-flex flex-column">
                  <div class="d-flex">
                    <v-radio-group
                      v-model="groupInfo.curfewTime.radiogroup"
                      hide-details
                      row
                      class="filter my-0"
                      @change="setCurfewtime()"
                    >
                      <v-radio
                        label="Giờ giấc tự do"
                        value="free"
                        color="#727cf5"
                        class="radioGroup font-nunito"
                      ></v-radio>
                      <v-radio
                        label="Giới nghiêm"
                        value="limit"
                        color="#727cf5"
                        class="radioGroup font-nunito"
                        ><span class="text-danger ml-1">(*)</span></v-radio
                      >
                    </v-radio-group>
                    <span class="text-danger mt-1 ml-auto">(*)</span>
                  </div>

                  <v-row class="ma-0">
                    <v-col cols="6" class="py-0 pl-0">
                      <div class="d-flex flex-row mt-2">
                        <el-time-select
                          placeholder="Mở cổng"
                          v-model="newGroupValue.curfewTime.startTime"
                          :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '23:30',
                          }"
                          @change="setNewGroupValue(newGroupValue)"
                          v-show="showCurfewTime"
                        >
                        </el-time-select>
                      </div>
                    </v-col>
                    <v-col cols="6" class="py-0 pr-0">
                      <div class="d-flex flex-row mt-2">
                        <el-time-select
                          v-show="showCurfewTime"
                          placeholder="Đóng cổng"
                          v-model="newGroupValue.curfewTime.endTime"
                          :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '23:30',
                          }"
                          @change="setNewGroupValue(newGroupValue)"
                        >
                        </el-time-select>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="4" class="d-flex flex-column">
                  <span class="field-name font-weight-medium font-nunito pt-2"
                    >Cọc giữ chân<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub form"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                    hide-details
                    v-model="newGroupValue.downPayment"
                    suffix="VNĐ"
                    step="100000"
                    min="0"
                    :rules="[rules.min(groupInfo.downPayment)]"
                    @input="setNewGroupValue(newGroupValue)"
                  />
                </v-col>
                <v-col cols="8" class="d-flex flex-column">
                  <span class="field-name font-weight-medium d-flex align-center mb-0 font-nunito"
                    >Người liên lạc<v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon small color="#fa5c7c">mdi-account-question</v-icon>
                        </v-btn>
                      </template>
                      <span class="font-nunito"
                        >Là người có thể liên lạc khi tới xem phòng, nếu là chủ trọ, bạn có thể để
                        trống</span
                      >
                    </v-tooltip>
                  </span>
                  <div class="d-flex">
                    <v-col cols="7" class="py-0 pl-0">
                      <v-text-field
                        class="size-sub-2 form"
                        color="#727cf5"
                        label="Tên"
                        solo
                        dense
                        light
                        v-model="newGroupValue.managerName"
                        @input="setNewGroupValue(newGroupValue)"
                      />
                    </v-col>
                    <v-col cols="5" class="py-0 pr-0">
                      <v-text-field
                        class="size-sub-2 form"
                        color="#727cf5"
                        label="Số điện thoại"
                        solo
                        dense
                        light
                        hide-details
                        v-model="newGroupValue.managerPhone"
                        @input="setNewGroupValue(newGroupValue)"
                      />
                    </v-col>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pa-0 d-flex justify-end">
              <v-col cols="11" class="pa-0">
                <v-tabs background-color="#EEF2F7" show-arrows center-active>
                  <!-- <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Vị trí trên bản đồ</span>
                  </v-tab> -->
                  <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Dịch vụ</span>
                  </v-tab>
                  <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Lịch rảnh</span>
                  </v-tab>
                  <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Nội quy</span>
                  </v-tab>
                  <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Hình ảnh</span>
                  </v-tab>
                  <v-tab
                    class="font-nunito text-gray size9rem text-capitalize utilities-category"
                    style="letter-spacing: 0.01rem !important"
                  >
                    <span>Hợp đồng mẫu</span>
                  </v-tab>
                  <!-- <v-tab-item>
                    <span class="font-nunito size9rem text-danger">Xác nhận lại địa chỉ</span>
                    <v-row>
                      <v-col cols="4" class="d-flex">
                        <v-text-field
                          class="size-sub-2 font-nunito form"
                          solo
                          dense
                          light
                          label="Số nhà"
                          hide-details
                          v-model="newGroupValue.buildingNo"
                          @input="setNewGroupValue(newGroupValue)"
                        />
                      </v-col>
                      <v-col cols="8" class="d-flex">
                        <v-select
                          :items="coordsToString.selectableAddresses"
                          label="Chọn địa chỉ"
                          v-model="coordsToString.selectedAddress"
                          messages="Lựa chọn địa chỉ dựa theo vị trí đã chọn"
                          dense
                          hide-details
                          solo
                          class="size-sub-2 font-nunito form"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <div class="gmap-view-map">
                      <gmap-map :center="center" :zoom="12" style="width: 100%; height: 300px">
                        <gmap-marker
                          :position="marker.position"
                          @click="center = marker.position"
                          :clickable="true"
                          :draggable="true"
                          @dragend="updateMarker"
                        ></gmap-marker>
                      </gmap-map>
                    </div>
                  </v-tab-item> -->
                  <v-tab-item> <ServiceManagement /></v-tab-item>
                  <v-tab-item><ScheduleManagement /></v-tab-item>
                  <v-tab-item><RegulationManagement /></v-tab-item>
                  <v-tab-item><AvatarManagement /></v-tab-item>
                  <v-tab-item>Hợp đồng</v-tab-item>
                </v-tabs>
              </v-col>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end pa-4">
          <v-btn class="btn btn-light elevation-0 font-nunito" @click="closeDialog()"> Đóng </v-btn>
          <v-btn class="btn btn-primary font-nunito" @click="insertGroup()"> Lưu </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="warningDialog" max-width="400" hide-overlay>
      <v-card>
        <v-card-title class="d-flex flex-column justify-center px-8">
          <v-icon large class="material-icons-outlined" color="#ffbc00">report_problem</v-icon>
          <span
            class="text-gray font-nunito"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
            "
            >Vui lòng điền đầy đủ các thông tin!</span
          >
        </v-card-title>
        <div
          class="font-nunito"
          style="
            font-size: 0.9rem;
            font-weight: 400;
            text-align: center !important;
            color: #ffbc00;
            padding: 0px 20px 20px;
          "
        >
          {{ emptyElement }}
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import ServiceManagement from './ServiceManagement.vue';
import RegulationManagement from './RegulationManagement.vue';
import AvatarManagement from './AvatarManagement.vue';
import ScheduleManagement from './ScheduleManagement.vue';

export default {
  name: 'GroupManagement',
  props: ['show', 'create', 'update'],
  components: {
    ServiceManagement,
    RegulationManagement,
    AvatarManagement,
    ScheduleManagement,
  },
  data: () => ({
    newGroup: {
      vendorId: 0,
      buildingNo: '',
      longitude: '',
      latitude: '',
      managerName: '',
      managerPhone: '',
      ownerJoin: false,
      imgUrl: null,
      address: {
        provinceId: 1,
        provinceName: 'Thành phố Hồ Chí Minh',
        districtId: null,
        districtName: '',
        wardId: null,
        wardName: '',
        streetId: null,
        streetName: '',
      },
      services: [],
      schedules: [],
    },
    // thuy
    groupInfo: {
      groupName: '',
      category: 0,
      address: '',
      ownerJoin: false,
      curfewTime: {
        radiogroup: 'limit',
        startTime: '',
        endTime: '',
      },
      manager: {
        name: '',
        phone: '',
      },
      downPayment: 0,
    },
    rules: {
      min(value) {
        return (value || 'Giá không hợp lệ') > 0 || 'Không hợp lệ';
      },
    },
    showCurfewTime: true,
    // map
    center: { lat: 10.8230989, lng: 106.6296638 },
    marker: { position: { lat: 10.8230989, lng: 106.6296638 } },
    place: { position: { lat: 10.8230989, lng: 106.6296638 } },
    addressString: '',
    gmap: {
      bounds: {
        north: 11.1602136,
        south: 10.3493704,
        east: 107.0265769,
        west: 106.3638784,
      },
      strictBounds: true,
    },
    buildingNo: '',
    coordsToString: {
      addressComponents: [],
      selectableAddresses: [],
      selectedAddress: '',
    },
    addressComponents: [],
    e1: 1,
    warningDialog: false,
    emptyElement: '',
  }),
  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      createHostelGroup: 'vendor/group/createHostelGroup',
      getAllCategories: 'renter/filterResult/getAllCategories',
      getAllServices: 'renter/common/getAllServices1',
      getAllRules: 'renter/common/getAllRules',
      getAllSchedule: 'renter/common/getAllSchedule',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
      getProvinces: 'renter/common/getProvinces',
    }),
    checkCreatingGroup() {
      if (this.groups.success) {
        this.changeShow();
      } else {
        this.showSnackBar('Tạo khu trọ thất bại', { color: 'red' });
      }
    },
    changeShow() {
      this.show = false;
    },
    closeDialog() {
      this.$emit('close');
    },
    setCurfewtime() {
      if (this.groupInfo.curfewTime.radiogroup === 'free') {
        this.newGroupValue.curfewTime.limit = false;
        this.showCurfewTime = false;
      } else {
        this.newGroupValue.curfewTime.limit = true;
        this.showCurfewTime = true;
      }
    },
    setPlace(place) {
      this.place = place;
      this.addMarker();
      this.addressString = `${this.place.formatted_address}`;
    },
    addMarker() {
      const marker = {
        lat: this.place.geometry.location.lat(),
        lng: this.place.geometry.location.lng(),
      };
      this.marker = { position: marker };
      this.center = marker;
      console.log(this.marker);
      this.newGroupValue.latitude = this.marker.position.lat;
      this.newGroupValue.longitude = this.marker.position.lng;
      this.setNewGroupValue(this.newGroupValue);
    },
    geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const coord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.center = coord;
          this.place = { position: coord };
          this.marker = { position: coord };
        });
      }
    },
    updateMarker(mouseEvent) {
      // https://developers.google.com/maps/documentation/javascript/reference/map#MouseEvent
      const { latLng } = mouseEvent;
      const coord = { lat: latLng.lat(), lng: latLng.lng() };
      this.place = { position: coord };
      this.marker = { position: coord };
      this.center = coord;
      this.newGroupValue.latitude = this.marker.position.lat;
      this.newGroupValue.longitude = this.marker.position.lng;
      this.setNewGroupValue(this.newGroupValue);
    },
    async searchByCoord(coords) {
      const key = 'AIzaSyDNBmxVGbZ4Je5XHPRqqaZPmDFKjKPPhXk';
      const { lat, lng } = coords;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
      let res = await fetch(url);
      if (res.status === 200) {
        res = await res.json();
        const includeRoutes = res.results.filter((item) => {
          const indexR = item.address_components.findIndex((compo) => {
            const includeRoute = compo.types.includes('route');
            return includeRoute;
          });
          return indexR > -1;
        });
        let formattedAddresses = includeRoutes.map((item) => {
          const addressComponents = item.address_components;
          const streetNumber = addressComponents.find((compo) => {
            const isInclude = compo.types.includes('street_number');
            return isInclude;
          });
          if (streetNumber) {
            const shortName = streetNumber.short_name;
            return item.formatted_address.substring(shortName.length + 1);
          }
          return item.formatted_address;
        });
        formattedAddresses = new Set(formattedAddresses);
        return Array.from(formattedAddresses);
      }
      console.log(this.marker);
      return null;
    },
    updateSelectableAddress() {
      const { position } = this.marker;
      this.searchByCoord(position).then((formattedAddresses) => {
        this.coordsToString.selectableAddresses = formattedAddresses;
      });
    },
    findDistrictByName(districtName) {
      const district = this.districts.data.find((d) => {
        const include = d.districtName
          .trim()
          .toLowerCase()
          .includes(districtName.trim().toLowerCase());
        return include;
      });
      return district;
    },
    findWardByName(wardName, wards) {
      const ward = wards.find((w) => {
        const include = w.wardName.trim().toLowerCase().includes(wardName.trim().toLowerCase());
        return include;
      });
      return ward;
    },
    findStreetByName(streetName) {
      const street = this.streets.data.find((s) => {
        const include = s.streetName.trim().toLowerCase().includes(streetName.trim().toLowerCase());
        return include;
      });
      return street;
    },
    emitNewAddress() {
      this.newGroupValue.address = this.addressObjForApi;
      this.setNewGroupValue(this.newGroupValue);
      this.$emit('newValue', {
        coords: {
          longitude: this.marker.position.lng,
          latitude: this.marker.position.lat,
        },
        address: this.addressObjForApi,
      });
      console.log(this.addressObjForApi);
    },
    validateNewregulation() {
      let flag = 0;
      this.newGroupValue.newRegulations.forEach((item) => {
        if (item.regulationName.trim() === '') {
          flag += 1;
        }
      });
      return flag;
    },
    checkDuplicateNewRegulation() {
      let flag = 0;
      this.newGroupValue.newRegulations.forEach((item) => {
        if (
          this.allRules.filter(
            (rule) =>
              rule.regulationName.toLowerCase().trim() === item.regulationName.toLowerCase().trim(), // eslint-disable-line
          ).length > 0
        ) {
          flag += 1;
        }
      });
      return flag;
    },
    validateFullAddress() {
      return this.addressString.includes(this.newGroupValue.buildingNo.trim());
    },
    validate() {
      console.log(this.addressString);
      console.log(this.newGroupValue);
      this.emptyElement = '';
      this.emptyElement +=
        this.newGroupValue.groupName.trim() === '' // eslint-disable-line
          ? this.emptyElement === '' // eslint-disable-line
            ? 'Tên nhà trọ' // eslint-disable-line
            : ', tên nhà trọ' // eslint-disable-line
          : ''; // eslint-disable-line
      this.emptyElement +=
        this.newGroupValue.buildingNo.trim() === '' // eslint-disable-line
          ? this.emptyElement === '' // eslint-disable-line
            ? 'Số nhà' // eslint-disable-line
            : ', số nhà' // eslint-disable-line
          : ''; // eslint-disable-line
      if (this.newGroupValue.buildingNo.trim() !== '' && this.addressString.trim() !== '') {
        console.log(this.validateFullAddress());
        !this.validateFullAddress() // eslint-disable-line
          ? this.emptyElement === '' // eslint-disable-line
            ? 'Vui lòng nhập địa chỉ đầy đủ (bao gồm số nhà, tên đường, tên phường, quận, thành phố)' // eslint-disable-line
            : ', nhập địa chỉ đầy đủ (bao gồm số nhà, tên đường, tên phường, quận, thành phố)' // eslint-disable-line
          : ''; // eslint-disable-line
      }
      this.emptyElement +=
        this.addressString.trim() === '' // eslint-disable-line
          ? this.emptyElement === '' // eslint-disable-line
            ? 'địa chỉ đầy đủ' // eslint-disable-line
            : ', địa chỉ đầy đủ' // eslint-disable-line
          : ''; // eslint-disable-line
      if (this.newGroupValue.curfewTime.limit) {
        this.emptyElement +=
          this.newGroupValue.curfewTime.startTime === '' // eslint-disable-line
            ? this.emptyElement === '' // eslint-disable-line
              ? 'Thời gian mở cổng' // eslint-disable-line
              : ', thời gian mở cổng' // eslint-disable-line
            : ''; // eslint-disable-line
        this.emptyElement +=
          this.newGroupValue.curfewTime.endTime === '' // eslint-disable-line
            ? this.emptyElement === '' // eslint-disable-line
              ? 'Thời gian đóng cổng' // eslint-disable-line
              : ', thời gian đóng cổng' // eslint-disable-line
            : ''; // eslint-disable-line
      }
      this.emptyElement +=
        this.newGroupValue.schedules.length === 0 // eslint-disable-line
          ? this.emptyElement === '' // eslint-disable-line
            ? 'Lịch rảnh' // eslint-disable-line
            : ', lịch rảnh' // eslint-disable-line
          : ''; // eslint-disable-line
      if (this.newGroupValue.newRegulations.length > 0) {
        this.emptyElement +=
          this.validateNewregulation() > 0 // eslint-disable-line
            ? this.emptyElement === '' // eslint-disable-line
              ? 'Tên nội quy' // eslint-disable-line
              : ', tên nội quy' // eslint-disable-line
            : ''; // eslint-disable-line
        console.log(this.checkDuplicateNewRegulation());
        this.emptyElement +=
          this.checkDuplicateNewRegulation() >= 1 // eslint-disable-line
            ? this.emptyElement === '' // eslint-disable-line
              ? 'Nội quy bổ sung đã tồn tại' // eslint-disable-line
              : ', nội quy bổ sung đã tồn tại' // eslint-disable-line
            : ''; // eslint-disable-line
      }
    },
    insertGroup() {
      this.validate();
      if (this.emptyElement === '') {
        const regulation = this.newGroupValue.regulation.map((item) => ({ regulationId: item }));
        this.newGroupValue.statePrice.forEach((item) => {
          this.newGroupValue.services[item].price = -1;
        });
        const groupService = this.newGroupValue.services
          .filter((item) => item.serviceId)
          .map((item) => ({
            serviceId: item.serviceId,
            price:
              item.price !== -1 && item.price !== -2
                ? this.getPriceUnit(item.price).servicePrice // eslint-disable-line
                : item.price, // eslint-disable-line
            priceUnit:
              item.price !== -1 && item.price !== -2
                ? this.getPriceUnit(item.price).servicePriceUnit // eslint-disable-line
                : null, // eslint-disable-line
            timeUnit: item.timeUnit,
            userUnit: item.price !== -1 && item.price !== -2 ? item.userUnit : null,
            isRequired: item.isRequired,
          }));
        console.log(groupService);
        const newGroupServices = this.newGroupValue.services
          .filter((item) => !item.serviceId)
          .map((item) => ({
            price:
              item.price !== -1 && item.price !== -2
                ? this.getPriceUnit(item.price).servicePrice // eslint-disable-line
                : item.price, // eslint-disable-line
            priceUnit:
              item.price !== -1 && item.price !== -2
                ? this.getPriceUnit(item.price).servicePriceUnit // eslint-disable-line
                : null, // eslint-disable-line
            timeUnit: item.timeUnit,
            userUnit: item.price !== -1 && item.price !== -2 ? item.userUnit : null,
            serviceName: item.serviceName,
            isRequired: item.isRequired,
          }));
        console.log(newGroupServices);
        const reqObj = {
          address: this.addressObjForApi,
          appendixContract: 'string',
          buildingNo: this.newGroupValue.buildingNo,
          categoryId: this.newGroupValue.categoryId,
          curfewTime:
            this.newGroupValue.curfewTime.limit === true
              ? `${this.newGroupValue.curfewTime.startTime}-${this.newGroupValue.curfewTime.endTime}` // eslint-disable-line
              : null, // eslint-disable-line
          downPayment: this.newGroupValue.downPayment,
          groupName: this.newGroupValue.groupName,
          imgUrl: this.newGroupValue.avatar,
          latitude: this.newGroupValue.latitude,
          longitude: this.newGroupValue.longitude,
          managerName: this.newGroupValue.managerName,
          managerPhone: this.newGroupValue.managerPhone,
          ownerJoin: this.newGroupValue.ownerJoin,
          regulations: regulation,
          newRegulations: this.newGroupValue.newRegulations.map((item) => ({
            regulationName: item.regulationName,
          })),
          schedules: this.newGroupValue.schedules,
          services: groupService,
          newServices: newGroupServices,
          vendorId: this.user.userId,
        };
        console.log(this.addressObjForApi);
        this.createHostelGroup(reqObj).then(() => {
          if (this.isCreatedGroupStatus) {
            this.closeDialog();
          } else {
            console.log('not success');
          }
        });
        console.log(reqObj);
      } else {
        this.warningDialog = true;
      }
    },
    getPriceUnit(price) {
      let servicePriceUnit = null;
      let servicePrice = 0;
      if (String(price).length <= 6) {
        servicePrice = price / 1000;
        servicePriceUnit = 'nghìn';
      } else if (String(price).length < 10) {
        servicePrice = price / 1000000;
        servicePriceUnit = 'triệu';
      } else {
        servicePriceUnit = 'tỉ';
        servicePrice = price / 1000000000;
      }
      return { servicePrice, servicePriceUnit };
    },
    getAddress() {
      console.log(this.addressString);
      console.log(this.newGroupValue.buildingNo);
      const address = this.addressString.split(this.newGroupValue.buildingNo)[1].trim();
      let [streetName, wardName, districtName] = address.split(',');
      if (streetName.startsWith('Đường')) {
        streetName = `${streetName.split('Đường')[1]}`;
      }
      wardName = wardName.trim();
      districtName = districtName.trim(); // let streetName = this.addressComponents.find(
      return { streetName, wardName, districtName };
    },
  },
  computed: {
    ...mapState({
      groups: (state) => state.vendor.group.groups,
    }),
    user() {
      return this.$store.state.user.user.data;
    },
    categories() {
      return this.$store.state.renter.filterResult.filter.categories.data;
    },
    allServices() {
      return this.$store.state.renter.common.services.data;
    },
    allRules() {
      return this.$store.state.renter.common.rules.data;
    },
    allSchedule() {
      return this.$store.state.renter.common.schedule.data;
    },
    isLoading() {
      const allServices = this.$store.state.renter.common.services.isLoading;
      const allCategories = this.$store.state.renter.filterResult.filter.categories.isLoading;
      const allRules = this.$store.state.renter.common.rules.isLoading;
      const allSchedule = this.$store.state.renter.common.schedule.isLoading;
      const isCreatingGroup = this.$store.state.vendor.group.groups.isCreating;
      return allServices || allCategories || allRules || allSchedule || isCreatingGroup;
    },
    isCreatedGroupStatus() {
      return this.$store.state.vendor.group.groups.success;
    },
    newGroupValue() {
      return this.$store.state.vendor.group.newGroup;
    },
    ...mapState('renter/common', ['provinces', 'wards', 'districts', 'streets']),
    addressObjForApi() {
      const { streetName, wardName, districtName } = this.getAddress();
      console.log(streetName, wardName, districtName);
      const district = this.findDistrictByName(districtName);
      const ward = this.findWardByName(wardName, district.wards);
      const street = this.findStreetByName(streetName);
      const obj = {
        provinceId: 1,
        districtId: district.districtId,
        wardId: ward.wardId,
        streetName,
        buildingNo: this.newGroupValue.buildingNo,
      };
      if (street) {
        obj.streetId = street.streetId;
      } else {
        obj.streetId = null;
      }
      return obj;
    },
  },
  watch: {
    marker: {
      handler() {
        this.updateSelectableAddress();
      },
      deep: true,
    },
    'coordsToString.selectedAddress': {
      handler() {
        this.emitNewAddress();
      },
      deep: true,
    },
    buildingNo: {
      handler() {
        this.emitNewAddress();
      },
    },
  },
  mounted() {
    this.geolocate();
    this.updateSelectableAddress();
  },
  created() {
    console.log('thuy', this.allRules.length);
    if (!this.user) {
      this.getUser().then(() => {
        this.newGroup.vendorId = this.user.userId;
      });
    } else {
      this.newGroup.vendorId = this.user.userId;
    }
    // if (this.categories.length === 0) {
    this.getAllCategories().then(() => {
      this.newGroupValue.categoryId = this.$store.state.renter.filterResult.filter.categories.select;
    });
    if (this.allServices.length === 0) {
      this.getAllServices();
    }
    if (this.allRules.length === 0) {
      this.getAllRules();
    }
    if (this.provinces.data.length === 0) {
      this.getProvinces();
    }
    if (this.allSchedule.length === 0) {
      this.getAllSchedule();
    }
    // }
  },
};
</script>
<style>
.field-name {
  color: #212121 !important;
  font-family: Nunito, sans-serif !important;
  font-size: 0.9rem !important;
  line-height: 1.5 !important;
  text-align: left !important;
  margin-bottom: 0.5rem !important;
}
.v-input__slot {
  border: 1px solid #dee2e6 !important;
}
.checkbox .theme--light.v-label {
  color: #212121 !important;
  font-size: 0.875rem !important;
  font-family: 'Nunito', sans-serif !important;
}
.form.v-text-field input {
  color: #6c757d !important;
}
.form.theme--light.v-select .v-select__selection--comma {
  color: #6c757d !important;
}
.form .theme--light.v-label {
  color: #98a6ad !important;
  font-weight: 400 !important;
}
.radioGroup .theme--light.v-label {
  color: #6c757d !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 0.875rem !important;
}
.el-input__inner {
  color: #6c757d !important;
}
.address-autocomplete::placeholder {
  color: #98a6ad;
  font-family: 'Nunito', sans-serif !important;
  font-weight: 300 !important;
}
.address-autocomplete:focus {
  outline: none;
}
</style>
