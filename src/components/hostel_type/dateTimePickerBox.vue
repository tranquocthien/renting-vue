<template>
  <div
    class="d-flex flex-column align-center justify-center pa-4"
    v-if="!isLoading"
    style="background-color: #f7f7f7; border-bottom: 1px solid #eee; height: 100%"
  >
    <v-dialog v-model="dateTimePicker.isOpenPicker" width="400">
      <LoginBox v-if="!userState.data" />
      <!-- <v-card v-if="!userState.data" color="white" light>
        <v-card-title>Đăng nhập để đặt lịch xem phòng</v-card-title>
        <v-card-actions>
          <v-btn :to="registerRouteObject" dark class="green lighten-3">
            <v-icon>create</v-icon>Tạo tài khoản mới
          </v-btn>
          <v-spacer />
          <v-btn :to="loginRouteObject" dark class="blue lighten-3">
            <v-icon>login</v-icon>Đăng nhập
          </v-btn>
        </v-card-actions>
      </v-card> -->
      <dateTimePickerStepper
        v-if="userState.data"
        v-on:cancel="dateTimePicker.isOpenPicker = false"
        v-on:ok="receivedDateTime"
        :groupId="groupId"
        :price="type.price"
        :lastDeal="getLastDeal"
        :priceUnit="type.priceUnit"
      />
    </v-dialog>
    <v-dialog v-model="warningDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex flex-column justify-center px-8">
          <v-icon large class="material-icons-outlined" color="#727cf5">report_problem</v-icon>
          <span
            class="text-gray font-nunito"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
            "
            >Bạn đã có lịch hẹn xem loại phòng này!</span
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
    <v-avatar height="70" width="70" color="#727cf5" @click="getGroup()" class="cursor">
      <v-img v-if="avatar" max-height="70" max-width="70" :src="avatar" />
      <span v-else class="text-h4 white--text">{{ getAvatarTitle() }}</span>
    </v-avatar>
    <span class="text-body-1 font-weight-bold text-center font-nunito mt-2" style="color: #222">
      {{ name }}
    </span>
    <!-- <div class="d-flex align-center font-nunito my-3">
      <v-icon color="#ffbc00" class="mr-2" x-small>fas fa-star</v-icon>
      <p class="grey--text mb-0">{{ ` ${rating.average} / 5` }}</p>
      <p class="mb-0 ml-1">( {{ rating.total }} )</p>
    </div> -->
    <div class="d-flex mb-4 mt-3">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="#ffbc00"
            outlined
            @click="$emit('openMessage')"
            rounded
            :disabled="userState.data && isVendor"
            class="font-nunito font-weight-bold"
            style="letter-spacing: 0.05rem !important; background-color: #fff"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon class="mr-3">fas fa-comment-dots</v-icon>Nhắn tin ngay!
          </v-btn>
        </template>
        <span>Hãy nhắn tin để thỏa thuận giá!</span>
      </v-tooltip>
    </div>
    <div class="d-flex justify-center align-center">
      <v-dialog v-model="dialog.booking" persistent max-width="290">
        <template v-slot:activator="{ attrs }">
          <v-btn
            v-bind="attrs"
            _color="#4F60C9"
            width="80%"
            class="mx-7 text-subtitle-2 white--text py-5 bg-primary"
            depressed
            tile
            @click="clickBooking()"
            :disabled="hasPendingBooking || isVendor"
          >
            <v-icon left>event_available</v-icon>ĐẶT LỊCH XEM PHÒNG
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Xác nhận đặt lịch</v-card-title>
          <v-card-text v-if="dateTimePicker.date != null && dateTimePicker.time != null">
            Bạn muốn đặt lịch vào ngày
            <span>{{ dateTimePicker.date }}</span>
            vào lúc {{ dateTimePicker.time }} tại nhà trọ {{ name }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog.booking = false">Không</v-btn>
            <v-btn color="green darken-1" text @click="sendBooking">Có</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.display" :bottom="snackbar.bottom" :color="snackbar.color">
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar.display = false">Đóng</v-btn>
        </template>
      </v-snackbar>
    </div>
    <span class="font-nunito text-caption mt-4" style="text-align: end !important"
      >TRẠNG THÁI:
      <span class="text-subtitle-2" style="color: #1edb4c !important" v-if="availableRoom !== 0">
        {{ availableRoom }} phòng trống / {{ currentBooking }} lịch hẹn
      </span>
      <span class="text-subtitle-2" style="color: #1edb4c !important" v-else>
        Không còn phòng trống
      </span>
    </span>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import dateTimePickerStepper from './dateTimePickerStepper.vue';
import utils from '../../utils/firebaseNotification';
import LoginBox from '../login/loginBox.vue';
import firebase from '../../config/firebase';

const { sendBookingNotification } = utils;
const { store } = firebase;
const chatCollectionRef = store.collection('chat');

export default {
  name: 'DateTimePickerBox',
  components: {
    dateTimePickerStepper,
    LoginBox,
  },
  props: {
    name: String,
    avatar: String,
    rating: Object,
    groupId: Number,
    type: Object,
    vendorId: String,
    currentBooking: Number,
    availableRoom: Number,
  },
  data: () => ({
    dateTimePicker: {
      isOpenPicker: false,
      date: null,
      time: null,
    },
    dialog: {
      booking: false,
    },
    snackbar: {
      display: false,
      message: '',
      color: 'red',
      bottom: true,
    },
    warningDialog: false,
    messageAction: '',
    items: [],
  }),
  methods: {
    ...mapActions({
      createBooking: 'user/createBooking',
      clearNewlyCreatedBooking: 'user/clearNewlyCreatedBooking',
      getBookings: 'user/getBookings',
      getDeals: 'user/getDeals',
    }),
    showSnackbar(color, message) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.display = true;
    },
    async sendBooking() {
      this.dialog.booking = false;
      this.showSnackbar('yellow', 'Booking của bạn đang được tạo');
      const dateTime = this.dateTimePicker.date.split('/');
      const timeTime = this.dateTimePicker.time.split(':');
      const bookingObj = {
        renterId: this.userState.data.userId,
        vendorId: this.vendorId,
        typeId: this.type.typeId,
        status: 'INCOMING',
        dealId: null,
        meetTime: new Date(
          dateTime[2],
          dateTime[1] - 1,
          dateTime[0],
          timeTime[0],
          timeTime[1],
        ).getTime(),
      };
      await this.createBooking(bookingObj);
      const success = this.newlyCreated;
      if (success) {
        this.showSnackbar('success', 'Bạn đã đặt lịch hẹn xem phòng thành công!!!');
        await sendBookingNotification(this.newlyCreated);
        this.clearNewlyCreatedBooking();
      } else {
        this.showSnackbar('red', 'Đặt lịch xem phòng thất bại');
      }
    },
    async receivedDateTime(event) {
      this.dateTimePicker.isOpenPicker = false;
      this.dateTimePicker.date = event.date;
      this.dateTimePicker.time = event.time;
      await this.sendBooking();
    },
    getAvatarTitle() {
      return this.name.substring(this.name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    getGroup() {
      this.$router.push(`/group/${this.groupId}`);
    },
    clickBooking() {
      if (this.hasIncommingBooking) {
        this.messageAction = 'Để đặt lịch hẹn mới, vui lòng hủy lịch hẹn trước đó';
        this.warningDialog = true;
      } else {
        this.dateTimePicker.isOpenPicker = true;
      }
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
      });
    },
  },
  computed: {
    isLoading() {
      const loadingUser = this.userState.isLoading;
      const loadingBooking = this.$store.state.user.bookings.isLoading;
      return loadingUser || loadingBooking;
    },
    ...mapGetters({
      findPendingBooking: 'user/findPendingBooking',
    }),
    id() {
      return {
        typeId: this.type.typeId,
        groupId: this.groupId,
        renterId: this.userState.renterId,
        vendorId: this.vendorId,
      };
    },
    hasIncommingBooking() {
      return (
        this.bookings.find((b) => b.type.typeId === this.type.typeId && b.status === 'INCOMING') &&
        this.bookings.find((b) => b.type.typeId === this.type.typeId && b.status === 'INCOMING')
          .length !== 0
      );
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
    newlyCreated() {
      return this.$store.state.user.bookings.newlyCreated;
    },
    bookings() {
      return this.$store.state.user.bookings.data;
    },
    hasPendingBooking() {
      if (this.userState.data) {
        const renterId = this.userState.data.userId;
        const res = this.findPendingBooking(renterId, this.vendorId, this.type.typeId);
        return res != null;
      }
      return false;
    },
    userState() {
      return this.$store.state.user.user;
    },
    isVendor() {
      return this.userState.data && this.userState.data.role === 'VENDOR';
    },
    loginRouteObject() {
      return {
        name: 'Login',
        params: {
          preUrl: this.$route.path,
        },
      };
    },
    registerRouteObject() {
      return {
        name: 'Register',
        params: {
          preUrl: this.$route,
        },
      };
    },
  },
  created() {
    if (this.userState.data) {
      Promise.all([this.getDeals, this.getBookings]).then(() => {
        this.fetchMessages();
      });
    }
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
