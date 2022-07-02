<template>
  <div>
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="dialog3" max-width="290">
      <v-card>
        <v-card-title class="headline">Bạn mốn hủy hẹn?</v-card-title>
        <v-card-text>
          <p>Hãy cho chúng tôi biết lý do bạn muốn hủy cuộc hẹn này.</p>
          <v-textarea outlined name="input-7-4" label="Lý do hủy hẹn"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" dark @click="unshowCancelDialog">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn color="#727cf5" dark @click="doCancelBooking">
            <v-icon>done</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row v-if="!isLoading" justify="center" class="mt-10">
      <v-col cols="10" md="10" lg="10" xl="10" sm="10" class="white">
        <v-row class="d-flex justify-space-around">
          <v-col cols="12" md="2">
            <v-row class="hidden-sm-and-down">
              <v-col cols="4" md="10" class="py-2 mt-12">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="all"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgba(57, 175, 209, 0.25);
                    color: #39afd1;
                  "
                  @click="changeStatus('ALL')"
                  ><v-icon x-small class="mr-1" color="#39afd1">stop_circle</v-icon>Tất cả</v-btn
                >
              </v-col>
              <v-col cols="4" md="10" class="py-2">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="incoming"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgb(156, 255, 165);
                    color: rgb(37, 146, 61);
                  "
                  @click="changeStatus('INCOMING')"
                  ><v-icon x-small class="mr-1" color="rgb(37, 146, 61)">stop_circle</v-icon>Sắp
                  tới</v-btn
                >
              </v-col>
              <v-col cols="4" md="10" class="py-2">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="incoming"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgba(255, 188, 0, 0.25);
                    color: #ffbc00;
                  "
                  @click="changeStatus('DONE')"
                  ><v-icon x-small class="mr-1" color="#ffbc00">stop_circle</v-icon>Đã xem
                  phòng</v-btn
                >
              </v-col>
              <v-col cols="4" md="10" class="py-2">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="done"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgba(250, 92, 124, 0.25);
                    color: #9c27b0;
                  "
                  @click="changeStatus('CANCELLED')"
                  ><v-icon x-small class="mr-1" color="purple">stop_circle</v-icon>Đã hủy</v-btn
                >
              </v-col>
              <v-col cols="4" md="10" class="py-2">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="done"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgba(250, 92, 124, 0.25);
                    color: #FF572;
                  "
                  @click="changeStatus('CONTRACT')"
                  ><v-icon x-small class="mr-1" color="deep-orange">stop_circle</v-icon>Đã tạo hợp
                  đồng</v-btn
                >
              </v-col>
              <v-col cols="4" md="10" class="py-2">
                <v-btn
                  min-width="100%"
                  class="elevation-0 font-nunito size9rem d-flex justify-start"
                  value="done"
                  style="
                    letter-spacing: 0.01rem !important;
                    background-color: white;
                    border-color: rgba(250, 92, 124, 0.25);
                    color: #fa5c7c;
                  "
                  @click="changeStatus('NONCONTRACT')"
                  ><v-icon x-small class="mr-1" color="#fa5c7c">stop_circle</v-icon>Chưa tạo hợp
                  đồng</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="10" :class="heightDialog === 1 ? 'pt-0' : 'pt-3'">
            <v-row no-gutters class="hidden-sm-and-down">
              <!-- <v-btn-toggle v-model="buttonGroup.preNextCalendar" color="red"> -->
              <v-btn-toggle>
                <v-btn
                  class="btn-primary font-nunito text-subtitle-2 pl-1"
                  style="
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                  "
                  @click="prev"
                  dark
                  ><v-icon small color="white">mdi-chevron-left</v-icon>Trước</v-btn
                >
                <v-btn
                  class="btn-primary font-nunito text-subtitle-2 pr-1"
                  style="
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                  "
                  @click="next"
                  dark
                  >Sau<v-icon color="white" small>mdi-chevron-right</v-icon></v-btn
                >
              </v-btn-toggle>
              <v-btn @click="setToday" class="btn-primary font-nunito text-subtitle-2 ml-4" dark
                >Hôm nay</v-btn
              >
              <v-spacer />
              <v-toolbar-title v-if="$refs.calendar" class="mr-5">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <!-- <v-btn-toggle v-model="buttonGroup.typeDislay" class="ml-auto"> -->
              <v-btn-toggle class="ml-auto">
                <v-btn
                  class="btn-primary font-nunito text-subtitle-2"
                  style="
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                  "
                  dark
                  @click="type = 'month'"
                  >Tháng</v-btn
                >
                <v-btn
                  class="btn-primary font-nunito text-subtitle-2"
                  style="
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                  "
                  @click="type = 'week'"
                  dark
                  >Tuần</v-btn
                >
                <v-btn
                  class="btn-primary font-nunito text-subtitle-2"
                  style="
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                  "
                  dark
                  @click="type = 'day'"
                  >Ngày</v-btn
                >
              </v-btn-toggle>
            </v-row>
            <v-row no-gutters class="hidden-sm-and-up">
              <v-col cols="3" class="d-flex justify-start">
                <v-btn
                  @click="setToday"
                  class="btn-primary font-nunito text-subtitle-2 pl-1 pr-1"
                  dark
                  >Hôm nay</v-btn
                >
              </v-col>
              <v-col cols="6" class="d-flex justify-center">
                <v-btn-toggle>
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2 pl-1 pr-1"
                    style="
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                    "
                    dark
                    @click="type = 'month'"
                    >Tháng</v-btn
                  >
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2 pl-1 pr-1"
                    style="
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                    "
                    dark
                    @click="type = 'day'"
                    >Ngày</v-btn
                  >
                </v-btn-toggle>
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <v-menu bottom right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      class="font-nunito text-subtitle-2 btn-primary pl-1 pr-1"
                    >
                      <span>{{ statusToLabel[status] }}</span>
                      <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="changeStatus('ALL')">
                      <v-list-item-title>Tất cả</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeStatus('INCOMING')">
                      <v-list-item-title>Sắp tới</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeStatus('DONE')">
                      <v-list-item-title>Hoàn tất</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeStatus('CANCELLED')">
                      <v-list-item-title>Đã hủy</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeStatus('CONTRACT')">
                      <v-list-item-title>Đã tạo hợp đồng</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="changeStatus('NONCONTRACT')">
                      <v-list-item-title>Chưa tạo hợp đồng</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <v-col cols="6" class="d-flex justify-start mt-3">
                <v-toolbar-title v-if="$refs.calendar" style="font-size: 16px; !important">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
              </v-col>
              <v-col cols="6" class="d-flex justify-end mt-2">
                <v-btn-toggle>
                  <v-btn
                    class="btn-primary"
                    style="
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                      min-width: 3px !important;
                    "
                    @click="prev"
                    dark
                    ><v-icon small color="white">mdi-chevron-left</v-icon></v-btn
                  >
                  <v-btn
                    class="btn-primary ml-1"
                    style="
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                      min-width: 3px !important;
                    "
                    @click="next"
                    dark
                    ><v-icon color="white" small>mdi-chevron-right</v-icon></v-btn
                  >
                </v-btn-toggle>
              </v-col>
            </v-row>
            <div id="inspire" class="mt-5">
              <v-sheet height="500">
                <v-calendar
                  locale="vi-vn"
                  ref="calendar"
                  v-model="focus"
                  color="#727cf5"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  :status="status"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="getEvents"
                  :short-intervals="false"
                ></v-calendar>
                <v-dialog
                  v-model="selectedOpen"
                  :width="heightDialog === 1 ? 'auto' : '500px'"
                  :persistent="heightDialog === 2"
                  :fullscreen="heightDialog === 1"
                  hide-overlay
                  :transition="heightDialog === 1 ? 'dialog-bottom-transition' : ''"
                  class="font-nunito"
                >
                  <v-card color="grey lighten-4" flat class="hidden-sm-and-up">
                    <v-toolbar color="#727cf5" dark class="font-nunito">
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    </v-toolbar>
                    <v-card-text v-if="selectedEvent && selectedEvent.data" class="pt-15 pb-0">
                      <p class="text-center">
                        <v-avatar>
                          <v-img
                            :src="selectedEvent.data.renter.avatar || require('@/assets/user.png')"
                          />
                        </v-avatar>
                        <span class="text-h6 ml-3" style="color: #727cf5">
                          {{ selectedEvent.data.renter.username }}
                        </span>
                      </p>
                      <v-row
                        style="font-size: 16px"
                        class="pt-10 d-flex justify-center"
                        v-if="selectedEvent.data.status === 'INCOMING'"
                      >
                        <v-col cols="6" md="5">
                          <v-row>
                            <v-col cols="12">
                              <div class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>call</v-icon> {{ selectedEvent.data.renter.phone }}
                              </div>
                            </v-col>
                            <v-col cols="12">
                              <p v-if="selectedEvent.data.deal != null">
                                <span class="text-capitalize font-nunito font-weight-bold">
                                  <v-icon left>money</v-icon>
                                  {{ selectedEvent.data.deal.offeredPrice }}
                                  {{ selectedEvent.data.type.priceUnit }}
                                </span>
                              </p>
                              <p v-if="selectedEvent.data.deal == null">
                                <span class="text-capitalize font-nunito font-weight-bold">
                                  <v-icon left>money</v-icon> {{ selectedEvent.data.type.price }}
                                  {{ selectedEvent.data.type.priceUnit }}
                                </span>
                              </p>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>today</v-icon>
                                {{ new Date(selectedEvent.start).toLocaleDateString('vi-vn') }}
                              </span>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>schedule</v-icon>
                                {{
                                  new Date(selectedEvent.start).toLocaleTimeString('vi-vn', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                }}
                                -
                                {{
                                  new Date(selectedEvent.end).toLocaleTimeString('vi-vn', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="6" md="5" class="mt-2">
                          <div
                            v-if="selectedEvent.data.status === 'INCOMING'"
                            v-on="changeToString(selectedEvent.data)"
                          >
                            <p class="mb-3" style="font-size: 14px !important">
                              Mã xác nhận xem phòng
                            </p>
                            <qrcode-vue
                              :value="qrvalue"
                              :size="150"
                              level="H"
                              class="d-flex justify-center"
                            ></qrcode-vue>
                          </div>
                        </v-col>
                        <!-- <v-col cols="12" md="10">
                          <p class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>category</v-icon> {{ selectedEvent.data.type.title }}
                          </p>
                        </v-col> -->
                        <v-col cols="12" md="10">
                          <p class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>room</v-icon>
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.groupName
                            }}</span>
                            <span class="text-capitalize font-nunito font-weight-bold"
                              >, đường {{ selectedEvent.data.group.address.streetName }}</span
                            >
                          </p>
                        </v-col>
                        <v-col cols="4" />
                      </v-row>
                      <v-row
                        style="font-size: 16px"
                        class="pt-10 d-flex justify-center"
                        v-if="
                          selectedEvent.data.status === 'CANCELLED' ||
                          selectedEvent.data.status === 'DONE' ||
                          selectedEvent.data.status === 'MISSING'
                        "
                      >
                        <v-col cols="6" md="5" class="pt-5">
                          <div class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>call</v-icon> {{ selectedEvent.data.renter.phone }}
                          </div>
                        </v-col>
                        <v-col cols="6" md="5" class="pt-5">
                          <p v-if="selectedEvent.data.deal != null">
                            <span class="text-capitalize font-nunito font-weight-bold">
                              <v-icon left>money</v-icon> {{ selectedEvent.data.deal.offeredPrice }}
                              {{ selectedEvent.data.type.priceUnit }}
                            </span>
                          </p>
                          <p v-if="selectedEvent.data.deal == null">
                            <span class="text-capitalize font-nunito font-weight-bold">
                              <v-icon left>money</v-icon> {{ selectedEvent.data.type.price }}
                              {{ selectedEvent.data.type.priceUnit }}
                            </span>
                          </p>
                        </v-col>
                        <v-col cols="6" md="5" class="pt-5">
                          <span class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>today</v-icon>
                            {{ new Date(selectedEvent.start).toLocaleDateString('vi-vn') }}
                          </span>
                        </v-col>
                        <v-col cols="6" md="5" class="pt-5">
                          <span class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>schedule</v-icon>
                            {{
                              new Date(selectedEvent.start).toLocaleTimeString('vi-vn', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            }}
                            -
                            {{
                              new Date(selectedEvent.end).toLocaleTimeString('vi-vn', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            }}
                          </span>
                        </v-col>
                        <!-- <v-col cols="6">
                          <p class="font-weight-bold">
                            <v-icon left>category</v-icon> {{ selectedEvent.data.type.title }}
                          </p>
                        </v-col> -->
                        <v-col cols="12" md="10" class="pt-5">
                          <p class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>room</v-icon>
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.groupName
                            }}</span>
                            , đường
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.address.streetName
                            }}</span>
                          </p>
                        </v-col>
                        <v-col cols="4" />
                      </v-row>
                    </v-card-text>
                    <v-card-actions
                      v-if="selectedEvent && selectedEvent.data"
                      class="d-flex justify-center pt-0 pb-6"
                    >
                      <v-btn class="d-flex justify-end" @click="onClickOutSide"> Trở về </v-btn>
                      <v-btn
                        v-if="selectedEvent.data.status === 'INCOMING'"
                        dark
                        color="#727cf5"
                        @click="showCancelDialog(selectedEvent.data.bookingId)"
                      >
                        Hủy hẹn
                      </v-btn>
                      <v-btn
                        v-if="
                          selectedEvent.data.status === 'DONE' && !selectedEvent.data.contractId
                        "
                        @click="changeToSContractString(se)"
                        :to="`/vendor/contract?bookingId=${selectedEvent.data.bookingId}&mode=create`"
                        title="Tạo hợp đồng"
                        color="#727cf5"
                        dark
                      >
                        <!-- <v-icon left>far fa-handshake</v-icon> -->
                        Tạo hợp đồng
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <v-card color="grey lighten-4" flat class="hidden-sm-and-down">
                    <v-toolbar color="#727cf5" dark class="font-nunito">
                      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn class="d-flex justify-end" @click="onClickOutSide" icon>
                        <v-icon class="mr-3"> clear </v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text v-if="selectedEvent && selectedEvent.data" class="pt-3 pb-0">
                      <p class="text-center">
                        <v-avatar>
                          <v-img
                            :src="selectedEvent.data.renter.avatar || require('@/assets/user.png')"
                          />
                        </v-avatar>
                        <span class="text-h6 ml-3" style="color: #727cf5">
                          {{ selectedEvent.data.renter.username }}
                        </span>
                      </p>
                      <v-row
                        style="font-size: 16px"
                        class="pt-4 d-flex justify-center"
                        v-if="selectedEvent.data.status === 'INCOMING'"
                      >
                        <v-col cols="6" md="5">
                          <v-row>
                            <v-col cols="12">
                              <div class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>call</v-icon> {{ selectedEvent.data.renter.phone }}
                              </div>
                            </v-col>
                            <v-col cols="12">
                              <p v-if="selectedEvent.data.deal != null">
                                <span class="text-capitalize font-nunito font-weight-bold">
                                  <v-icon left>money</v-icon>
                                  {{ selectedEvent.data.deal.offeredPrice }}
                                  {{ selectedEvent.data.type.priceUnit }}
                                </span>
                              </p>
                              <p v-if="selectedEvent.data.deal == null">
                                <span class="text-capitalize font-nunito font-weight-bold">
                                  <v-icon left>money</v-icon> {{ selectedEvent.data.type.price }}
                                  {{ selectedEvent.data.type.priceUnit }}
                                </span>
                              </p>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>today</v-icon>
                                {{ new Date(selectedEvent.start).toLocaleDateString('vi-vn') }}
                              </span>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-capitalize font-nunito font-weight-bold">
                                <v-icon left>schedule</v-icon>
                                {{
                                  new Date(selectedEvent.start).toLocaleTimeString('vi-vn', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                }}
                                -
                                {{
                                  new Date(selectedEvent.end).toLocaleTimeString('vi-vn', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="6" md="5" class="mt-2">
                          <div
                            v-if="selectedEvent.data.status === 'INCOMING'"
                            v-on="changeToString(selectedEvent.data)"
                          >
                            <p class="mb-3">Mã xác nhận xem phòng</p>
                            <qrcode-vue
                              :value="qrvalue"
                              :size="150"
                              level="H"
                              class="d-flex justify-center"
                            ></qrcode-vue>
                          </div>
                        </v-col>
                        <v-col cols="12" md="10">
                          <p class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>room</v-icon>
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.groupName
                            }}</span>
                            , đường
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.address.streetName
                            }}</span>
                          </p>
                        </v-col>
                        <v-col cols="4" />
                      </v-row>
                      <v-row
                        style="font-size: 16px"
                        class="pt-4 d-flex justify-center"
                        v-if="
                          selectedEvent.data.status === 'CANCELLED' ||
                          selectedEvent.data.status === 'DONE' ||
                          selectedEvent.data.status === 'MISSING'
                        "
                      >
                        <v-col cols="6" md="5">
                          <div class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>call</v-icon> {{ selectedEvent.data.renter.phone }}
                          </div>
                        </v-col>
                        <v-col cols="6" md="5">
                          <p v-if="selectedEvent.data.deal != null">
                            <span class="text-capitalize font-nunito font-weight-bold">
                              <v-icon left>money</v-icon> {{ selectedEvent.data.deal.offeredPrice }}
                              {{ selectedEvent.data.type.priceUnit }}
                            </span>
                          </p>
                          <p v-if="selectedEvent.data.deal == null">
                            <span class="text-capitalize font-nunito font-weight-bold">
                              <v-icon left>money</v-icon> {{ selectedEvent.data.type.price }}
                              {{ selectedEvent.data.type.priceUnit }}
                            </span>
                          </p>
                        </v-col>
                        <v-col cols="6" md="5">
                          <span class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>today</v-icon>
                            {{ new Date(selectedEvent.start).toLocaleDateString('vi-vn') }}
                          </span>
                        </v-col>
                        <v-col cols="6" md="5">
                          <span class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>schedule</v-icon>
                            {{
                              new Date(selectedEvent.start).toLocaleTimeString('vi-vn', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            }}
                            -
                            {{
                              new Date(selectedEvent.end).toLocaleTimeString('vi-vn', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            }}
                          </span>
                        </v-col>
                        <v-col cols="12" md="10">
                          <p class="text-capitalize font-nunito font-weight-bold">
                            <v-icon left>room</v-icon>
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.groupName
                            }}</span>
                            , đường
                            <span class="text-capitalize font-nunito font-weight-bold">{{
                              selectedEvent.data.group.address.streetName
                            }}</span>
                          </p>
                        </v-col>
                        <v-col cols="4" />
                      </v-row>
                    </v-card-text>
                    <v-card-actions
                      v-if="selectedEvent && selectedEvent.data"
                      class="d-flex justify-center pt-0 pb-6"
                    >
                      <v-btn
                        v-if="selectedEvent.data.status === 'INCOMING'"
                        dark
                        color="#727cf5"
                        @click="showCancelDialog(selectedEvent.data.bookingId)"
                      >
                        Hủy hẹn
                      </v-btn>
                      <v-btn
                        v-if="
                          selectedEvent.data.status === 'DONE' && !selectedEvent.data.contractId
                        "
                        @click="changeToSContractString(se)"
                        :to="`/vendor/contract?bookingId=${selectedEvent.data.bookingId}&mode=create`"
                        title="Tạo hợp đồng"
                        color="#727cf5"
                        dark
                      >
                        <!-- <v-icon left>far fa-handshake</v-icon> -->
                        Tạo hợp đồng
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'VendorBooking',
  components: {
    QrcodeVue,
  },
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Tháng',
      week: 'Tuần',
      day: 'Ngày',
      '4day': '4 ngày',
    },
    status: 'ALL',
    statusToLabel: {
      ALL: 'Tất cả',
      INCOMING: 'Sắp tới',
      DONE: 'Hoàn tất',
      CANCELLED: 'Đã hủy',
      CONTRACT: 'Đã tạo hợp đồng',
      NONCONTRACT: 'Chưa tạo hợp đồng',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['#2196F', '#ffbc00', '#fa5c7c', '#9C27B0', '#FF5722', '#795548'],
    names: ['Sắp tới', 'Hoàn tất', 'Đã hủy', 'Đã tạo hợp đồng', 'Chưa tạo hợp đồng', 'Trễ hẹn'],
    cancelDialog: {
      show: false,
      bookingId: undefined,
    },
    time: {
      start: {},
      end: {},
    },
    dialog: false,
    dialogContract: false,
    qrvalue: null,
    dialog3: false,
  }),
  computed: {
    ...mapState({
      bookings: (state) => state.user.bookings,
      user: (state) => state.user.user,
    }),
    isLoading() {
      const isLoadingBookings = this.bookings.isLoading;
      const isLoadingUser = this.user.isLoading;
      return isLoadingBookings || isLoadingUser;
    },
    incommingBookings() {
      return this.bookings.data.filter((booking) => booking.status === 'INCOMING');
    },
    doneBookings() {
      return this.bookings.data.filter((booking) => booking.status === 'DONE');
    },
    doneWithContracts() {
      return this.doneBookings.filter((b) => b.contractId);
    },
    doneWithoutContracts() {
      return this.doneBookings.filter((b) => !b.contractId);
    },
    cancelledBookings() {
      return this.bookings.data.filter((booking) => booking.status === 'CANCELLED');
    },
    heightDialog() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 1;
        case 'sm':
          return 1;
        case 'md':
          return 2;
        case 'lg':
          return 2;
        case 'xl':
          return 2;
        default:
          return null;
      }
    },
  },
  methods: {
    ...mapActions({
      getBookings: 'user/getBookings',
      getUser: 'user/getUser',
      cancelBooking: 'user/cancelBooking',
    }),
    changeToString(data) {
      const { bookingId, qrCode } = data;
      this.dialog = true;
      this.cancelDialog.show = false;
      this.qrvalue = `booking:${bookingId}:${qrCode}`;
    },
    changeToSContractString() {
      this.dialogContract = true;
      this.cancelDialog.show = false;
    },
    getEvents({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const { length } = this.bookings.data;
      for (let i = 0; i < length; i += 1) {
        const booking = this.bookings.data[i];
        const meetTime = new Date(booking.meetTime);
        if (meetTime >= min && meetTime <= max) {
          if (this.status === 'ALL') {
            const name = this.getEventName(booking);
            events.push({
              name,
              start: meetTime.getTime(),
              end: meetTime.setMinutes(meetTime.getMinutes() + 30),
              color: this.getEventColor({ name }),
              timed: true,
              data: booking,
            });
          } else if (this.status.toUpperCase() === booking.status) {
            const name = this.getEventName(booking);
            events.push({
              name,
              start: meetTime.getTime(),
              end: meetTime.setMinutes(meetTime.getMinutes() + 30),
              color: this.getEventColor({ name }),
              timed: true,
              data: booking,
            });
          } else if (this.status.toUpperCase() === 'CONTRACT' && booking.contractId) {
            const name = this.getEventName(booking);
            events.push({
              name,
              start: meetTime.getTime(),
              end: meetTime.setMinutes(meetTime.getMinutes() + 30),
              color: this.getEventColor({ name }),
              timed: true,
              data: booking,
            });
          } else if (this.status.toUpperCase() === 'NONCONTRACT') {
            const name = this.getEventName(booking);
            events.push({
              name,
              start: meetTime.getTime(),
              end: meetTime.setMinutes(meetTime.getMinutes() + 30),
              color: this.getEventColor({ name }),
              timed: true,
              data: booking,
            });
          }
        }
      }
      this.time.start = start;
      this.time.end = end;
      this.events = events;
    },
    getEventName(event) {
      switch (event.status) {
        case 'INCOMING':
          return this.names[0];
        case 'DONE':
          return this.names[1];
        case 'CANCELLED':
          return this.names[2];
        case 'CONTRACT':
          return this.names[3];
        case 'NONCONTRACT':
          return this.names[4];
        case 'MISSING':
          return this.names[5];
        default:
          return null;
      }
    },
    getEventColor(event) {
      console.log(event);
      switch (event.name) {
        case 'Sắp tới':
          return this.colors[0];
        case 'Hoàn tất':
          return this.colors[1];
        case 'Đã hủy':
          return this.colors[2];
        case 'Đã tạo hợp đồng':
          return this.colors[3];
        case 'Chưa tạo hợp đồng':
          return this.colors[4];
        case 'Trễ hẹn':
          return this.colors[5];
        default:
          return null;
      }
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        console.log(`showevent${this.selectedEvent.data.bookingId}`);
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    showCancelDialog(bookingId) {
      this.dialog3 = true;
      this.cancelDialog.bookingId = bookingId;
    },
    unshowCancelDialog() {
      this.dialog3 = false;
      this.cancelDialog.bookingId = undefined;
    },
    doCancelBooking() {
      this.cancelBooking(this.cancelDialog.bookingId).then(this.unshowCancelDialog());
    },
    changeStatus(status) {
      this.status = status;
      let filterData = this.bookings.data.filter((item) => item.status === status);
      if (status === 'CONTRACT') {
        filterData = this.doneWithContracts;
      }
      if (status === 'NONCONTRACT') {
        filterData = this.doneWithoutContracts;
      }
      if (status === 'ALL') {
        filterData = this.bookings.data;
      }
      console.log(filterData);
      const events = [];
      for (let i = 0; i < filterData.length; i += 1) {
        const booking = filterData[i];
        const name = this.getEventName(booking);
        events.push({
          name,
          start: new Date(booking.meetTime).getTime(),
          end: new Date(booking.meetTime).setMinutes(new Date(booking.meetTime).getMinutes() + 30),
          color: this.getEventColor({ name }),
          timed: true,
          data: booking,
        });
      }
      this.events = events;
    },
    onClickOutSide() {
      console.log(`truoc${this.selectedEvent.data.bookingId}`);
      this.selectedOpen = false;
      // this.selectedEvent = null;
      console.log(`sau${this.selectedEvent.data.bookingId}`);
    },
    showIntervalLabel(interval) {
      return interval.minute === 0;
    },
  },
  created() {
    this.getUser()
      .then(() => this.getBookings())
      .then(() => this.$refs.calendar.checkChange());
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.btn-primary {
  color: #fff;
  background-color: #727cf5 !important;
  border-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  border-radius: 0.15rem !important;
  height: 2rem !important;
}
.v-btn-toggle > .v-btn.v-btn {
  opacity: 1 !important;
  border-style: none !important;
}
.v-btn-toggle > .v-btn.v-btn--active {
  color: #fff !important;
  background-color: #4250f2 !important;
  box-shadow: 0 0 0 0.2rem rgba(135, 144, 247, 0.5) !important;
  /* opacity: 1 !important; */
}
/* #all .v-btn-toggle > .v-btn.v-btn--active {
  color: white !important;
  background-color: rgb(57, 175, 209) !important;
  box-shadow: 0 0 0 0.2rem #39AFD1 !important;
}
#incoming .v-btn-toggle > .v-btn.v-btn--active {
  color: white !important;
  background-color: rgb(37, 146, 61) !important;
  box-shadow: 0 0 0 0.2rem #25923D !important;
}
#done .v-btn-toggle > .v-btn.v-btn--active {
  color: white !important;
  background-color: rgb(57, 175, 209) !important;
  box-shadow: 0 0 0 0.2rem #39AFD1 !important;
}
#cancelled .v-btn-toggle > .v-btn.v-btn--active {
  color: white !important;
  background-color: rgb(57, 175, 209) !important;
  box-shadow: 0 0 0 0.2rem #39AFD1 !important;
} */
</style>
