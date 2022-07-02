<template>
  <div>
    <v-overlay :value="requests.isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row class="bg-main py-8 pt-15" justify="center">
      <!-- <v-col cols="6" class="pa-0"> -->
      <v-col cols="6" class="pr-0 pl-10" v-if="!isMobile">
        <v-card min-height="500">
          <v-card-title
            class="size-1rem font-nunito text-primary font-weight-bold text-uppercase d-flex justify-center"
            >Thông tin phòng trọ theo yêu cầu</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="ma-0">
              <v-col cols="8" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Khu vực tìm kiếm:</span>
                <div class="d-flex">
                  <v-col cols="11" class="d-flex flex-column pa-0">
                    <gmap-autocomplete
                      placeholder="Địa điểm, khu vực... bạn muốn ở gần"
                      _class="form-control"
                      @place_changed="setPlace"
                      :selectFirstOnEnter="true"
                      hide-details
                      style="
                        border: 1px solid #dee2e6 !important;
                        border-right: 0px;
                        border-radius: 4px;
                        border-top-right-radius: 0px;
                        border-bottom-right-radius: 0px;
                      "
                      class="pa-2 address-autocomplete"
                    ></gmap-autocomplete>
                  </v-col>
                  <v-col cols="1" class="pa-0">
                    <v-btn
                      icon
                      @click="clearField()"
                      height="100%"
                      min-width="100%"
                      style="
                        border: 1px solid #dee2e6 !important;
                        border-left: 0px;
                        border-radius: 4px;
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                      "
                    >
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-col>
                </div>
                <div class="d-flex" v-if="locationChecker === -1">
                  <v-col cols="11" class="d-flex flex-column pa-0">
                    <span style="color: red">Nhập khu vực cần tìm kiếm</span>
                  </v-col>
                </div>
              </v-col>
              <v-col cols="4" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Ngày nhận phòng: </span>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      readonly
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      :value="startTimeString"
                      height="30"
                      class="size-sub-2 font-nunito form"
                      solo
                      dense
                      light
                      append-icon="mdi-calendar-blank"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startTime"
                    no-title
                    @input="menu1 = false"
                    locale="vi"
                    :allowed-dates="allowedDates"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Bán kính tìm kiếm:</span>
                <v-select
                  :items="distances"
                  v-model="chipDistance"
                  dense
                  hide-details
                  solo
                  class="size-sub-2 font-nunito form"
                ></v-select>
              </v-col>
              <v-col cols="4" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Giá tối đa:</span>
                <v-text-field
                  hide-details
                  v-model="request.maxPrice"
                  type="number"
                  suffix="Triệu"
                  :rules="isPositiveNum"
                  :step="0.1"
                  dense
                  solo
                />
              </v-col>
              <v-col cols="4" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Diện tích tối thiểu:</span>
                <v-select
                  :items="superficialities"
                  v-model="chipSuperficiality"
                  dense
                  hide-details
                  solo
                  class="size-sub-2 font-nunito form"
                ></v-select>
              </v-col>
              <v-col cols="11" class="d-flex justify-end">
                <v-btn @click="doCreateRoomRequest" color="#727CF5" dark>Gửi yêu cầu</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="pr-10" v-if="!isMobile">
        <v-card min-height="425" max-height="425">
          <v-row no-gutters class="pt-3">
            <v-spacer />
            <v-col cols="6">
              <v-text-field
                label="Tìm kiếm"
                v-model="searchQuery"
                append-icon="search"
                solo
                hide-details
                class="pr-2 text-muted pa-0 size-sub-2 chat mb-7 hidden-sm-and-down"
                height="35"
                rounded
              ></v-text-field>
            </v-col>
          </v-row>
          <div
            style="overflow-y: auto; max-height:425px; min-height=425px"
            id="style-1"
            class="scrollbar"
          >
            <v-list v-if="searchRequest.length !== 0">
              <v-list-item-group v-model="slide.requestIndex" mandatory color="#727CF5">
                <v-list-item
                  v-for="(request, index) in searchRequest"
                  :value="request.createdAt"
                  :key="request.createdAt"
                  class="ml-2 mr-2 mb-2"
                  style="height: 140px"
                >
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex justify-center align-center">
                      <span class="font-nunito">{{ (index += 1) }}</span>
                    </v-col>
                    <!-- <v-col
                  cols="5"
                  sm="2"
                  md="2"
                  class="d-flex align-start align-sm-center align-md-center align-lg-center py-4 px-2"
                >
                  <v-col
                      cols="11"
                      sm="11"
                      md="11"
                      class="d-flex flex-column align-start justify-center px-0"
                    >
                      <span class="font-nunito" style="color: #727CF5">Bán kính</span>
                      <span class="text-muted font-nunito">{{ request.maxDistance }} km</span>
                    </v-col>
                </v-col> -->
                    <v-col cols="9" sm="9" md="9" class="d-flex py-4 px-4">
                      <v-col cols="12" sm="12" md="12" class="d-flex flex-column align-start">
                        <span
                          class="text-primary-dark font-nunito type-name pt-2"
                          v-if="request.address"
                        >
                          <v-row no-gutters>
                            <v-col cols="1" class="pa-0 py-0">
                              <v-icon color="#727cf5" left>mdi-google-maps</v-icon>
                            </v-col>
                            <v-col cols="11" class="pa-0 py-0">
                              {{ request.address }}
                            </v-col>
                          </v-row>
                        </span>
                        <span class="my-2">
                          <v-row no-gutters>
                            <v-col cols="5">
                              <span class="font-nunito pr-2" style="color: #727cf5">Bán kính</span>
                              <span class="text-muted font-nunito"
                                >{{ request.maxDistance }} km</span
                              >
                            </v-col>
                            <v-col cols="7">
                              <span class="font-nunito pr-2" style="color: #727cf5"
                                >Diện tích tối thiểu</span
                              >
                              <span class="text-muted font-nunito"
                                >{{ request.minSuperficiality }} m2</span
                              >
                            </v-col>
                            <v-col cols="5">
                              <span class="font-nunito pr-2" style="color: #727cf5"
                                >Giá tối đa</span
                              >
                              <span class="text-muted font-nunito"
                                >{{ request.maxPrice }} Triệu</span
                              >
                            </v-col>
                            <v-col cols="7">
                              <span class="font-nunito pr-2" style="color: #727cf5"
                                >Ngày nhận phòng</span
                              >
                              <span class="text-muted font-nunito">{{
                                new Date(request.dueTime).toLocaleDateString('vi')
                              }}</span>
                            </v-col>
                          </v-row>
                        </span>
                      </v-col>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center align-center">
                      <v-list-item-action>
                        <v-btn @click="getResult(request.requestId)" dark color="#727CF5">
                          Xem phòng
                        </v-btn>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="searchRequest.length === 0" class="d-flex justify-center">
              <span class="font-nunito text-muted pt-10"
                >Không có yêu cầu tìm kiếm phòng trọ tương lai</span
              >
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex justify-center pa-0 py-0" v-if="isMobile">
        <v-card>
          <v-card-title
            class="size-1rem font-nunito text-primary font-weight-bold text-uppercase d-flex justify-center"
            >Thông tin phòng trọ theo yêu cầu</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="ma-0">
              <v-col cols="12" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Khu vực tìm kiếm:</span>
                <div class="d-flex">
                  <v-col cols="11" class="d-flex flex-column pa-0">
                    <gmap-autocomplete
                      placeholder="Địa điểm, khu vực... bạn muốn ở gần"
                      _class="form-control"
                      @place_changed="setPlace"
                      :selectFirstOnEnter="true"
                      hide-details
                      style="
                        border: 1px solid #dee2e6 !important;
                        border-right: 0px;
                        border-radius: 4px;
                        border-top-right-radius: 0px;
                        border-bottom-right-radius: 0px;
                      "
                      class="pa-2 address-autocomplete"
                    ></gmap-autocomplete>
                  </v-col>
                  <v-col cols="1" class="pa-0">
                    <v-btn
                      icon
                      @click="clearField()"
                      height="100%"
                      min-width="100%"
                      style="
                        border: 1px solid #dee2e6 !important;
                        border-left: 0px;
                        border-radius: 4px;
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                      "
                    >
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-col>
                </div>
              </v-col>
              <v-col cols="6" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Ngày nhận phòng: </span>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      readonly
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      :value="startTimeString"
                      height="30"
                      class="size-sub-2 font-nunito form"
                      solo
                      dense
                      light
                      append-icon="mdi-calendar-blank"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startTime"
                    no-title
                    @input="menu1 = false"
                    locale="vi"
                    :allowed-dates="allowedDates"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Bán kính tìm kiếm:</span>
                <v-select
                  :items="distances"
                  v-model="chipDistance"
                  dense
                  hide-details
                  solo
                  class="size-sub-2 font-nunito form"
                ></v-select>
                <!-- <v-chip-group v-model="chip" color="#4250f2">
                  <v-chip filter class="font-nunito">3 km</v-chip>
                  <v-chip filter class="font-nunito">5 km</v-chip>
                  <v-chip filter class="font-nunito">7 km</v-chip>
                  <v-chip filter class="font-nunito">10 km</v-chip>
                </v-chip-group> -->
              </v-col>
              <v-col cols="6" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Giá tối đa:</span>
                <v-text-field
                  hide-details
                  v-model="request.maxPrice"
                  type="number"
                  suffix="Triệu"
                  :rules="isPositiveNum"
                  :step="0.1"
                  dense
                  solo
                />
              </v-col>
              <v-col cols="6" class="d-flex flex-column px-6">
                <span class="field-name font-weight-medium">Diện tích tối thiểu:</span>
                <v-select
                  :items="superficialities"
                  v-model="chipSuperficiality"
                  dense
                  hide-details
                  solo
                  class="size-sub-2 font-nunito form"
                ></v-select>
              </v-col>
              <v-col cols="11" class="d-flex justify-end">
                <v-btn @click="doCreateRoomRequest" color="#727CF5" dark>Gửi yêu cầu</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex justify-center pa-0 py-0 pt-3" v-if="isMobile">
        <v-card>
          <v-row no-gutters class="pt-6">
            <v-col cols="12">
              <v-text-field
                label="Tìm kiếm"
                v-model="searchQuery"
                append-icon="search"
                solo
                hide-details
                class="pl-5 pr-5 text-muted pa-0 size-sub-2 chat mb-7 hidden-sm-and-up"
                height="35"
                rounded
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <span class="text-muted font-nunito">{{ searchRequest.length }} kết quả</span>
            </v-col>
          </v-row>
          <div>
            <v-list v-if="searchRequest.length !== 0">
              <v-list-item-group v-model="slide.requestIndex" mandatory color="#727CF5">
                <v-list-item
                  v-for="request in searchRequest"
                  :value="request.createdAt"
                  :key="request.createdAt"
                  class="mb-2"
                  style="background-color: #FFFFA"
                >
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex justify-center align-center">
                      <!-- <span class="font-nunito">{{ (index += 1) }}</span> -->
                    </v-col>
                    <v-col cols="11">
                      <v-col cols="11" sm="10" md="10" class="d-flex flex-column align-start">
                        <span class="my-2">
                          <v-row>
                            <v-col cols="5">
                              <span class="font-nunito pr-2" style="color: #727cf5">Bán kính</span
                              ><br />
                              <span class="text-muted font-nunito"
                                >{{ request.maxDistance }} km</span
                              >
                            </v-col>
                            <v-col cols="7">
                              <span class="font-nunito pr-2" style="color: #727cf5"
                                >Diện tích tối thiểu</span
                              ><br />
                              <span class="text-muted font-nunito"
                                >{{ request.minSuperficiality }} m2</span
                              >
                            </v-col>
                            <v-col cols="5">
                              <span class="font-nunito pr-2" style="color: #727cf5">Giá tối đa</span
                              ><br />
                              <span class="text-muted font-nunito"
                                >{{ request.maxPrice }} Triệu</span
                              >
                            </v-col>
                            <v-col cols="7">
                              <span class="font-nunito pr-2" style="color: #727cf5"
                                >Ngày nhận phòng</span
                              ><br />
                              <span class="text-muted font-nunito">{{
                                new Date(request.dueTime).toLocaleDateString('vi')
                              }}</span>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-muted font-nunito" v-if="request.address">
                                <v-row no-gutters>
                                  <v-col cols="12" class="pa-0 py-0">
                                    <span class="font-nunito pr-2" style="color: #727cf5"
                                      >Địa chỉ</span
                                    ><br />
                                    {{ request.address }}
                                  </v-col>
                                </v-row>
                              </span>
                            </v-col>
                          </v-row>
                        </span>
                      </v-col>
                    </v-col>
                    <v-col cols="12" class="pa-0 px-0 d-flex justify-end">
                      <v-list-item-action>
                        <v-btn @click="getResult(request.requestId)" dark color="#727CF5">
                          Xem phòng
                        </v-btn>
                      </v-list-item-action>
                    </v-col>
                    <v-col cols="12"><v-divider></v-divider></v-col>
                  </v-row>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="searchRequest.length === 0" class="d-flex justify-center">
              <span class="font-nunito text-muted pt-10"
                >Không có yêu cầu tìm kiếm phòng trọ tương lai</span
              >
            </div>
          </div>
        </v-card>
      </v-col>
      <!-- <v-col cols="5">
        <v-card-text>Địa điểm, khu vực... bạn muốn ở gần</v-card-text>
        <div class="d-flex align-center">
          <gmap-autocomplete
            placeholder="Địa điểm, khu vực... bạn muốn ở gần"
            class="address-input"
            :selectFirstOnEnter="true"
            @place_changed="setPlace"
          ></gmap-autocomplete>
          <v-btn icon @click="clearField()">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="5">
        <v-card-text>Chọn ngày nhận phòng</v-card-text>
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              readonly
              hide-details
              v-bind="attrs"
              v-on="on"
              :value="startTimeString"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startTime"
            no-title
            @input="menu1 = false"
            locale="vi"
            :allowed-dates="allowedDates"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2">
        <v-card-text>Giá tối đa mà bạn muốn trả</v-card-text>
        <v-text-field
          hide-details
          v-model="request.maxPrice"
          type="number"
          suffix="Triệu"
          :rules="isPositiveNum"
          :step="0.1"
        />
      </v-col>
      <v-col cols="4">
        <v-card-text>Bán kính tìm kiếm tính từ vị trí mà bạn đã chọn</v-card-text>
        <v-chip-group v-model="chip" mandatory>
          <v-chip filter>3 km</v-chip>
          <v-chip filter>5 km</v-chip>
          <v-chip filter>7 km</v-chip>
          <v-chip filter>10 km</v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="4">
        <v-card-text>Diện tích tối thiểu</v-card-text>
        <v-chip-group v-model="chip1" mandatory>
          <v-chip filter>10 m2</v-chip>
          <v-chip filter>15 m2</v-chip>
          <v-chip filter>20 m2</v-chip>
          <v-chip filter>25 m2</v-chip>
          <v-chip filter>30 m2</v-chip>
          <v-chip filter>40 m2</v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="2">
        <v-btn icon @click="doCreateRoomRequest">
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
      </v-col> -->
      <!-- </v-col> -->
      <!-- <v-col cols="11" md="11" lg="11" xl="10" class="pa-0">
      <v-row class="rounded-lg elevation-5 mt-5">
        <v-col>
          <v-slide-group v-model="slide.requestIndex" show-arrows>
            <v-slide-item
              v-for="request in requests.data"
              :key="request.requestId"
              v-slot="{ active, toggle }"
            >
              <v-card
                :color="active ? 'blue lighten-1' : 'grey lighten-1'"
                @click="toggle"
                class="ma-2 elevation-5"
                width="250"
              >
                <v-card-title>
                  {{ request.address }}
                  <v-spacer />
                  <v-btn icon @click="slide.short = !slide.short">
                    <v-icon v-if="slide.short">arrow_drop_down</v-icon>
                    <v-icon v-if="!slide.short">arrow_drop_up</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text v-if="!slide.short">
                  <p>Ngày nhận phòng: {{ new Date(request.dueTime).toLocaleDateString('vi') }}</p>
                  <p>Giá tối đa: {{ request.maxPrice }} Triệu</p>
                  <p>Diện tích tối thiểu: {{ request.minSuperficiality }} m2</p>
                  <p>Bán kính tìm kiếm: {{ request.maxDistance }} km</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="getResult(request.requestId)" text>Xem danh sách phòng</v-btn>
                </v-card-actions>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
      <v-row class="rounded-lg elevation-5 mt-5" v-if="result">
        <v-col v-for="type in result.types" :key="type.typeId" cols="3">
          <CarouselItem :type="type" :typeGroup="getGroupOfType(type.groupId)" />
        </v-col>
      </v-row>
    </v-col> -->
    </v-row>
  </div>
</template>
<script>
// import axios from 'axios';
import { mapActions, mapState } from 'vuex';
// import HostelSuggest from '@/views/renter/HostelSuggest.vue';
import validateMixin from '../../components/mixins/validate';
import snackbarMixin from '../../components/mixins/snackBar';
// import CarouselItem from '../../components/home/TopCarouselItem.vue';

export default {
  name: 'RoomAlert',
  // components: { HostelSuggest },
  mixins: [validateMixin, snackbarMixin],
  data: () => ({
    result: null,
    slide: {
      short: true,
      requestIndex: 0,
    },
    menu1: null,
    chipDistance: '5 km',
    chipSuperficiality: '15 m2',
    chip1: 1,
    price: 0,
    startTime: new Date().toISOString().substr(0, 10),
    date: '',
    overlay: {
      show: false,
    },
    address: '',
    currentPlace: null,
    visibleProperty: 'hidden',
    searchValue: '',
    request: {
      address: null,
      dueTime: new Date(new Date().toISOString().substr(0, 10)).getTime(),
      latitude: 10.7542893,
      longitude: 106.1346955,
      maxDistance: 5,
      maxPrice: 2,
      minSuperficiality: 15,
    },
    isLoadingResult: false,
    distances: ['3 km', '5 km', '7km', '10 km'],
    // superficialities: ['10 ㎡', '15 ㎡', '20 ㎡', '25 ㎡', '30 ㎡', '40 ㎡'],
    superficialities: ['10 m2', '15 m2', '20 m2', '25 m2', '30 m2', '40 m2'],
    searchQuery: '',
    locationChecker: 0,
  }),
  methods: {
    ...mapActions({
      createRoomRequest: 'user/createRoomRequest',
      getRoomRequests: 'user/getRoomRequests',
      getUser: 'user/getUser',
    }),
    getGroupOfType(groupId) {
      return this.result.groups.find((group) => group.groupId === groupId);
    },
    doCreateRoomRequest() {
      if (!this.request.address) {
        this.locationChecker = -1;
      } else {
        this.locationChecker = 0;
        this.request.maxDistance = Number(this.chipDistance.split('km')[0].trim());
        this.request.minSuperficiality = Number(this.chipSuperficiality.split('m2')[0].trim());
        this.request.maxPrice = Number(this.request.maxPrice);
        // console.log(this.request.maxDistance);
        // console.log(this.request.minSuperficiality);
        this.createRoomRequest(this.request).then(() => {
          if (this.requests.success) {
            this.showSnackBar('Tạo request thành công', { color: 'green' });
          } else {
            this.showSnackBar('Tạo request thất bại', { color: 'red' });
          }
        });
      }
    },
    setPlace(place) {
      this.currentPlace = place;
      this.request.address = `${place.name}-${place.formatted_address}`;
      this.searchValue = place.formatted_address;
      this.request.latitude = place.geometry.location.lat();
      this.request.longitude = place.geometry.location.lng();
    },
    clearField() {},
    geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          this.request.latitude = position.coords.latitude;
          this.request.longitude = position.coords.longitude;
        });
      }
    },
    // toTheNextPage(link) {
    //   if (link !== '#') {
    //     this.$router.push(link);
    //   }
    // },
    getResult(requestId) {
      // this.isLoadingResult = true;
      // try {
      //   axios.get(`/api/v1/types?requestId=${requestId}`).then((res) => {
      //     this.result = res.data.data;
      //     this.isLoadingResult = false;
      //   });
      this.$router.push(`request/${requestId}`);
      //   console.log(this.result);
      // } catch (error) {
      //   console.log(error);
      //   this.isLoadingResult = false;
      // }
    },
    getDistance(distance) {
      return `${distance} km`;
    },
    getSuperficiality(superficiality) {
      return `${superficiality} m2`;
    },
    getPrice(price) {
      return `${price} Triệu`;
    },
    checkNull(address) {
      if (address === null) {
        return true;
      }
      return false;
    },
  },
  computed: {
    ...mapState({
      requests: (state) => state.user.requests,
      user: (state) => state.user.user,
    }),
    startTimeString() {
      return new Date(this.startTime).toLocaleDateString('vi');
    },
    isLoading() {
      return (
        this.requests.isLoading ||
        this.requests.isCreating ||
        this.user.isLoading ||
        this.isLoadingResult
      );
    },
    // sortRequest() {
    //   return Object.entries(this.requests.data).sort((a, b) => b.createdAt - a.createdAt).forEach((item));
    // },
    sortData() {
      return this.requests.data.slice().sort((a, b) => b.createdAt - a.createdAt);
    },
    searchRequest() {
      if (!this.searchQuery) {
        return this.requests.data.slice().sort((a, b) => b.createdAt - a.createdAt);
      }
      return this.requests.data
        .filter(
          (item) => (this.checkNull(item.address) ?
            false :
            item.address.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1) ||
            this.getDistance(item.maxDistance)
              .toLowerCase()
              .indexOf(this.searchQuery.toLowerCase()) !== -1 ||
            this.getPrice(item.maxPrice).toLowerCase().indexOf(this.searchQuery.toLowerCase()) !==
              -1 ||
            this.getSuperficiality(item.minSuperficiality)
              .toLowerCase()
              .indexOf(this.searchQuery.toLowerCase()) !== -1,
        )
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt);
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
  created() {
    this.geolocate();
    if (!this.user.data) {
      this.getUser().then(() => this.getRoomRequests());
    }
  },
  watch: {
    startTime() {
      this.request.dueTime = new Date(this.startTime).getTime();
    },
    chip(index) {
      switch (index) {
        case 0:
          this.request.maxDistance = 3;
          break;
        case 1:
          this.request.maxDistance = 5;
          break;
        case 2:
          this.request.maxDistance = 7;
          break;
        case 3:
          this.request.maxDistance = 10;
          break;
        default:
          break;
      }
    },
    chip1(index) {
      switch (index) {
        case 0:
          this.request.minSuperficiality = 10;
          break;
        case 1:
          this.request.minSuperficiality = 15;
          break;
        case 2:
          this.request.minSuperficiality = 20;
          break;
        case 3:
          this.request.minSuperficiality = 25;
          break;
        case 4:
          this.request.minSuperficiality = 30;
          break;
        case 5:
          this.request.minSuperficiality = 40;
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.address-input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 3px solid #ccc;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  outline: none;
}

.address-input:focus {
  border: 1px solid #555;
}

.scrollbar {
  overflow-y: scroll;
}
.force-overflow {
  min-height: 500px;
}
#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(179, 184, 240);
  border-radius: 10px;
}

#style-1::-webkit-scrollbar {
  width: 10px;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #727cf5;
}
</style>
