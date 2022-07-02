<template>
  <v-row class="ma-0 d-flex flex-column">
    <div>
      <v-btn
        class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start ml-auto"
        style="letter-spacing: 0.01rem !important"
        _click="dialog.addGroupService = true"
        @click="addNewService()"
        ><v-icon small class="mr-1">mdi-cash-plus</v-icon>Thêm dịch vụ mới</v-btn
      >
    </div>
    <div class="d-flex flex-column">
      <v-row
        class="mx-0 mt-4 pr-4"
        style="
          border-bottom: 2px solid #eef2f7;
          border-top: 2px solid #eef2f7;
          border-left: 2px solid #eef2f7;
          border-right: 2px solid #eef2f7;
          max-height: 50px !important;
          min-height: 50px !important;
        "
      >
        <v-col
          cols="2"
          class="d-flex pa-0 align-center justify-center"
          style="border-right: 1px solid #eef2f7"
        >
          <span
            class="font-nunito text-black size-sub-3 d-flex flex-column justify-center align-center"
            style="width: 50%; height: 100%; border-right: 1px solid #eef2f7"
            >Bắt buộc
          </span>
          <span
            class="font-nunito text-black size-sub-3 d-flex flex-column justify-center align-center"
            style="width: 50%"
            >STT
          </span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex py-0 align-center justify-center"
          style="border-right: 1px solid #eef2f7"
        >
          <span class="font-nunito text-black size-sub-3">Tên</span>
        </v-col>
        <v-col
          cols="5"
          class="d-flex py-0 align-center justify-center"
          style="border-right: 1px solid #eef2f7"
        >
          <span class="font-nunito text-black size-sub-3">Giá</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex py-0 align-center justify-center"
          style="border-right: 1px solid #eef2f7"
        >
          <span class="font-nunito text-black size-sub-3">Tần suất</span>
        </v-col>
        <v-col cols="1" class="d-flex py-0 align-center justify-center">
          <span class="font-nunito text-black size-sub-3">Xóa</span>
        </v-col>
      </v-row>
      <v-card
        max-height="260"
        v-if="newGroup.services.length > 0"
        class="overflow-y-auto d-flex flex-column"
      >
        <div
          :key="index"
          v-for="(item, index) in newGroup.services"
          class="px-0 d-flex justify-start align-start"
        >
          <v-row
            class="mx-0 pa-0 service-item cursor"
            style="border-bottom: 1px solid #eef2f7"
            v-if="newGroup.services.length >= 4"
          >
            <v-col
              cols="2"
              class="d-flex justify-center align-center pa-0"
              style="border-right: 1px solid #eef2f7; border-left: 1px solid #eef2f7"
            >
              <v-checkbox
                v-model="newGroup.services[index].isRequired"
                color="#727cf5"
                hide-details
                class="filter my-0 pl-7 d-flex align-center"
                @change="setNewGroupValue(newGroup)"
                style="width: 60%; height: 50px; border-right: 1px solid #eef2f7"
              ></v-checkbox>
              <span
                class="font-nunito text-gray size-sub-3 d-flex flex-column justify-center align-center"
                style="width: 40%"
                >{{ index + 1 }}
              </span>
            </v-col>
            <v-col cols="3" class="d-flex align-start py-2" style="border-right: 1px solid #eef2f7">
              <span
                class="font-nunito text-gray size-sub-3 my-auto"
                v-if="
                  isRequiredService(item.serviceName) && newGroup.services[index].serviceId !== -1
                "
                >{{ item.serviceName }}</span
              >
              <v-autocomplete
                v-if="
                  !isRequiredService(item.serviceName) && newGroup.services[index].serviceId !== -1
                "
                v-model="newGroup.services[index].serviceId"
                :items="unselectedService"
                item-text="serviceName"
                item-value="serviceId"
                class="size-sub-3 font-nunito form"
                solo
                dense
                color="indigo"
                hide-details
                cache-items
                background-color="white"
                no-data-text='Chọn " Dịch vụ khác " nếu dịch vụ bạn muốn chọn không tồn tại'
                style="border: 1px solid #e1e1e1 !important; border-radius: 4px"
                @change="selectService(index)"
              >
                <template slot="item" slot-scope="{ item }">
                  <span class="font-nunito font-weight-medium size-sub-3">{{
                    item.serviceName
                  }}</span>
                </template></v-autocomplete
              >
              <v-text-field
                v-if="newGroup.services[index].serviceId === -1"
                v-model="newGroup.services[index].serviceName"
                dense
                label="Tên dịch vụ"
                class="py-1 form size-sub-3 font-nunito"
                solo
                autofocus
                hide-details
              />
            </v-col>
            <v-col
              cols="4"
              class="d-flex flex-column py-2 align-start justify-start"
              style="border-right: 1px solid #eef2f7"
            >
              <div style="width: 100% !important" class="d-flex py-0">
                <v-text-field
                  v-model="newGroup.services[index].price"
                  dense
                  label="Giá tiền"
                  class="py-0 form size-sub-3 font-nunito addnew-service my-0"
                  solo
                  hide-details
                  style="width: 50% !important"
                  @input="inputDownPayment(index)"
                />
                <v-text-field
                  v-model="newGroup.services[index].userUnit"
                  dense
                  class="py-0 size-sub-3 font-nunito userUnit-textfield my-0"
                  filled
                  prefix="VNĐ/"
                  hide-details
                  append-icon="mdi mdi-pencil"
                  style="width: 50% !important"
                />
              </div>
              <span
                v-if="!isValidPrice(newGroup.services[index].price)"
                class="font-nunito red--text size-caption"
                >{{ priceError }}</span
              >
            </v-col>
            <v-col
              cols="2"
              class="d-flex py-2 align-start justify-center"
              style="border-right: 1px solid #eef2f7"
            >
              <v-select
                :items="service.timeUnit"
                dense
                hide-details
                v-model="newGroup.services[index].timeUnit"
                class="form size-sub-3 font-nunito"
                solo
              ></v-select>
            </v-col>
            <v-col cols="1" class="d-flex py-0 align-center justify-center">
              <v-btn icon @click="removeService(item.serviceName)"
                ><v-icon small color="#98a6ad">mdi mdi-delete</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-row
            v-else
            class="mx-0 py-0 pl-0 pr-4 service-item cursor"
            style="
              border-bottom: 1px solid #eef2f7;
              border-left: 2px solid #eef2f7;
              border-right: 2px solid #eef2f7;
            "
          >
            <v-col
              cols="2"
              class="d-flex justify-center align-center pa-0"
              style="border-right: 1px solid #eef2f7; border-left: 1px solid #eef2f7"
            >
              <div style="width: 50%; height: 100%" class="d-flex align-center justify-center">
                <v-checkbox
                  v-model="newGroup.services[index].isRequired"
                  color="#727cf5"
                  hide-details
                  class="filter ma-0"
                  @change="setNewGroupValue(newGroup)"
                ></v-checkbox>
              </div>
              <span
                class="ml-auto font-nunito text-gray size-sub-3 d-flex flex-column justify-center align-center"
                style="width: 50%; height: 100%; border-left: 1px solid #eef2f7"
                >{{ index + 1 }}
              </span>
            </v-col>
            <v-col cols="2" class="d-flex align-start py-2" style="border-right: 1px solid #eef2f7">
              <span
                class="font-nunito text-gray size-sub-3 my-auto"
                v-if="
                  isRequiredService(item.serviceName) && newGroup.services[index].serviceId !== -1
                "
                >{{ item.serviceName }}</span
              >
              <v-autocomplete
                v-if="
                  !isRequiredService(item.serviceName) && newGroup.services[index].serviceId !== -1
                "
                v-model="newGroup.services[index].serviceId"
                :items="unselectedService"
                item-text="serviceName"
                item-value="serviceId"
                class="size-sub-3 font-nunito form"
                solo
                dense
                color="indigo"
                hide-details
                cache-items
                background-color="white"
                no-data-text='Chọn " Dịch vụ khác " nếu dịch vụ bạn muốn chọn không tồn tại'
                style="border: 1px solid #e1e1e1 !important; border-radius: 4px"
                @change="selectService(index)"
              >
                <template slot="item" slot-scope="{ item }">
                  <span class="font-nunito font-weight-medium size-sub-3">{{
                    item.serviceName
                  }}</span>
                </template></v-autocomplete
              >
              <v-text-field
                v-if="newGroup.services[index].serviceId === -1"
                v-model="newGroup.services[index].serviceName"
                dense
                label="Tên dịch vụ"
                class="py-1 form size-sub-3 font-nunito"
                solo
                autofocus
                hide-details
              />
            </v-col>
            <v-col cols="3" class="d-flex flex-column py-2 align-start justify-start">
              <div style="width: 100% !important" class="d-flex py-0">
                <v-text-field
                  v-model="newGroup.services[index].price"
                  dense
                  label="Giá tiền"
                  class="py-0 form size-sub-3 font-nunito addnew-service my-0"
                  solo
                  hide-details
                  style="width: 50% !important"
                  @input="inputDownPayment(index)"
                  :disabled="newGroup.statePrice.includes(index)"
                />
                <v-text-field
                  v-model="newGroup.services[index].userUnit"
                  dense
                  class="py-0 size-sub-3 font-nunito userUnit-textfield my-0"
                  filled
                  prefix="VNĐ/"
                  hide-details
                  append-icon="mdi mdi-pencil"
                  style="width: 50% !important"
                  :disabled="newGroup.statePrice.includes(index)"
                  v-bind:style="
                    newGroup.statePrice.includes(index)
                      ? 'background-color: #cccccc'
                      : 'background-color: rgba(57, 175, 209, 0.05)'
                  "
                />
              </div>
              <span
                v-if="
                  !isValidPrice(newGroup.services[index].price) &&
                  !newGroup.statePrice.includes(index)
                "
                class="font-nunito red--text size-caption"
                >{{ priceError }}</span
              >
            </v-col>
            <v-col
              cols="2"
              class="d-flex py-2 align-start justify-center"
              style="border-right: 1px solid #eef2f7"
            >
              <v-checkbox
                v-model="newGroup.statePrice"
                :value="index"
                color="#727cf5"
                hide-details
                class="filter small-label mt-2 font-nunito size-sub-3"
                label="Giá nhà nước"
                @change="setNewGroupValue(newGroup)"
              ></v-checkbox>
            </v-col>
            <v-col
              cols="2"
              class="d-flex py-2 align-start justify-center"
              style="border-right: 1px solid #eef2f7"
            >
              <v-select
                :items="service.timeUnit"
                dense
                hide-details
                v-model="newGroup.services[index].timeUnit"
                class="form size-sub-3 font-nunito"
                solo
              ></v-select>
            </v-col>
            <v-col cols="1" class="d-flex py-0 align-center justify-center">
              <v-btn icon @click="removeService(item.serviceName)"
                ><v-icon small color="#98a6ad">mdi mdi-delete</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-card>
      <span
        v-else
        style="
          border: 2px dashed #dee2e6;
          border-bottom-right-radius: 6px;
          border-top: 0px;
          border-bottom-left-radius: 6px;
          text-align: center;
        "
        class="pa-5 font-nunito text-primary size9rem"
        >Không có dịch vụ nào</span
      >
    </div>
    <v-dialog v-model="dialog.addGroupService" hide-overlay persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container class="pt-3 pb-0">
            <v-row>
              <v-col cols="6" class="pb-0 pl-0" v-if="!otherService.checkbox">
                <v-autocomplete
                  v-model="addNew.serviceId"
                  :items="allServices"
                  label="Chọn dịch vụ"
                  item-text="serviceName"
                  item-value="serviceId"
                  class="size9rem font-nunito form mx-1 mt-1 mb-7"
                  solo
                  dense
                  color="indigo"
                  clearable
                  hide-details
                  background-color="white"
                  no-data-text="Không có kết quả phù hợp"
                  style="border: 1px solid #e1e1e1 !important; border-radius: 4px"
                  @input="initUserUnit(), resetMessage()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" class="pl-0 pb-0" v-else>
                <v-text-field
                  v-model="otherService.serviceName"
                  dense
                  label="Tên dịch vụ"
                  class="py-1 size9rem font-nunito service-box-textfield"
                  outlined
                  color="#727cf5"
                />
              </v-col>
              <v-col cols="6" v-if="otherService.checkbox" class="d-flex">
                <v-checkbox
                  v-model="otherService.isDynamicPrice"
                  label="Giá biến động"
                  hide-details
                  class="filter service-checkbox"
                  color="#727cf5"
                  @change="otherService.isProgressivePrice = false"
                ></v-checkbox>
                <v-checkbox
                  v-model="otherService.isProgressivePrice"
                  label="Giá lũy tiến"
                  hide-details
                  class="filter service-checkbox"
                  color="#727cf5"
                  @change="otherService.isDynamicPrice = false"
                ></v-checkbox>
              </v-col>
              <v-col cols="6" class="pr-0 d-flex pb-0" v-if="!otherService.checkbox">
                <v-text-field
                  v-model="addNew.price"
                  dense
                  label="Giá tiền"
                  type="number"
                  class="py-1 form size9rem font-nunito addnew-service"
                  solo
                  step="10000"
                  min="0"
                  :rules="[rules.min(addNew.price)]"
                  v-if="userUnitSuggested"
                />
                <v-text-field
                  v-model="addNew.userUnit"
                  dense
                  class="py-1 size9rem font-nunito userUnit-textfield"
                  filled
                  prefix="VNĐ/"
                  v-if="userUnitSuggested && userUnitSuggested === 'VNĐ/Phòng'"
                  append-icon="mdi mdi-pencil"
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
                <span
                  class="my-1 mx-0 px-2 d-flex align-center font-nunito text-gray"
                  style="border: 1px solid #e1e1e1 !important; border-radius: 4px; height: 38px"
                  v-if="!userUnitSuggested"
                  >{{ priceSuggestion }}</span
                >
              </v-col>
              <v-col
                cols="12"
                class="d-flex py-0 px-0"
                v-if="
                  otherService.checkbox &&
                  !otherService.isDynamicPrice &&
                  !otherService.isProgressivePrice
                "
              >
                <v-col cols="6" class="pa-0 pr-3">
                  <v-text-field
                    v-model="otherService.price"
                    dense
                    label="Giá tiền"
                    type="number"
                    class="py-1 form size9rem font-nunito addnew-service other-service"
                    solo
                    step="10000"
                    min="0"
                    height="40"
                    :rules="[rules.min(otherService.price)]"
                  />
                </v-col>
                <v-col cols="4" class="pa-0 ml-n3">
                  <v-text-field
                    v-model="otherService.userUnit"
                    dense
                    class="py-1 size9rem font-nunito other-service-textfield"
                    filled
                    prefix="VNĐ/"
                    append-icon="mdi mdi-pencil"
                  />
                </v-col>
              </v-col>
              <v-col
                cols="12"
                class="d-flex pt-0 px-0"
                v-if="
                  otherService.checkbox &&
                  (otherService.isDynamicPrice || otherService.isProgressivePrice)
                "
              >
                <v-col cols="6" class="pt-0 pl-0">
                  <span
                    class="my-1 mx-0 px-2 d-flex align-center font-nunito text-gray"
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.4) !important;
                      border-radius: 4px;
                      height: 38px;
                    "
                    v-if="otherService.isDynamicPrice"
                    >Giá không cố định</span
                  >
                  <span
                    class="my-1 mx-0 px-2 d-flex align-center font-nunito text-gray"
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.4) !important;
                      border-radius: 4px;
                      height: 38px;
                    "
                    v-if="otherService.isProgressivePrice"
                    >Giá bậc thang</span
                  >
                </v-col>
              </v-col>
              <v-col cols="6" class="pt-0 pl-0" v-if="!otherService.checkbox">
                <v-select
                  :items="service.timeUnit"
                  prefix="Tần suất thu: "
                  dense
                  hide-details
                  v-model="addNew.timeUnit"
                  class="pa-1 form size9rem font-nunito"
                  solo
                ></v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pl-0" v-else>
                <v-select
                  :items="service.timeUnit"
                  prefix="Tần suất thu: "
                  dense
                  color="#727cf5"
                  hide-details
                  v-model="otherService.timeUnit"
                  class="otherService size9rem font-nunito service-box-textfield"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="6" class="pt-0 pr-0 d-flex">
                <v-checkbox
                  v-model="otherService.checkbox"
                  label="Dịch vụ khác"
                  hide-details
                  class="filter service-checkbox"
                  color="#727cf5"
                  @change="resetMessage()"
                ></v-checkbox>
              </v-col>
            </v-row>
            <span class="text-danger font-nunito size-9rem mt-1">{{ message }}</span
            ><br />
            <span class="text-danger font-nunito size-9rem mt-1">{{ duplicateMsg }}</span>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-start pa-4">
          <v-spacer></v-spacer>
          <v-btn
            class="btn btn-light red--text elevation-0 font-nunito"
            @click="(dialog.addGroupService = false), (message = ''), (duplicateMsg = '')"
          >
            Hủy
          </v-btn>
          <v-btn class="btn btn-primary font-nunito" @click="addService()"> Thêm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ServiceManagement',
  data: () => ({
    dialog: {
      addGroupService: false,
    },
    addNew: {
      serviceId: 0,
      price: null,
      priceSuggestion: null,
      userUnit: 'phòng',
      timeUnit: '1 tháng',
      serviceName: null,
      isRequired: false,
    },
    otherService: {
      checkbox: false,
      serviceName: '',
      price: null,
      userUnit: 'phòng',
      timeUnit: '1 tháng',
      isDynamicPrice: false,
      isProgressivePrice: false,
      isRequired: false,
    },
    service: {
      userUnit: ['VNĐ/Phòng', 'VNĐ/Người'],
      timeUnit: ['1 tuần', '1 tháng', '3 tháng', '6 tháng', '1 năm'],
    },
    groupService: [],
    required: [],
    userUnitSuggested: 'VNĐ/Phòng',
    priceSuggestion: null,
    rules: {
      min(value) {
        return (value || 'Giá không hợp lệ') >= 0 || 'Không hợp lệ';
      },
      integer: (value) => {
        const pattern = /\b[0-9]+\b/;
        return pattern.test(value) || 'Không hợp lệ';
      },
    },
    message: '',
    duplicateMsg: '',
    unselectedService: [],
    priceError: '',
  }),
  computed: {
    allServices() {
      const services = this.$store.state.renter.common.services.data;
      services.forEach((item, index) => {
        services[index].serviceName = this.upperCaseFirstCharacter(item.serviceName);
      });
      if (services.filter((item) => item.serviceId === -1).length === 0) {
        services.push({ serviceId: -1, serviceName: 'Dịch vụ khác' });
      }
      return services;
    },
    newGroup() {
      const newGroupData = this.$store.state.vendor.group.newGroup;
      if (
        newGroupData.services.filter((item) => item.serviceName.toLowerCase().trim() === 'điện')
          .length === 0
      ) {
        const electricService = this.allServices.find(
          (item) => item.serviceName.toLowerCase().trim() === 'điện',
        );
        if (electricService) {
          newGroupData.services.push({
            serviceId: electricService.serviceId,
            serviceName: electricService.serviceName,
            price: '',
            timeUnit: '1 tháng',
            userUnit: 'Kwh',
            isRequired: true,
          });
        }
      }
      if (
        newGroupData.services.filter((item) => item.serviceName.toLowerCase().trim() === 'nước')
          .length === 0
      ) {
        const waterService = this.allServices.find(
          (item) => item.serviceName.toLowerCase().trim() === 'nước',
        );
        if (waterService) {
          newGroupData.services.push({
            serviceId: waterService.serviceId,
            serviceName: waterService.serviceName,
            price: '',
            timeUnit: '1 tháng',
            userUnit: 'khối',
            isRequired: true,
          });
        }
      }
      return newGroupData;
    },
  },
  methods: {
    ...mapActions({
      getAllServices: 'renter/common/getAllServices1',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    initRequiredService() {
      const electricService = this.allServices.find(
        (item) => item.serviceName.toLowerCase().trim() === 'điện',
      );
      if (electricService) {
        this.newGroup.services.push({
          serviceId: electricService.serviceId,
          serviceName: electricService.serviceName,
          price: '',
          timeUnit: '',
          userUnit: '',
          isRequired: true,
        });
      }
      const waterService = this.allServices.find(
        (item) => item.serviceName.toLowerCase().trim() === 'nước',
      );
      if (waterService) {
        this.newGroup.services.push({
          serviceId: waterService.serviceId,
          serviceName: waterService.serviceName,
          price: '',
          timeUnit: '',
          userUnit: '',
          isRequired: true,
        });
      }
    },
    addNewService() {
      this.initUnselectedServices();
      this.newGroup.services.push({
        serviceId: this.unselectedService[0].serviceId,
        serviceName: this.unselectedService[0].serviceName,
        price: '',
        timeUnit: '1 tháng',
        userUnit: 'phòng',
        isRequired: true,
      });
    },
    inputDownPayment(index) {
      if (this.isValidPrice(this.newGroup.services[index].price)) {
        this.newGroup.services[index].price = this.formatCurency(
          this.newGroup.services[index].price.replaceAll('.', ''),
        );
      }
    },
    isValidPrice(price) {
      const pattern = /\b[0-9]+\b/;
      let result = true;
      if (String(price).trim() === '') {
        this.priceError = 'Vui lòng điền giá tiền';
        result = false;
      } else if (!pattern.test(price.replaceAll('.', ''))) {
        this.priceError = 'Không hợp lệ';
        result = false;
      }
      // else if (userUnit.trim() !== '') {
      //   this.priceError = 'Vui lòng điền đơn vị thanh toán';
      //   result = false;
      // }
      return result;
    },
    formatCurency(price) {
      const format = price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return format;
    },
    initUserUnit() {
      if (this.addNew.serviceId) {
        const { serviceName } = this.allServices.find(
          (service) => service.serviceId === Number(this.addNew.serviceId),
        );
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
      } else {
        this.addNew.serviceId = 0;
      }
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
    isRequiredService(serviceName) {
      return (
        serviceName.toLowerCase().trim() === 'điện' || serviceName.toLowerCase().trim() === 'nước'
      );
    },
    initUnselectedServices() {
      let services = this.allServices;
      this.newGroup.services.forEach((item) => {
        if (item.serviceId !== -1) {
          services = services.filter((service) => service.serviceId !== item.serviceId);
        }
      });
      this.unselectedService = services;
    },
    selectService(index) {
      if (this.newGroup.services[index].serviceId === -1) {
        this.newGroup.services[index].serviceName = '';
      }
    },
  },
  created() {
    if (this.unselectedService.length === 0) {
      this.unselectedService = this.allServices;
    }
  },
};
</script>

<style>
.addnew-service .v-input__slot {
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  border-right: 0px solid !important;
}
.other-service .v-input__slot {
  border-color: rgba(0, 0, 0, 0.4) !important;
}
.userUnit-textfield .v-input__slot {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-left: 0px solid !important;
  border-bottom-right-radius: 4px !important;
  border: 0px !important;
  background-color: rgba(57, 175, 209, 0.25) !important;
}
.userUnit-textfield .v-icon.v-icon {
  font-size: 15px !important;
  color: #6c757d !important;
}
.other-service-textfield .v-icon.v-icon {
  font-size: 15px !important;
  color: #6c757d !important;
}
.other-service-textfield .v-input__slot {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-left: 0px solid !important;
  border-bottom-right-radius: 4px !important;
  border: 0px !important;
  /* background-color: rgba(57, 175, 209, 0.25) !important; */
}
.userUnit-textfield .v-text-field__prefix,
.v-text-field__suffix {
  color: #39afd1 !important;
  padding-top: 2px !important;
}
.other-service-textfield .v-text-field__prefix,
.v-text-field__suffix {
  color: #39afd1 !important;
  padding-top: 4px !important;
}
.userUnit-textfield.theme--light.v-input input,
.theme--light.v-input textarea {
  color: #39afd1 !important;
}
.other-service-textfield.theme--light.v-input input,
.theme--light.v-input textarea {
  color: #39afd1 !important;
}
.userUnit-textfield.v-text-field--filled.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot {
  min-height: 38px !important;
}
.form .v-text-field__prefix,
.v-text-field__suffix {
  color: #727cf5 !important;
  padding-top: 2px !important;
}
.otherService .v-text-field__prefix,
.v-text-field__suffix {
  color: #727cf5 !important;
  font-family: 'Nunito', sans-serif !important;
  padding-top: 2px !important;
  font-size: 0.9rem !important;
}
.service-checkbox .theme--light.v-label {
  color: #727cf5 !important;
  font-size: 0.875rem !important;
  font-family: 'Nunito', sans-serif !important;
  font-weight: bold !important;
}
.service-box-textfield .v-input__slot {
  border: none !important;
}
.service-item:hover {
  background-color: #f1f3fa;
}
.small-label .v-label {
  font-size: 0.875rem !important;
}
</style>
