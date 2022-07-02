<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      max-width="1000"
      scrollable
      transition="dialog-bottom-transition"
      fullscreen
      persistent
    >
      <v-overlay :value="isLoading" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card
        class="d-flex flex-column white"
        v-if="!isLoading"
        style="border-radius: 0px !important"
      >
        <v-card
          class="d-flex px-4 py-3 align-center ma-0 justify-space-between main-bg"
          style="
            border-color: rgb(255, 255, 255);
            box-shadow: rgba(154, 161, 171, 0.15) 0px 0px 35px 0px !important;
            border-radius: 0px !important;
          "
        >
          <v-icon class="ml-4" color="rgb(255, 255, 255, 0.8)">mdi-home-group</v-icon>

          <span
            class="font-nunito white--text font-weight-bold"
            style="font-size: 1.125rem !important"
            >Thêm khu trọ mới
          </span>
          <v-btn icon @click="closeDialog()" class="mr-4"
            ><v-icon color="rgb(255, 255, 255, 0.75)">close</v-icon></v-btn
          >
        </v-card>
        <v-stepper v-model="e1">
          <v-stepper-header class="ma-auto px-16">
            <template v-for="n in stepHeader.length">
              <v-stepper-step :key="`${n}-step`" :complete="e1 > n" :step="n" color="#727cf5">
                <span class="font-nunito size9rem text-gray">{{ stepHeader[n - 1] }}</span>
              </v-stepper-step>
              <v-divider v-if="n !== stepHeader.length" :key="n"></v-divider>
            </template>
          </v-stepper-header>
          <v-stepper-content step="1" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pb-3 px-10 my-0"
              max-height="430"
              min-height="430"
              style="box-shadow: none !important"
            >
              <v-row class="ma-0 d-flex justify-space-between">
                <v-col cols="9" class="py-0 pr-md-10">
                  <v-row class="ma-0">
                    <v-col cols="5" class="d-flex flex-column pb-0">
                      <span class="field-name"
                        >Tên khu trọ<span class="red--text ml-1">(*)</span></span
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
                    <v-col cols="4" class="d-flex flex-column pb-0">
                      <span class="field-name font-weight-medium"
                        >Hình thức cho thuê<span class="red--text ml-1">(*)</span></span
                      >
                      <v-select
                        v-model="newGroupValue.categoryId"
                        @change="(newGroupValue.types = []), setNewGroupValue(newGroupValue)"
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
                    <v-col cols="3" class="d-flex align-end pb-0">
                      <v-checkbox
                        v-model="newGroupValue.ownerJoin"
                        @click="setNewGroupValue(newGroupValue)"
                        label="Chung chủ"
                        color="#727cf5"
                        class="filter font-nunito size-sub-2 checkbox ma-0"
                        hide-details
                        v-if="getCategoryById().categoryName.toLowerCase() !== 'nhà nguyên căn'"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" v-show="check && error.name" class="py-0">
                      <span class="font-nunito red--text size-caption"
                        >Vui lòng điền tên khu trọ</span
                      >
                    </v-col>
                    <v-col cols="9" class="d-flex flex-column mt-3">
                      <span class="field-name font-weight-medium"
                        >Địa chỉ cho thuê<span class="red--text ml-1">(*)</span>
                        <span class="font-nunito size-caption text-gray ml-2 mt-auto"
                          >Để lấy vị trí chính xác, vui lòng nhập địa chỉ đầy đủ rõ 5 cấp.</span
                        ></span
                      >
                      <gmap-autocomplete
                        placeholder="Bao gồm số nhà, tên đường, phường, quận, thành phố"
                        @place_changed="setPlace"
                        :options="gmap"
                        :selectFirstOnEnter="true"
                        style="
                          border: 1px solid #dee2e6 !important;
                          border-radius: 4px;
                          height: 38px !important;
                        "
                        class="address-autocomplete px-3"
                      ></gmap-autocomplete>
                    </v-col>
                    <v-col cols="3" class="d-flex flex-column mt-3">
                      <span class="field-name font-weight-medium d-flex align-center font-nunito"
                        >Số tiền cọc giữ phòng<span class="red--text ml-1">(*)</span>
                      </span>
                      <v-text-field
                        dense
                        label="Giá tiền"
                        class="py-0 form size-sub-2 font-nunito my-0"
                        solo
                        hide-details
                        v-model="newGroupValue.downPayment"
                        suffix="VNĐ"
                        @input="inputDownPayment(newGroupValue.downPayment)"
                      />
                    </v-col>
                    <v-col cols="12" class="d-flex flex-column py-0">
                      <span class="size-caption red--text font-nunito">{{
                        errorMsg.buildingNo
                      }}</span>
                    </v-col>
                    <v-col cols="9" class="d-flex">
                      <span class="field-name mt-1"
                        >Khung giờ đóng cửa:<span class="red--text ml-1">(*)</span></span
                      >
                      <div class="d-flex ml-5 justify-center">
                        <v-radio-group
                          v-model="groupInfo.curfewTime.radiogroup"
                          hide-details
                          class="filter my-0"
                          @change="setCurfewtime()"
                          v-if="showCurfewTime"
                        >
                          <v-radio
                            label="Giới nghiêm"
                            value="limit"
                            color="#727cf5"
                            class="radioGroup font-nunito"
                          ></v-radio>
                          <v-radio
                            label="Giờ giấc tự do"
                            value="free"
                            color="#727cf5"
                            class="radioGroup font-nunito"
                          ></v-radio>
                        </v-radio-group>
                        <v-radio-group
                          v-model="groupInfo.curfewTime.radiogroup"
                          hide-details
                          class="filter my-0"
                          @change="setCurfewtime()"
                          v-if="!showCurfewTime"
                          row
                        >
                          <v-radio
                            label="Giới nghiêm"
                            value="limit"
                            color="#727cf5"
                            class="radioGroup font-nunito"
                          ></v-radio>
                          <v-radio
                            label="Giờ giấc tự do"
                            value="free"
                            color="#727cf5"
                            class="radioGroup font-nunito"
                          ></v-radio>
                        </v-radio-group>
                      </div>
                      <div class="d-flex ml-auto mb-6" v-if="showCurfewTime">
                        <div class="pt-0 d-flex flex-column mr-2">
                          <v-autocomplete
                            v-model="newGroupValue.curfewTime.startTime"
                            :items="getTimes('00:00', '23:30', 'asc')"
                            label="Mở cổng"
                            class="size9rem font-nunito light-autocomplete my-0 py-0 pr-0"
                            outlined
                            dense
                            color="indigo"
                            hide-details
                            background-color="white"
                            no-data-text="Không có kết quả phù hợp"
                            style="border-radius: 4px; width: 130px !important"
                          ></v-autocomplete>
                          <span
                            class="font-nunito red--text size-caption"
                            v-show="check && error.startTime"
                            >Vui lòng chọn giờ mở cổng</span
                          >
                        </div>
                        <div cols="4" class="pt-0 d-flex flex-column ml-2">
                          <v-autocomplete
                            v-model="newGroupValue.curfewTime.endTime"
                            :items="getTimes('00:30', '24:00', 'desc')"
                            label="Đóng cổng"
                            class="size9rem font-nunito light-autocomplete my-0 py-0"
                            outlined
                            dense
                            color="indigo"
                            hide-details
                            background-color="white"
                            no-data-text="Không có kết quả phù hợp"
                            style="border-radius: 4px; width: 130px !important"
                          ></v-autocomplete>
                          <span
                            class="font-nunito red--text size-caption"
                            v-show="check && error.endTime"
                            >Vui lòng chọn giờ đóng cổng</span
                          >
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="3" class="d-flex flex-column" v-if="gender.length > 0">
                      <v-select
                        v-model="ruleGender"
                        :items="gender"
                        item-text="regulationName"
                        item-value="regulationId"
                        label="Giới tính người thuê"
                        dense
                        hide-details
                        outlined
                        class="size-sub-2 font-nunito dropdownSmall light-autocomplete"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="d-flex py-0">
                      <span class="font-nunito size9rem text-primary font-weight-bold mt-5"
                        >Nội quy :</span
                      >
                      <v-col cols="6" class="d-flex flex-column justify-center">
                        <v-autocomplete
                          v-model="ruleSelect"
                          :items="unselectedRules"
                          label="Tìm kiếm theo tên nội quy có sẵn"
                          item-text="regulationName"
                          item-value="regulationId"
                          class="size9rem font-nunito light-autocomplete"
                          dense
                          solo
                          clearable
                          color="#727cf5"
                          hide-details
                          background-color="#F1F3FA"
                          no-data-text="Điền nội quy khác và nhấn Bổ sung nội quy nếu nội quy không có sẵn"
                          hide-selected
                          rounded
                          @change="addRule()"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="4" class="d-flex flex-column">
                        <div class="d-flex">
                          <v-text-field
                            label="Nội quy khác"
                            v-model="newRule"
                            solo
                            hide-details
                            class="text-muted size-sub-2 light-text-field font-nunito"
                            style="border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                          ></v-text-field>
                          <v-btn
                            class="btn-success btn-sm font-nunito white--text"
                            @click="addNewRules()"
                            style="
                              border-top-left-radius: 0px !important;
                              border-bottom-left-radius: 0px !important;
                            "
                            >Bổ sung</v-btn
                          >
                        </div>
                        <span class="size-caption red--text font-nunito" v-show="isDuplicate"
                          >Nội quy đã tồn tại</span
                        >
                      </v-col>
                    </v-col>
                    <v-col
                      cols="12"
                      class="py-0"
                      v-if="
                        newGroupValue.regulations.length > 0 ||
                        newGroupValue.newRegulations.length > 0
                      "
                    >
                      <v-card class="d-flex flex-wrap py-3" outlined>
                        <div
                          v-for="(item, index) in newGroupValue.newRegulations"
                          v-bind:key="index"
                          class="font-nunito size-sub-3 mx-1 mb-2 py-1 d-flex align-center"
                          style="
                            border-radius: 1rem;
                            border: 1px solid #cccccc;
                            text-align: center;
                            position: relative;
                          "
                        >
                          <v-hover v-slot="{ hover }">
                            <div>
                              <span class="mx-2">{{ item.regulationName }}</span>
                              <v-expand-transition>
                                <v-icon
                                  size="25"
                                  color="#fff"
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out cursor"
                                  style="
                                    height: 100%;
                                    width: 100%;
                                    position: absolute;
                                    top: 0;
                                    background-color: rgba(0, 0, 0, 0.45);
                                    border-radius: 1rem;
                                  "
                                  @click="removeNewRegulation(index)"
                                >
                                  mdi-delete-forever
                                </v-icon>
                              </v-expand-transition>
                            </div>
                          </v-hover>
                        </div>
                        <div
                          v-for="item in newGroupValue.regulations"
                          v-bind:key="item.regulationId"
                          class="font-nunito size-sub-3 mx-1 mb-2 py-1 d-flex align-center"
                          style="
                            border-radius: 1rem;
                            border: 1px solid #cccccc;
                            text-align: center;
                            position: relative;
                          "
                        >
                          <v-hover v-slot="{ hover }">
                            <div>
                              <span class="mx-2">{{ getRuleById(item.regulationId) }}</span>
                              <v-expand-transition>
                                <v-icon
                                  size="25"
                                  color="#fff"
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out cursor"
                                  style="
                                    height: 100%;
                                    width: 100%;
                                    position: absolute;
                                    top: 0;
                                    background-color: rgba(0, 0, 0, 0.45);
                                    border-radius: 1rem;
                                  "
                                  @click="removeRegulation(item.regulationId)"
                                >
                                  mdi-delete-forever
                                </v-icon>
                              </v-expand-transition>
                            </div>
                          </v-hover>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="3" class="d-flex flex-column pa-0">
                  <v-row class="ma-0">
                    <v-col cols="12" class="pb-0">
                      <v-card outlined min-height="220" max-height="220">
                        <v-col cols="12" class="d-flex flex-column px-5">
                          <span
                            class="font-nunito size9rem text-primary font-weight-bold"
                            style="text-align: center"
                            >Quản lý / Người liên lạc
                            <v-tooltip right>
                              <template v-slot:activator="{ on, attrs }">
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                  class="red--text font-nunito font-weight-bold ml-2"
                                  >?</span
                                >
                              </template>
                              <span class="font-nunito"
                                >Là người có thể liên lạc khi tới xem phòng, nếu là chủ trọ, bạn có
                                thể để trống</span
                              >
                            </v-tooltip></span
                          >
                          <v-row class="ma-0 mt-5">
                            <v-col cols="12" class="d-flex flex-column">
                              <v-text-field
                                class="size-sub-2 form light-autocomplete"
                                color="#727cf5"
                                label="Tên quản lý"
                                solo
                                dense
                                hide-details
                                light
                                v-model="newGroupValue.managerName"
                                @input="setNewGroupValue(newGroupValue)"
                                background-color="#f1f3fa"
                              />
                            </v-col>
                            <v-col cols="12" class="d-flex flex-column py-0">
                              <span
                                class="font-nunito red--text size-caption"
                                v-show="check && error.manageName"
                                >Vui lòng điền tên người liên lạc</span
                              >
                            </v-col>
                            <v-col cols="12" class="d-flex flex-column">
                              <v-text-field
                                class="size-sub-2 form light-autocomplete"
                                color="#727cf5"
                                label="Số điện thoại"
                                solo
                                dense
                                light
                                hide-details
                                v-model="newGroupValue.managerPhone"
                                @input="setNewGroupValue(newGroupValue)"
                                background-color="#f1f3fa"
                              />
                            </v-col>
                            <v-col cols="12" class="d-flex flex-column py-0">
                              <span
                                class="font-nunito red--text size-caption"
                                v-show="check && error.managePhone"
                                >Vui lòng điền số điện thoại người liên lạc</span
                              >
                              <span
                                class="font-nunito red--text size-caption"
                                v-show="check && error.validPhone"
                                >Số điện thoại không hợp lệ</span
                              >
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <v-card outlined min-height="150" max-height="150">
                        <v-col cols="12" class="d-flex flex-column px-5">
                          <span class="field-name font-weight-medium">Ảnh đại diện khu trọ</span>
                          <AvatarManagement />
                        </v-col>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-spacer></v-spacer>
              <v-btn class="btn btn-primary font-nunito mx-2" @click="nextStep2()">
                Tiếp tục
              </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content>
          <v-stepper-content step="2" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pt-1 pb-3 px-16 my-0"
              max-height="430"
              min-height="430"
              style="box-shadow: none !important"
              v-bind:style="
                getCategoryById().categoryName.toLowerCase() !== 'nhà nguyên căn'
                  ? 'background-color: #f1f3fa;'
                  : 'background-color: #fff;'
              "
            >
              <WholeHouseCategory
                v-if="getCategoryById().categoryName.toLowerCase() === 'nhà nguyên căn'"
              />
              <HostelRoomCategory
                v-if="getCategoryById().categoryName.toLowerCase() === 'nhà cho thuê phòng'"
              />
              <HostelBedCategory
                v-if="getCategoryById().categoryName.toLowerCase() === 'ký túc xá'"
              />
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-btn class="btn btn-light elevation-0 font-nunito mx-2" @click="e1 = 1"
                >Quay lại</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                class="btn btn-primary font-nunito mx-2"
                :disabled="newGroupValue.errorHostelRoom.length > 0"
                @click="nextStep3()"
                v-if="getCategoryById().categoryName.toLowerCase() === 'nhà cho thuê phòng'"
              >
                Tiếp tục
              </v-btn>
              <v-btn
                class="btn btn-primary font-nunito mx-2"
                @click="nextStep3()"
                v-if="getCategoryById().categoryName.toLowerCase() === 'nhà nguyên căn'"
                _disabled="!validWholeHouseData()"
              >
                Tiếp tục
              </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content>
          <v-stepper-content step="3" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pt-1 pb-3 px-16 my-0"
              max-height="430"
              min-height="430"
              style="box-shadow: none !important"
            >
              <ServiceManagement />
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-btn class="btn btn-light elevation-0 font-nunito mx-2" @click="e1 = 2"
                >Quay lại</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn class="btn btn-primary font-nunito mx-2" @click="nextStep4()">
                Tiếp tục
              </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content>
          <!-- <v-stepper-content step="3" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pt-1 pb-3 px-10 my-0"
              max-height="370"
              min-height="370"
              style="box-shadow: none !important"
            >
              <RegulationManagement />
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-btn class="btn btn-light elevation-0 font-nunito mx-2" @click="e1 = 2"
                >Quay lại</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn class="btn btn-primary font-nunito mx-2" @click="e1 = 4"> Tiếp tục </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content> -->
          <v-stepper-content step="4" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pt-1 pb-3 px-10 my-0"
              max-height="430"
              min-height="430"
              style="box-shadow: none !important"
            >
              <InitSchedule />
            </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-btn class="btn btn-light elevation-0 font-nunito mx-2" @click="e1 = 3"
                >Quay lại</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn class="btn btn-primary font-nunito mx-2" @click="nextContractStep()">
                Tiếp tục
              </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content>
          <!-- <v-stepper-content step="4" class="pa-0 mt-2">
            <v-card
              class="overflow-y-auto d-flex flex-column pt-1 pb-3 px-10 my-0"
              max-height="370"
              min-height="370"
              style="box-shadow: none !important"
            >
              <AppendixContract />
              <span>Phụ lục hợp đồng</span>
          <TextEditor
                @appendixContent="receiveAppendixContent"
                :editorContent="downloadedAppendixContract"
              />
          </v-card>
            <v-divider></v-divider>
            <div class="d-flex px-4 py-3">
              <v-btn class="btn btn-light elevation-0 font-nunito mx-2" @click="e1 = 4"
                >Quay lại</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn class="btn btn-primary font-nunito mx-2" @click="insertGroup()"> Lưu </v-btn>
              <v-btn
                class="btn btn-outline-primary elevation-0 font-nunito mx-2"
                @click="closeDialog()"
                >Đóng</v-btn
              >
            </div>
          </v-stepper-content> -->
        </v-stepper>
      </v-card>
    </v-dialog>
    <v-dialog v-model="warningDialog" max-width="400" hide-overlay>
      <v-card>
        <v-card-title class="d-flex flex-column justify-center px-8">
          <v-icon large class="material-icons-outlined" color="#ffbc00">report_problem</v-icon>
          <span
            class="text-gray font-nunito mt-2"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
              padding: 0px 20px 0px;
            "
            >{{ warningTitle }}</span
          >
        </v-card-title>
        <div
          class="font-nunito"
          style="
            font-size: 0.9rem;
            font-weight: 400;
            text-align: center !important;
            padding: 0px 20px 20px;
            color: #ffbc00;
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
import InitSchedule from './InitSchedule.vue';
import AvatarManagement from './AvatarManagement.vue';
import WholeHouseCategory from '../category/WholeHouse.vue';
import HostelRoomCategory from '../category/Hostel_Room.vue';
import HostelBedCategory from '../category/Hostel_Bed.vue';
// import AppendixContract from './AppendixContract.vue';
// import TextEditor from '../../contract/TextEditor.vue';

export default {
  name: 'CreateGroupDialog',
  props: ['show'],
  components: {
    ServiceManagement,
    InitSchedule,
    AvatarManagement,
    WholeHouseCategory,
    HostelRoomCategory,
    HostelBedCategory,
    // TextEditor,
    // AppendixContract,
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
      appendixContract: null,
    },
    downloadedAppendixContract: null,
    e1: 1,
    // stepHeader: ['Thông tin', 'Dịch vụ', 'Lịch rảnh', 'Hợp đồng mẫu'],
    stepHeader: ['Thông tin Khu trọ', 'Chi tiết các phòng', 'Phí dịch vụ', 'Lịch rảnh'],
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
        return value > 0;
      },
      minPrice(value) {
        return value >= 0;
      },
      maxSuperficiality(value) {
        return value <= 50;
      },
      maxCapacity(value) {
        return value <= 20;
      },
      maxDeposit(value) {
        return value <= 12;
      },
      maxEmptyRooms(value, maxValue) {
        return value <= maxValue;
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
    warningDialog: false,
    warningTitle: '',
    emptyElement: '',
    errorMsg: {
      fullAddres: '',
      buildingNo: '',
    },
    check: false,
    ruleGender: -1,
    ruleSelect: '',
    unselectedRules: [],
    newRule: '',
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
      getAllFacilities: 'renter/common/getAllFacilities1',
      createListHostelType: 'vendor/group/createListHostelType',
    }),
    setGender() {
      if (this.ruleGender !== -1) {
        this.newGroupValue.regulations.push({ regulationId: this.ruleGender });
        this.setNewGroupValue(this.newGroupValue);
      }
    },
    addRule() {
      this.newGroupValue.regulations.push({ regulationId: this.ruleSelect });
      this.initUnselectedRules();
    },
    initUnselectedRules() {
      let rules = this.allRules;
      rules = rules.filter((item) => !item.regulationName.toLowerCase().includes('giới tính'));
      this.newGroupValue.regulations.forEach((item) => {
        rules = rules.filter((rule) => rule.regulationId !== item.regulationId);
      });
      this.unselectedRules = rules;
    },
    addNewRules() {
      if (this.newRule.trim() !== '' && !this.isDuplicate) {
        this.newGroupValue.newRegulations.unshift({ regulationName: this.newRule });
        this.newRule = '';
      }
    },
    getRuleById(id) {
      return this.allRules.find((item) => item.regulationId === id).regulationName;
    },
    receiveAppendixContent(content) {
      this.newGroupValue.appendixContract = content;
      this.setNewGroupValue(this.newGroupValue);
    },
    nextStep2() {
      this.check = true;
      if (
        // this.getAddress() !== false &&
        !this.error.name &&
        !this.error.startTime &&
        !this.error.endTime &&
        !this.error.managerName &&
        !this.error.managerPhone &&
        !this.error.validPhone
      ) {
        this.e1 = 2;
        console.log(this.newGroupValue);
        console.log(this.addressObjForApi);
      }
    },
    nextStep3() {
      console.log(this.newTypeValue);
      console.log(this.newGroupValue);
      console.log(this.validWholeHouseData());
      if (
        this.getCategoryById().categoryName.toLowerCase() === 'nhà nguyên căn' &&
        this.validWholeHouseData()
      ) {
        this.e1 = 3;
      } else if (
        this.getCategoryById().categoryName.toLowerCase() === 'nhà cho thuê phòng' &&
        this.newGroupValue.errorHostelRoom.length === 0
      ) {
        this.e1 = 3;
      }
    },
    validWholeHouseData() {
      let flat = 0;
      this.newGroupValue.types.forEach((newType) => {
        if (newType.title.trim() === '' || Number(newType.roomsNumber) < 1) {
          flat += 1;
        }
      });
      if (this.newGroupValue.types.length === 0) {
        flat += 1;
      }
      if (
        this.newTypeValue.superficiality.trim() === '' ||
        Number(this.newTypeValue.superficiality) < 1
      ) {
        flat += 1;
      }
      if (this.newTypeValue.price.trim() === '' || Number(this.newTypeValue.price) < 0) {
        flat += 1;
      }
      if (
        String(this.newTypeValue.deposit).trim() === '' ||
        Number(this.newTypeValue.deposit) < 0
      ) {
        flat += 1;
      }
      return flat === 0;
    },
    nextContractStep() {
      const emptyDay = this.newGroupValue.schedules.filter((item) => item.timeRange.length === 0);
      if (emptyDay.length === 7) {
        this.warningTitle = 'Hãy cài đặt lịch rảnh ít nhất 1 ngày trong tuần!';
        this.emptyElement =
          'Cài đặt lịch rảnh các ngày trong tuần để người thuê có thể gặp bạn hoặc quản lý của khu trọ để xem phòng trọ.';
        this.warningDialog = true;
      } else {
        // this.e1 = 5;
        this.insertGroup();
      }
    },
    nextStep4() {
      if (this.newGroupValue.services.length === 0) {
        this.warningTitle = 'Vui lòng điền các dịch vụ tính tiền ở khu trọ của bạn!';
        this.emptyElement = '';
        this.warningDialog = true;
      } else {
        this.e1 = 4;
      }
    },
    closeDialog() {
      this.e1 = 1;
      this.newGroupValue = {
        services: [],
        avatar: null,
        regulation: [],
        newRegulations: [],
        groupName: '',
        categoryId: null,
        ownerJoin: false,
        curfewTime: {
          limit: false,
          startTime: '',
          endTime: '',
        },
        managerName: null,
        managerPhone: null,
        downPayment: 0,
        buildingNo: '',
        latitude: 0,
        longitude: 0,
        address: null,
        schedules: [],
      };
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
      this.addressString = `${this.place.formatted_address}`;
      this.newGroupValue.latitude = this.place.geometry.location.lat();
      this.newGroupValue.longitude = this.place.geometry.location.lng();
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
    findProvinceByName(provinceName) {
      return this.provinces.data.find(
        (item) =>
          item.toLowerCase().includes(provinceName) || provinceName.includes(item.toLowerCase()), // eslint-disable-line
      );
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
        const include =
          s.streetName.trim().toLowerCase().includes(streetName.trim().toLowerCase()) ||
          streetName.trim().toLowerCase().includes(s.streetName.trim().toLowerCase());
        return include;
      });
      return street;
    },
    insertGroup() {
      this.newGroupValue.statePrice.forEach((item) => {
        this.newGroupValue.services[item].price = -1;
      });
      const groupService = this.newGroupValue.services
        .filter((item) => item.serviceId)
        .map((item) => ({
          serviceId: item.serviceId,
          price:
            item.price !== -1 && item.price !== -2
              ? this.getPriceUnit(item.price.replaceAll('.', '')).servicePrice // eslint-disable-line
              : item.price, // eslint-disable-line
          priceUnit:
            item.price !== -1 && item.price !== -2
              ? this.getPriceUnit(item.price.replaceAll('.', '')).servicePriceUnit // eslint-disable-line
              : null, // eslint-disable-line
          timeUnit: item.timeUnit,
          userUnit: item.price !== -1 && item.price !== -2 ? item.userUnit : null,
          isRequired: item.isRequired,
        }));
      const newGroupServices = this.newGroupValue.services
        .filter((item) => !item.serviceId)
        .map((item) => ({
          price:
            item.price !== -1 && item.price !== -2
              ? this.getPriceUnit(item.price.replaceAll('.', '')).servicePrice // eslint-disable-line
              : item.price, // eslint-disable-line
          priceUnit:
            item.price !== -1 && item.price !== -2
              ? this.getPriceUnit(item.price.replaceAll('.', '')).servicePriceUnit // eslint-disable-line
              : null, // eslint-disable-line
          timeUnit: item.timeUnit,
          userUnit: item.price !== -1 && item.price !== -2 ? item.userUnit : null,
          serviceName: item.serviceName,
          isRequired: item.isRequired,
        }));
      const reqObj = {
        address: this.addressObjForApi,
        appendixContract: this.newGroupValue.appendixContract,
        buildingNo: this.addressObjForApi.buildingNo,
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
        regulations: this.newGroupValue.regulations,
        newRegulations: this.newGroupValue.newRegulations.map((item) => ({
          regulationName: item,
        })),
        schedules: this.newGroupValue.schedules
          .filter((item) => item.timeRange.length > 0)
          .map((item) => ({ scheduleId: item.scheduleId, timeRange: item.timeRange })),
        services: groupService,
        newServices: newGroupServices,
        vendorId: this.user.userId,
      };
      if (this.ruleGender !== -1) {
        reqObj.regulations.push(this.ruleGender);
      }
      this.createHostelGroup(reqObj).then(() => {
        if (this.isCreatedGroupStatus) {
          if (this.getCategoryById().categoryName.toLowerCase() === 'nhà cho thuê phòng') {
            this.createTypeWithHostelRoomCategory();
          }
          if (this.getCategoryById().categoryName.toLowerCase() === 'nhà nguyên căn') {
            this.createTypeWithWholeHouseCategory();
          }
        } else {
          console.log('not success');
        }
      });
      console.log(reqObj);
    },
    createTypeWithWholeHouseCategory() {
      const { groupId } = this.allGroups[0];
      let totalRoom = '';
      this.newGroupValue.types.forEach((item) => {
        totalRoom += `${item.roomsNumber} ${item.title} | `;
      });
      const type = [
        {
          capacity: this.newTypeValue.capacity,
          deposit: this.newTypeValue.deposit,
          facilities: this.newTypeValue.facilityIds.map((item) => ({
            facilityId: item,
          })),
          newFacilities: this.newTypeValue.newFacilities.map((item) => ({
            facilityName: item,
            quantity: 1,
          })),
          imageUrls: this.newTypeValue.image,
          price: this.newTypeValue.price,
          priceUnit: this.newTypeValue.priceUnit,
          superficiality: this.newTypeValue.superficiality,
          title: 'Nhà nguyên căn',
          description: totalRoom,
          rooms: [
            {
              roomName: '01',
              available: true,
            },
          ],
        },
      ];
      const types = { groupID: groupId, list: type };
      this.createListHostelType(types).then(() => {
        if (this.isCreatedTypesStatus) {
          this.closeDialog();
        } else {
          console.log('not type succes');
        }
      });
    },
    createTypeWithHostelRoomCategory() {
      const { groupId } = this.allGroups[0];
      const listTypes = this.newGroupValue.types.map((item) => ({
        capacity: item.capacity,
        deposit: item.deposit,
        facilities: this.getTypeFacilities(item.facilities).systemFacilities,
        newFacilities: this.getTypeFacilities(item.facilities).newFacilities,
        imageUrls: item.image,
        price: item.price,
        priceUnit: item.priceUnit,
        superficiality: item.superficiality,
        title: item.title,
        rooms: item.rooms.map((room) => ({
          roomName: room.roomName,
          available: room.available === 0,
        })),
      }));
      const types = { groupID: groupId, list: listTypes };
      this.createListHostelType(types).then(() => {
        if (this.isCreatedTypesStatus) {
          this.closeDialog();
        } else {
          console.log('not type succes');
        }
      });
    },
    getTypeFacilities(allFacilities) {
      let systemFacilities = allFacilities.filter((item) => item.facilityName);
      systemFacilities = systemFacilities.map((item) => ({
        facilityId: this.getFacilityByName(item.facilityName).facilityId,
      }));
      let newFacilities = allFacilities.filter((item) => !item.facilityName);
      newFacilities = newFacilities.map((item) => ({
        facilityName: item,
      }));
      return { systemFacilities, newFacilities };
    },
    getFacilityByName(facilityName) {
      return this.allFacilities.find((item) => item.facilityName === facilityName);
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
      this.errorMsg.buildingNo = ' ';
      if (this.place.address_components) {
        if (
          this.place.formatted_address
            .split(',')
            .reverse()[1]
            .toLowerCase() // eslint-disable-line
            .includes('hồ chí minh')
        ) {
          let { province, districtName, wardName, streetName, buildingNumber } = ''; // eslint-disable-line
          this.place.address_components.forEach((item) => {
            if (item.types.includes('street_number') || item.types.includes('premise')) {
              buildingNumber = item.long_name;
            } else if (item.types.includes('route')) {
              streetName = item.long_name;
            } else if (item.types.includes('administrative_area_level_2')) {
              districtName = item.long_name;
            } else if (item.types.includes('administrative_area_level_1')) {
              province = item.long_name;
            } else if (item.types.includes('sublocality_level_1')) {
              wardName = item.long_name;
            }
          });
          console.log(!wardName, wardName);
          if (!buildingNumber && streetName) {
            buildingNumber =
              this.place.formatted_address.split(streetName)[0].trim() === ''
                ? this.place.formatted_address.split(streetName)[0].trim() // eslint-disable-line
                : null; // eslint-disable-line
          }
          if (!wardName) {
            const addressItem = this.place.formatted_address.split(',');
            wardName = addressItem.find((item) => item.toLowerCase().includes('phường'));
            if (!wardName) {
              const index = addressItem.findIndex((item) => item.includes(streetName));
              wardName = addressItem[index + 1];
            }
            // wardName = this.place.formatted_address.split(',')[1].trim();
            return { districtName, wardName, streetName, buildingNumber }; // eslint-disable-line
          }
          if (!streetName || !wardName || !province) {
            this.errorMsg.buildingNo = 'Địa chỉ không hợp lệ';
            console.log('vao');
            return false;
          }
        } else {
          this.errorMsg.buildingNo = 'Hệ thống tạm thời chỉ hỗ trợ địa bàn Thành phố Hồ Chí Minh';
          return false;
        }
      }
      this.errorMsg.buildingNo = 'Vui lòng điền địa chỉ chi tiết của khu trọ!';
      return false;
    },
    getTimes(from, to, sort) {
      const [fromH, fromM] = from.split(':').map((m) => Number(m));
      const [toH, toM] = to.split(':').map((m) => Number(m));
      const hourArr = [...Array(toH - fromH + 1)];
      const preSort = hourArr.flatMap((_, index) => {
        const indexHour = fromH + index;
        if (index === 0 && fromH === toH) {
          return fromM === 0 && toM < 30 // eslint-disable-line
            ? `${indexHour}:00` // eslint-disable-line
            : fromM === 0 && toM >= 30 // eslint-disable-line
            ? [`${indexHour}:00`, `${indexHour}:30`] // eslint-disable-line
            : fromM <= 30 && toM >= 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }
        if (index === 0) {
          return fromM === 0 // eslint-disable-line
            ? `${indexHour}:00` // eslint-disable-line
            : fromM <= 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }
        if (index === hourArr.length - 1) {
          return toM < 30 ? `${indexHour}:00` : [`${indexHour}:00`, `${indexHour}:30`];
        }
        return [`${indexHour}:00`, `${indexHour}:30`];
      });
      if (sort === 'desc') {
        return preSort.reverse();
      }
      return preSort;
    },
    downloadTemplate(url) {
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          this.downloadedAppendixContract = text;
        });
    },
    removeRegulation(regulationId) {
      this.newGroupValue.regulations = this.newGroupValue.regulations.filter(
        (item) => item.regulationId !== regulationId,
      );
    },
    removeNewRegulation(index) {
      this.newGroupValue.newRegulations = this.newGroupValue.newRegulations.filter(
        (_, i) => i !== index,
      );
    },
    getCategoryById() {
      return this.categories.find((item) => item.categoryId === this.newGroupValue.categoryId);
    },
    inputDownPayment(price) {
      if (this.isValidPrice(price)) {
        this.newGroupValue.downPayment = this.formatCurency(
          this.newGroupValue.downPayment.replaceAll('.', ''),
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
      return result;
    },
    formatCurency(price) {
      const format = price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return format;
    },
  },
  computed: {
    ...mapState({
      groups: (state) => state.vendor.group.groups,
    }),
    allGroups() {
      return this.$store.state.vendor.group.groups.data;
    },
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
    gender() {
      const genderRule = this.allRules.filter(
        (item) => item.regulationName.toLowerCase().includes('giới tính'), // eslint-disable-line
      ); // eslint-disable-line
      genderRule.forEach((item, index) => {
        if (item.regulationName.toLowerCase().trim() === 'giới tính: nam') {
          genderRule[index].regulationName = 'Chỉ Nam';
        } else if (item.regulationName.toLowerCase().trim() === 'giới tính: nữ') {
          genderRule[index].regulationName = 'Chỉ Nữ';
        } else {
          genderRule[index].regulationName = 'Nam và Nữ';
        }
      });
      return genderRule;
    },
    allSchedule() {
      return this.$store.state.renter.common.schedule.data;
    },
    allFacilities() {
      return this.$store.state.renter.common.facilities.data;
    },
    isLoading() {
      const allServices = this.$store.state.renter.common.services.isLoading;
      const allCategories = this.$store.state.renter.filterResult.filter.categories.isLoading;
      const allRules = this.$store.state.renter.common.rules.isLoading;
      const allSchedule = this.$store.state.renter.common.schedule.isLoading;
      const isCreatingGroup = this.$store.state.vendor.group.groups.isCreating;
      const isCreatingTypes = this.$store.state.vendor.group.types.isCreating;
      const allFacilities = this.$store.state.renter.common.facilities.isLoading;
      return (
        allServices ||
        allCategories ||
        allRules ||
        allSchedule ||
        isCreatingGroup ||
        allFacilities ||
        isCreatingTypes
      );
    },
    isCreatedGroupStatus() {
      return this.$store.state.vendor.group.groups.success;
    },
    isCreatedTypesStatus() {
      return this.$store.state.vendor.group.types.success;
    },
    newGroupValue() {
      const newGroupData = this.$store.state.vendor.group.newGroup;
      if (this.groupInfo.curfewTime.radiogroup === 'free') {
        newGroupData.curfewTime.limit = false;
      } else {
        newGroupData.curfewTime.limit = true;
      }
      const category = this.categories.find((item) => item.categoryId === newGroupData.categoryId);
      if (category && category.categoryName.toLowerCase() === 'nhà cho thuê phòng') {
        const error = [];
        newGroupData.types.forEach((type, i) => {
          const typeError = {
            index: i,
            deposit: false,
            price: false,
            rooms: false,
            roomNullError: [],
            roomDupplicateError: [],
            superficiality: false,
            title: false,
          };
          let flat = 0;
          if (type.title.trim() === '') {
            typeError.title = true;
            flat += 1;
          }
          if (type.capacity === 0 || type.capacity <= 0) {
            typeError.capacity = true;
            flat += 1;
          }
          if (type.deposit === '' || type.deposit < 0) {
            typeError.deposit = true;
            flat += 1;
          }
          if (type.superficiality === '' || type.superficiality <= 0) {
            typeError.superficiality = true;
            flat += 1;
          }
          if (type.price === '' || type.price < 0) {
            typeError.price = true;
            flat += 1;
          }
          if (type.rooms.length === 0) {
            typeError.rooms = true;
            flat += 1;
          } else {
            type.rooms.forEach((room, index) => {
              if (room.roomName.trim() === '') {
                flat += 1;
                typeError.roomNullError.push(index);
              } else if (
                type.rooms.filter(
                  (r) => r.roomName.toLowerCase().trim() === room.roomName.toLowerCase(),
                ).length >= 2
              ) {
                flat += 1;
                typeError.roomDupplicateError.push(index);
              }
            });
          }
          if (flat > 0) {
            error.push(typeError);
          }
        });
        newGroupData.errorHostelRoom = error;
      }
      return newGroupData;
    },
    ...mapState('renter/common', ['provinces', 'wards', 'districts', 'streets']),
    addressObjForApi() {
      const { districtName, wardName, streetName, buildingNumber } = this.getAddress(); // eslint-disable-line
      console.log(districtName, wardName, streetName, buildingNumber);
      const district = this.findDistrictByName(districtName);
      const ward = this.findWardByName(wardName, district.wards);
      const street = this.findStreetByName(streetName);
      const obj = {
        provinceId: 1,
        districtId: district.districtId,
        wardId: ward.wardId,
        streetName,
        buildingNo: buildingNumber,
      };
      if (street) {
        obj.streetId = street.streetId;
      } else {
        obj.streetId = null;
      }
      return obj;
    },
    error() {
      const name = this.newGroupValue.groupName.trim() === '';
      const startTime =
        this.newGroupValue.curfewTime.limit && this.newGroupValue.curfewTime.startTime === '';
      const endTime =
        this.newGroupValue.curfewTime.limit && this.newGroupValue.curfewTime.endTime.trim() === '';
      let manageName =
        this.newGroupValue.managerPhone &&
        this.newGroupValue.managerPhone.trim() !== '' &&
        !this.newGroupValue.managerName;
      if (manageName === '' || manageName === null) {
        manageName = false;
      }
      let managePhone =
        this.newGroupValue.managerName &&
        this.newGroupValue.managerName.trim() !== '' &&
        !this.newGroupValue.managerPhone;
      if (managePhone === '' || managePhone === null) {
        managePhone = false;
      }
      const pattern = /^[0]{1}[0-9]{8,10}$/;
      let validPhone =
        this.newGroupValue.managerPhone &&
        this.newGroupValue.managerPhone.trim() !== '' &&
        !pattern.test(this.newGroupValue.managerPhone);
      if (validPhone === '' || validPhone === null) {
        validPhone = false;
      }
      return {
        name,
        startTime,
        endTime,
        manageName,
        managePhone,
        validPhone,
      };
    },
    isDuplicate() {
      let dupplicateExistRules = false;
      let dupplicateNewRules = false;
      if (this.allRules.length > 0) {
        dupplicateExistRules =
          this.allRules.filter(
            (rule) =>
              rule.regulationName.trim().toLowerCase() === this.newRule.trim().toLowerCase(), // eslint-disable-line
          ).length > 0;
      }
      if (this.newGroupValue.newRegulations.length > 0) {
        dupplicateNewRules =
          this.newGroupValue.newRegulations.filter(
            (rule) =>
              rule.regulationName.trim().toLowerCase() === this.newRule.trim().toLowerCase(), // eslint-disable-line
          ).length > 0;
      }
      return dupplicateExistRules || dupplicateNewRules;
    },
    newTypeValue() {
      const newType = this.$store.state.vendor.group.createType.data;
      if (this.getCategoryById().categoryName.toLowerCase() === 'nhà nguyên căn') {
        const typeError = {
          deposit: false,
          price: false,
          rooms: false,
          roomNullError: [],
          roomDupplicateError: [],
          superficiality: false,
        };
        let flat = 0;
        if (newType.capacity === 0 || newType.capacity <= 0) {
          typeError.capacity = true;
          flat += 1;
        }
        if (newType.deposit === '' || newType.deposit < 0) {
          typeError.deposit = true;
          flat += 1;
        }
        if (newType.superficiality === '' || newType.superficiality <= 0) {
          typeError.superficiality = true;
          flat += 1;
        }
        if (newType.price === '' || newType.price < 0) {
          typeError.price = true;
          flat += 1;
        }
        // if (type.rooms.length === 0) {
        //   typeError.rooms = true;
        //   flat += 1;
        // } else {
        //   type.rooms.forEach((room, index) => {
        //     if (room.roomName.trim() === '') {
        //       flat += 1;
        //       typeError.roomNullError.push(index);
        //     } else if (
        //       type.rooms.filter(
        //         (r) => r.roomName.toLowerCase().trim() === room.roomName.toLowerCase(),
        //       ).length >= 2
        //     ) {
        //       flat += 1;
        //       typeError.roomDupplicateError.push(index);
        //     }
        //   });
        // }
        if (flat > 0) {
          newType.error.push(typeError);
        }
      }
      return newType;
    },
  },
  watch: {},
  mounted() {
    this.geolocate();
  },
  created() {
    this.initUnselectedRules();
    const url = 'https://youthhostelstorage.blob.core.windows.net/template/contract_appendix.html';
    this.downloadTemplate(url);
    if (!this.user) {
      this.getUser().then(() => {
        this.newGroup.vendorId = this.user.userId;
      });
    } else {
      this.newGroup.vendorId = this.user.userId;
    }
    this.getAllCategories().then(() => {
      this.newGroupValue.categoryId = this.$store.state.renter.filterResult.filter.categories.select;
    });
    if (this.allServices.length === 0) {
      this.getAllServices();
    }
    if (this.allRules.length === 0) {
      this.getAllRules().then(() => {
        this.initUnselectedRules();
      });
    }
    if (this.allFacilities.length === 0) {
      console.log('object');
      this.getAllFacilities();
    }
    if (this.provinces.data.length === 0) {
      this.getProvinces();
    }
    if (this.allSchedule.length === 0) {
      this.getAllSchedule();
    }
  },
};
</script>
<style>
.dropdownSmall.theme--light.v-select .v-select__selection--comma {
  font-size: 0.8rem !important;
  color: #212121 !important;
}
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
  font-size: 0.9rem !important;
}
.address-autocomplete:focus {
  outline: none;
}
.v-stepper__header {
  height: 50px !important;
  border-color: rgb(255, 255, 255);
  box-shadow: rgba(154, 161, 171, 0.15) 0px 0px 35px 0px !important;
}
.v-stepper__step__step .v-icon.v-icon {
  font-size: 1rem !important;
}
.v-stepper__step {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>
