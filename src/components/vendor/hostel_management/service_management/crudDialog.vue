<template>
  <v-dialog v-model="dialog.addGroupService" hide-overlay persistent max-width="600px">
    <v-card>
      <v-card-title
        style="
          background-color: #727cf5 !important;
          box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
        "
      >
        <span class="white--text font-nunito">Thêm dịch vụ mới</span>
      </v-card-title>
      <v-card-text>
        <v-container>
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
            <v-col cols="6" class="pt-0 pr-0">
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
          @click="dialog.addGroupService = false"
        >
          Hủy
        </v-btn>
        <v-btn class="btn btn-primary font-nunito" @click="addService()"> Thêm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'crudDialog',
};
</script>

<style>
</style>
