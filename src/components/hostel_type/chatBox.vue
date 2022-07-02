<template>
  <!-- eslint-disable max-len -->
  <v-card :loading="isLoading">
    <v-dialog v-model="warningDialog" max-width="400">
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
            >{{ messageTitle }}</span
          >
          <span
            class="font-nunito"
            style="
              font-size: 0.9rem;
              font-weight: 400;
              text-align: center !important;
              color: #ffbc00;
            "
            >{{ messageAction }}</span
          >
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-card-title class="px-3 py-3">
      <v-avatar color="#727cf5" height="30" width="30" min-width="30">
        <v-img max-height="30" max-width="30" v-if="group.imgUrl" :src="group.imgUrl" />
        <span class="text-overline white--text" v-else>{{ getAvatarTitle() }}</span>
      </v-avatar>
      <span class="text-subtitle-2 ml-3 text-primary">{{ group.groupName }}</span>
      <v-spacer />
      <v-btn small icon color="#727cf5" @click="$emit('close')">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <div
      style="max-height: 350px; min-height: 300px"
      class="overflow-y-auto"
      id="chatbox"
      ref="chatbox"
    >
      <v-overlay :value="dateTimeOverlay.show" absolute opacity="0.8">
        <dateTimePickerStepper
          :width="dateTimeOverlay.width"
          v-on:ok="receivedDateTime"
          v-on:cancel="dateTimeOverlay.show = false"
          :groupId="group.groupId"
          :price="info.price"
          :lastDeal="getLastDeal"
          :priceUnit="info.priceUnit"
        />
      </v-overlay>
      <v-overlay :value="bookingCancel.show" absolute opacity="0.8">
        <v-card class="white d-flex flex-column justify-center align-center py-3" width="400">
          <v-card-title class="font-weight-bold text-body-1" style="color: #171e8d"
            >Bạn có muốn hủy lịch hẹn?</v-card-title
          >
          <v-card-actions>
            <!-- toDo: tai sao huy lich hen -->
            <v-btn
              small
              color="#eb3518"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="doCancelBooking"
              >Có</v-btn
            >
            <v-btn
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="bookingCancel.show = false"
              >Không</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay :value="bargainCancel.show" absolute opacity="0.8">
        <v-card class="white d-flex flex-column justify-center align-center py-3" width="400">
          <v-card-title class="font-weight-bold text-body-1" style="color: #171e8d"
            >Bạn có muốn hủy trả giả này?</v-card-title
          >
          <v-card-actions>
            <v-btn
              small
              color="#eb3518"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="doCancelBargain"
              >Có</v-btn
            >
            <v-btn
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="resetBargainCancel"
              >Không</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay
        :value="bargainOverlay.show"
        absolute
        opacity="0.8"
        class="justify-center align-center"
      >
        <v-card
          color="white"
          class="d-flex flex-column justify-center align-center pa-2"
          v-if="bargainOverlay.step === 1"
          min-width="400"
        >
          <v-card-text>
            <span class="text-h6" :style="{ color: '#5a669f', textAlign: 'center' }">
              {{ info.title }}
            </span>
          </v-card-text>
          <v-list-item>
            <v-list-item-content class="pa-0">
              <span class="text-caption" style="color: #b4b6d1">Giá gốc</span>
              <p class="d-flex align-center mt-1">
                <v-img max-height="30" max-width="30" src="@/assets/typeDetail/price.png" />
                <!-- toDo unit -->
                <span class="text-body-1 ml-2" style="color: #101526"
                  >{{ info.price }} {{ info.priceUnit }} phòng/tháng</span
                >
              </p>
              <span class="text-caption mt-3" style="color: #b4b6d1">Giá bạn muốn đề xuất</span>
              <v-text-field
                class="mt-1 text-body-2"
                type="number"
                outlined
                dense
                light
                _hide-details
                v-model="bargainOverlay.price"
                suffix="Triệu"
                step="0.1"
                min="0"
                :max="`${info.price - 0.1}`"
                :rules="[
                  rules.required,
                  rules.max(bargainOverlay.price, info.price),
                  rules.min(bargainOverlay.price),
                ]"
              />
            </v-list-item-content>
          </v-list-item>
          <v-card-actions class="mt-6">
            <v-btn
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="bargainOverlay.step += 1"
              >Tiếp tục</v-btn
            >
            <v-btn
              small
              outlined
              color="#9e9fa7"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="
                bargainOverlay.show = false;
                bargainOverlay.step = 1;
              "
              >Hủy</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card
          v-if="bargainOverlay.step === 2"
          color="white"
          class="d-flex flex-column justify-center align-center pa-1"
        >
          <v-card-text v-if="Number(bargainOverlay.price) !== Number(info.price)">
            <span class="text-subtitle-1" style="color: #101526">
              Bạn đồng ý trả giá
              <span class="font-weight-bold" style="color: #171c8b">
                {{ bargainOverlay.price }}
              </span>
              triệu đồng?
            </span>
          </v-card-text>
          <v-card-text v-if="Number(bargainOverlay.price) === Number(info.price)">
            <span class="text-subtitle-1" style="color: #101526">
              Giá đang trả giá bằng với giá gốc!
              <span class="font-weight-bold" style="color: #171c8b">
                {{ bargainOverlay.price }}
              </span>
              triệu đồng?
            </span>
          </v-card-text>
          <v-card-actions>
            <div class="d-flex align-center justify-space-around pb-1">
              <v-btn
                small
                v-if="Number(bargainOverlay.price) !== Number(info.price)"
                color="#4F60C9"
                class="text-caption px-4 py-2 mx-2"
                depressed
                @click="sendMessage('bargain')"
                >Có</v-btn
              >
              <v-btn
                small
                v-if="Number(bargainOverlay.price) === Number(info.price)"
                color="#4F60C9"
                class="text-caption px-4 py-2 mx-2"
                depressed
                @click="bargainOverlay.step = 1"
                >Quay lại</v-btn
              >
              <v-btn
                small
                outlined
                color="#9e9fa7"
                class="text-caption px-4 py-2 mx-2"
                @click="
                  bargainOverlay.show = false;
                  bargainOverlay.step = 1;
                "
                >Hủy</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-list v-scroll.self="myOnScroll" justify="center">
        <!-- type information -->
        <div class="d-flex justify-start ml-4 vendorChatMessage" :style="{ width: '70%' }">
          <v-col cols="4">
            <v-img
              :src="info.imageUrls[0].resourceUrl"
              v-if="info.imageUrls.length !== 0"
              max-height="50"
            />
          </v-col>
          <v-col cols="8" class="flex pl-0 pr-1">
            <span
              class="text-caption"
              style="
                display: block;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #32465a;
              "
              >{{ info.title }}</span
            >
            <span class="text-body-1 font-weight-medium text-primary"
              >₫ {{ info.price }} {{ info.priceUnit }}</span
            >
          </v-col>
        </div>
        <!-- all message -->
        <v-list-item v-for="item in filteredMessage" v-bind:key="item.createdAt">
          <v-list-item-content>
            <div v-if="item.sender === 'renter'" class="d-flex flex-column align-end">
              <div class="d-flex justify-center" v-if="item.bargain" style="width: 100%">
                <div
                  v-ripple
                  style="width: 85%"
                  class="d-flex flex-column justify-center align-center renterEvent lighten-5 py-4 px-4 max-w-3/4"
                >
                  <span
                    class="font-weight-bold text-primary font-nunito"
                    style="font-size: 0.9375rem"
                    >TRẢ GIÁ</span
                  >
                  <div class="d-flex justify-space-between align-center my-4" style="width: 100%">
                    <span
                      class="font-nunito font-weight-regular text-gray text-subtitle-2 d-flex align-center"
                      ><v-icon class="mr-1">mdi-home-currency-usd</v-icon> {{ info.price }}
                      {{ info.priceUnit }}</span
                    >
                    <span class="font-nunito font-weight-regular text-warning text-subtitle-2">
                      <v-icon color="#ffbc00">{{
                        Number(info.price) >= Number(item.bargain.newPrice)
                          ? 'mdi mdi-arrow-down-bold'
                          : 'mdi mdi-arrow-up-bold'
                      }}</v-icon>
                      {{ item.bargain.newPrice }} {{ info.priceUnit }}
                    </span>
                  </div>
                  <span
                    v-if="item.bargain.status === 'wait'"
                    class="mb-3 text-caption font-weight-regular font-nunito text-primary mr-auto"
                  >
                    <v-icon small color="#727cf5" class="mr-2">fas fa-spinner fa-spin</v-icon>Đang
                    chờ phản hồi của chủ trọ
                  </span>
                  <span
                    v-if="item.bargain.status === 'deny'"
                    class="mb-3 text-caption font-weight-regular font-nunito mr-auto text-primary"
                  >
                    <v-icon small color="#727cf5" class="mr-2">thumb_down</v-icon>Chủ trọ không đồng
                    ý với mức giá của bạn
                  </span>
                  <span
                    v-if="item.bargain.status === 'accept'"
                    class="mb-3 text-caption font-weight-regular font-nunito mr-auto text-primary"
                  >
                    <v-icon small color="#727cf5" class="mr-2">thumb_up</v-icon>Chủ trọ đã đồng ý
                    với mức giá của bạn
                  </span>
                  <v-btn
                    min-width="100%"
                    class="mb-3 py-5 text-subtitle-2"
                    depressed
                    color="#e4e6eb"
                    small
                    v-if="item.bargain.status === 'cancel'"
                    >Bạn đã hủy trả giá này</v-btn
                  >
                  <v-btn
                    min-width="100%"
                    class="mb-3 py-5 text-subtitle-2"
                    depressed
                    color="#e4e6eb"
                    small
                    v-if="item.bargain.status === 'wait'"
                    @click="showBargainCancel(item.id)"
                    >Hủy trả giá này</v-btn
                  >
                </div>
              </div>

              <div class="d-flex justify-center" v-else-if="item.book" style="width: 100%">
                <div
                  v-ripple
                  style="width: 85%"
                  class="d-flex flex-column justify-center align-center renterEvent lighten-5 py-4 px-4 max-w-3/4"
                >
                  <span
                    class="font-weight-bold text-primary font-nunito"
                    style="font-size: 0.9375rem"
                    >LỊCH HẸN</span
                  >
                  <div class="d-flex justify-space-between align-center my-4" style="width: 100%">
                    <!-- <span class="d-flex flex-column"> -->
                    <span
                      class="font-nunito font-weight-regular text-gray text-subtitle-2 d-flex align-center"
                    >
                      <v-icon class="mr-1" color="#0acf97">event_available</v-icon>
                      {{ item.book.date }}
                    </span>
                    <!-- <span
                        class="font-nunito font-weight-regular text-gray text-subtitle-2 d-flex align-center"
                      >
                        <v-icon class="mr-1" color="#727cf5">mdi-home-currency-usd</v-icon>
                        <span class="text-decoration-line-through"
                          >{{ getLastDeal.bargain.originalPrice }} {{ info.priceUnit }}</span
                        >
                      </span> -->
                    <!-- </span> -->
                    <!-- <span class="d-flex flex-column"> -->
                    <span
                      class="font-nunito font-weight-regular text-gray text-subtitle-2 d-flex align-center"
                    >
                      <v-icon class="mr-1" color="#0acf97">schedule</v-icon>
                      {{ item.book.time }}
                    </span>
                    <!-- <span
                        class="font-nunito font-weight-regular text-gray text-subtitle-2 d-flex align-center"
                      >
                        <v-icon class="mr-1" color="#727cf5">mdi mdi-arrow-down-bold</v-icon>
                        {{ getLastDeal.bargain.newPrice }} {{ info.priceUnit }}
                      </span>
                    </span> -->
                  </div>
                  <v-btn
                    min-width="100%"
                    class="mb-3 py-5 text-subtitle-2"
                    depressed
                    color="#e4e6eb"
                    small
                    v-if="!item.book.cancel"
                    @click="showBookingCancel(item.book.bookingId, item.id)"
                    >Hủy lịch hẹn này</v-btn
                  >
                  <v-btn
                    min-width="90%"
                    class="mb-3 py-5 text-subtitle-2"
                    depressed
                    color="#e4e6eb"
                    small
                    v-if="item.book.cancel"
                    >Lịch hẹn đã bị bạn hủy</v-btn
                  >
                </div>
              </div>
              <!-- inbox chat normal -->
              <span
                v-else
                v-ripple
                class="lighten-5 py-2 px-5 max-w-3/4 text-subtitle-2 renterChatMessage"
                >{{ item.message }}</span
              >
              <span class="font-nunito text-gray text-caption">{{
                getTimeSendMsg(item.createdAt)
              }}</span>
            </div>
            <div v-if="item.sender === 'vendor'" class="d-flex flex-column align-start">
              <span
                _style="width: 75%"
                v-ripple
                class="lighten-5 py-2 px-5 max-w-3/4 text-subtitle-2 vendorChatMessage"
                v-if="!item.book && !item.bargain"
                >{{ item.message }}</span
              >
              <span
                style="width: 75%"
                v-ripple
                class="lighten-5 pa-2 rounded max-w-3/4"
                v-if="item.bargain && item.bargain.dealId"
              >
                Chủ trọ đồng ý với mức giá bạn đề xuất
                <!-- <v-btn small color="amber" class="mt-2">Hủy thỏa thuận</v-btn> -->
              </span>
              <span
                style="width: 75%"
                v-ripple
                class="red lighten-5 pa-2 rounded max-w-3/4"
                v-if="item.bargain && !item.bargain.dealId"
                >Chủ trọ không đồng ý với mức giá bạn đề xuất.
              </span>
              <span class="font-nunito text-gray text-caption">{{
                getTimeSendMsg(item.createdAt)
              }}</span>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <!-- chat -->
    <div class="input">
      <div class="d-flex flex-no-wrap mt-1 mx-2">
        <v-text-field
          autofocus
          clearable
          dense
          outlined
          flat
          placeholder="Aa"
          v-model="inputChat.text"
          class="ma-1 text-body-2"
          hide-details
          v-on:keyup.enter="sendMessage()"
        ></v-text-field>
        <v-btn icon class="ma-1" depressed @click="sendMessage()">
          <v-icon color="#727cf5">send</v-icon>
        </v-btn>
      </div>
      <div class="d-flex flex-no-wrap justify-center align-center" style="height: 65px">
        <v-btn
          rounded
          depressed
          class="ma-2 font-nunito btn-success"
          v-if="!hasPendingBooking && !hasBookingIncoming"
          @click="clickBooking()"
        >
          <v-icon left>event_available</v-icon>Đặt lịch
        </v-btn>
        <v-btn
          rounded
          depressed
          class="font-nunito btn-warning"
          @click="clickDeal()"
          v-if="!hasPendingDeal && !hasPendingBooking && !hasBookingIncoming"
        >
          <v-icon left>monetization_on</v-icon>Trả giá
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dateTimePickerStepper from './dateTimePickerStepper.vue';
import firebase from '../../config/firebase';
import actions from '../../config/pushNotificationActions';
// const { sendBookingNotification } = utils;
const { store } = firebase;
const chatCollectionRef = store.collection('chat');

export default {
  name: 'ChatBox',
  components: { dateTimePickerStepper },
  props: ['info', 'group'],
  methods: {
    ...mapActions({
      createBooking: 'user/createBooking',
      getDeals: 'user/getDeals',
      getBookings: 'user/getBookings',
      getDeal: 'user/getDeal',
      cancelDeal: 'user/cancelDeal',
      cancelBooking: 'user/cancelBooking',
      sendNotification: 'user/sendNotification',
    }),
    myOnScroll() {},
    clickBooking() {
      if (this.hasIncommingBooking) {
        this.messageTitle = 'Bạn đã có lịch hẹn xem loại phòng này!';
        this.messageAction = 'Để đặt lịch hẹn mới, vui lòng hủy lịch hẹn trước đó';
        this.warningDialog = true;
      }
      if (this.hasUnreplyBargain) {
        this.messageTitle = 'Bạn hiện tại đang có một đề nghị trả giá chưa được chấp nhận!';
        this.messageAction = 'Để đặt lịch, vui lòng hủy trả giá';
        this.warningDialog = true;
      } else {
        this.dateTimeOverlay.show = true;
      }
    },
    clickDeal() {
      if (this.hasUnreplyBargain) {
        this.messageTitle = 'Bạn hiện tại đang có một đề nghị trả giá chưa được chấp nhận!';
        this.messageAction = 'Để đề xuất trả giá mới, vui lòng hủy đề xuất trả giá trước đó';
        this.warningDialog = true;
      } else {
        this.bargainOverlay.show = true;
      }
    },
    bargain(content) {
      this.bargainOverlay.show = false;
      const newContent = content;
      newContent.bargain = {
        originalPrice: this.info.price,
        newPrice: this.bargainOverlay.price,
        status: 'wait',
        typeName: this.info.title,
        groups: this.group,
      };
      this.messCollectionRef.add(newContent);
      this.messCollectionRef.parent.update({
        lastedMessage: newContent,
      });
      this.sendNotification({
        title: `Trả giá mới từ: ${this.userState.data.username}`,
        body: `${this.info.price}tr -> ${this.bargainOverlay.price}tr`,
        action: actions.NEW_MESSAGE,
        id: '',
        icon: this.userState.data.avatar,
        vendorId: this.id.vendorId,
        renterId: null,
      });
    },
    book(content) {
      this.bargainOverlay.show = false;
      const newContent = content;
      newContent.book = {
        date: this.dateTimeOverlay.date,
        time: this.dateTimeOverlay.time,
        cancel: false,
      };
      const renterId = this.userState.data.userId;
      const { vendorId, typeId } = this.id;
      const lastedDeal = this.findLastedDeal(renterId, vendorId, typeId);
      const dateTime = this.dateTimeOverlay.date.split('/');
      const timeTime = this.dateTimeOverlay.time.split(':');
      const meetTime = new Date(
        dateTime[2],
        dateTime[1] - 1,
        dateTime[0],
        timeTime[0],
        timeTime[1],
      ).getTime();
      const bookingToApi = {
        renterId,
        vendorId,
        typeId,
        meetTime,
        dealId: lastedDeal ? lastedDeal.dealId : null,
        status: 'INCOMING',
      };
      console.log(bookingToApi);
      this.createBooking(bookingToApi).then(() => {
        // sendBookingNotification(this.newlyCreatedBooking);
        newContent.book.bookingId = this.newlyCreatedBooking.bookingId;
        this.messCollectionRef.add(newContent);
        this.messCollectionRef.parent.update({
          lastedMessage: newContent,
        });
        this.sendNotification({
          title: `Lịch hẹn mới từ: ${this.userState.data.username}`,
          body: `Thời gian: ${new Date(meetTime).toLocaleString()}`,
          action: actions.NEW_BOOKING,
          id: newContent.book.bookingId,
          icon: this.userState.data.avatar,
          vendorId: this.id.vendorId,
          renterId: null,
        });
      });
    },
    sendMessage(type = null) {
      const content = {
        bargain: null,
        book: null,
        message: this.inputChat.text,
        createdAt: Date.now(),
        sender: 'renter',
      };
      this.createDoc().then(() => {
        if (type === null) {
          console.log('content', content);
          this.messCollectionRef.add(content);
          this.docRef.update({
            lastedMessage: content,
          });
          this.sendNotification({
            title: `Tin nhắn mới từ: ${this.userState.data.username}`,
            body: `${content.message}`,
            action: 'NEW_MESSAGE',
            id: '',
            icon: this.userState.data.avatar,
            vendorId: this.id.vendorId,
            renterId: null,
          });
        } else if (type === 'book') {
          this.book(content);
        } else if (type === 'bargain') {
          this.bargain(content);
          this.bargainOverlay.step = 1;
        }
        this.docRef.update({
          updated: Date.now(),
        });
      });
      this.$nextTick(() => {
        this.scrollToBottom();
        this.inputChat.text = '';
      });
    },
    async createDoc() {
      const { userId } = this.userState.data;
      const { vendorId, typeId, groupId } = this.id;
      const docRef = chatCollectionRef.doc(`renter-${userId}:vendor-${vendorId}:type-${typeId}`);
      await docRef.get().then((doc) => {
        if (!doc.exists) {
          doc.ref.set({
            vendorId,
            renterId: userId,
            typeId,
            groupId,
            updated: Date.now(),
            lastedMessage: null,
          });
        }
      });
      this.messCollectionRef = docRef.collection('messages');
      this.docRef = docRef;
    },
    setMessage(messages) {
      this.items = messages;
    },
    fetchMessages() {
      // this.createDoc();
      const { userId } = this.userState.data;
      const { vendorId, typeId } = this.id;
      const docRef = chatCollectionRef.doc(`renter-${userId}:vendor-${vendorId}:type-${typeId}`);
      this.messCollectionRef = docRef.collection('messages');
      this.messCollectionRef.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
        const items = [];
        this.dealIds = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({ ...data, id: doc.id });
          if (data.bargain && data.bargain.dealId) {
            this.dealIds.push(data.bargain.dealId);
          }
        });
        this.items = items;
        this.$nextTick(() => this.scrollToBottom());
        if (this.dealIds.length > 0) {
          this.getDeals();
        }
      });
    },
    scrollToBottom() {
      // eslint-disable-next-line
      const chatbox = this.$refs.chatbox;
      chatbox.scrollTop = chatbox.scrollHeight;
    },
    receivedDateTime(e) {
      this.dateTimeOverlay.show = false;
      this.dateTimeOverlay.date = e.date;
      this.dateTimeOverlay.time = e.time;
      this.sendMessage('book');
    },
    getSimpleFormatDate(date) {
      return `${date.getDate()}/
            ${date.getMonth() + 1}/
            ${date.getFullYear()}`;
    },
    doCancelDeal(dealId) {
      this.cancelDeal(dealId);
    },
    doCancelBooking() {
      const { bookingId, docId } = this.bookingCancel.id;
      this.cancelBooking(bookingId).then(() => {
        this.messCollectionRef.doc(docId).update({
          'book.cancel': true,
        });
        this.bookingCancel.id.bookingId = null;
        this.bookingCancel.id.docId = null;
        this.bookingCancel.show = false;
        this.getBookings();
      });
    },
    showBookingCancel(bookingId, docId) {
      this.bookingCancel.show = true;
      this.bookingCancel.id = { bookingId, docId };
    },
    doCancelBargain() {
      const { docId } = this.bargainCancel.id;
      this.messCollectionRef.doc(docId).update({
        'bargain.status': 'cancel',
      });
      this.resetBargainCancel();
    },
    showBargainCancel(docId) {
      this.bargainCancel.show = true;
      this.bargainCancel.id.docId = docId;
    },
    resetBargainCancel() {
      this.bargainCancel.show = false;
      this.bargainCancel.id.docId = null;
    },
    getAvatarTitle() {
      return this.group.groupName
        .substring(this.group.groupName.lastIndexOf(' ') + 1)
        .substring(0, 1);
    },
    getTimeSendMsg(createdTime) {
      const date = new Date(createdTime).toLocaleDateString('vi-vn');
      const time = new Date(createdTime).toLocaleTimeString('vi-vn').substr(0, 5);
      const today = new Date().toLocaleDateString('vi-vn');
      if (today === date) {
        return time;
      }
      return `${time}, ${date}`;
    },
    compareBargainPrice(originalPrice, bargainPrice) {
      return Number(originalPrice) >= Number(bargainPrice);
    },
  },
  data: () => ({
    rules: {
      required: (value) => !!value || 'Giá không hợp lệ',
      max(value, max) {
        return (value || 'Giá không hợp lệ') < max || `Giá thuê nên nhỏ hơn ${max}`;
      },
      min(value) {
        return (value || 'Giá không hợp lệ') > 0 || 'Giá thuê nên lớn hơn 0';
      },
    },
    bookingCancel: {
      show: false,
      id: {
        bookingId: null,
        docId: null,
      },
    },
    bargainCancel: {
      show: false,
      id: {
        docId: null,
      },
    },
    dateTimeOverlay: {
      show: false,
      width: 350,
      date: '',
      time: '',
    },
    bargainOverlay: {
      show: false,
      price: 0,
      step: 1,
    },
    inputChat: {
      text: '',
    },
    items: [],
    messCollectionRef: null,
    docRef: null,
    dealIds: [],
    warningDialog: false,
    messageAction: '',
    messageTitle: '',
  }),
  created() {
    Promise.all([this.getDeals, this.getBookings]).then(() => {
      this.fetchMessages();
    });
    this.bargainOverlay.price = this.info.price - 0.1;
  },
  mounted() {},
  computed: {
    isLoading() {
      const loadingUser = this.userState.isLoading;
      const loadingBookings = this.$store.state.user.bookings.isLoading;
      const loadingDeals = this.$store.state.user.bookings.isLoading;
      return loadingUser || loadingBookings || loadingDeals;
    },
    ...mapGetters({
      findLastedDeal: 'user/findLastedDeal',
      findPendingBooking: 'user/findPendingBooking',
    }),
    hasPendingDeal() {
      const renterId = this.userState.data.userId;
      const { vendorId, typeId } = this.id;
      const res = this.findLastedDeal(renterId, vendorId, typeId);
      if (res) {
        return true;
      }
      return false;
    },
    hasPendingBooking() {
      const renterId = this.userState.data.userId;
      const { vendorId, typeId } = this.id;
      const res = this.findPendingBooking(renterId, vendorId, typeId);
      if (!res) {
        return false;
      }
      return true;
    },
    hasBookingIncoming() {
      const bookingIncoming = this.items.find((message) => message.book && !message.book.cancel);
      return bookingIncoming !== undefined;
    },
    userState() {
      return this.$store.state.user.user;
    },
    id() {
      return {
        typeId: this.info.typeId,
        groupId: this.group.groupId,
        renterId: this.userState.renterId,
        vendorId: this.group.vendorId,
      };
    },
    isCreatingBooking() {
      return this.$store.state.user.bookings.isLoading;
    },
    newlyCreatedBooking() {
      return this.$store.state.user.bookings.newlyCreated;
    },
    filteredMessage() {
      return this.items.filter((item) => {
        if (item.sender === 'vendor' && item.bargain) {
          return false;
        }
        return true;
      });
    },
    getLastDeal() {
      let allMsg = this.filteredMessage;
      allMsg.sort((a, b) => a.createdAt - b.createdAt);
      allMsg = allMsg.filter(
        (m) => m.sender === 'renter' && m.bargain && m.bargain.status === 'accept',
      );
      if (allMsg && allMsg.length !== 0) {
        return allMsg[allMsg.length - 1];
      }
      return null;
    },
    hasUnreplyBargain() {
      return this.items.some(
        (item) => item.sender === 'renter' && item.bargain && item.bargain.status === 'wait',
      );
    },
    bookings() {
      return this.$store.state.user.bookings.data;
    },
    hasIncommingBooking() {
      return (
        this.bookings.find((b) => b.type.typeId === this.typeId && b.status === 'INCOMING') &&
        this.bookings.find((b) => b.type.typeId === this.typeId && b.status === 'INCOMING')
          .length !== 0
      );
    },
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.renterChatMessage {
  background-color: #f0f2f5;
  border-radius: 20px;
  font-family: 'Nunito', sans-serif !important;
}
.renterEvent {
  /* border: 1px solid #dee2e6 !important; */
  border-radius: 0.25rem !important;
  background-color: #f9f9fd !important;
}
/* .renterEvent {
  border-radius: 15px;
  color: #6c757d !important;
  background-color: #f0f2f5;
} */
.vendorChatMessage {
  background-color: #fef5e4;
  border-radius: 20px;
  font-family: 'Nunito', sans-serif !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #727cf5 !important;
}
</style>
