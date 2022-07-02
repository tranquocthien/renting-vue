<template>
  <div class="d-flex flex-column">
    <v-dialog v-model="dialog" width="400" persistent>
      <v-card>
        <v-card-title class="headline" style="background-color: #98b7d7; color: white">
          Mã quét
        </v-card-title>
        <v-card-text class="d-flex justify-center mt-5">
          <div v-if="!scanQRSuccess" class="d-flex flex-column justify-center align-center">
            <p>Người xem phòng quét mã để xác nhận đã gặp mặt.</p>
            <qrcode-vue :value="qrvalue" :size="200" level="H"></qrcode-vue>
          </div>
          <div v-if="scanQRSuccess" class="d-flex flex-column justify-center align-center">
            <p><v-icon color="green">done_outline</v-icon> Xác nhận gặp mặt thành công!</p>
            <p>Bạn có muốn tạo hợp đồng ngay?</p>
            <v-btn :to="`/vendor/contract?bookingId=${scanedBookingId}&mode=create`">
              <v-icon>far fa-handshake</v-icon> Tạo hợp đồng
            </v-btn>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog"> Đóng </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row class="d-flex justify-space-between ma-0">
      <v-col
        cols="12"
        md="4"
        class="pl-md-13 py-0 d-flex justify-sm-center justify-md-start align-center"
      >
        <span class="div-title">Lịch hẹn xem phòng sắp tới</span>
        <v-btn
          icon
          v-show="!showMobileSearchBar"
          @click="showMobileSearchBar = !showMobileSearchBar"
          class="hidden-sm-and-up ml-auto"
          ><v-icon color="#727cf5">search</v-icon></v-btn
        >
      </v-col>
      <v-col cols="12" class="hidden-sm-and-up d-flex align-center pa-0">
        <v-btn icon v-show="showMobileSearchBar"
          ><v-icon color="#727cf5" @click="showMobileSearchBar = !showMobileSearchBar"
            >mdi-chevron-double-left</v-icon
          ></v-btn
        >
        <v-text-field
          v-show="showMobileSearchBar"
          label="Tìm theo tên người thuê"
          v-model="searchQuery"
          solo
          hide-details
          class="text-muted py-1 size-sub-2 light-text-field font-nunito"
          clearable
          _input="changeSearchQuery"
          style="
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            transition: opacity 0.25s ease-out;
          "
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" class="pa-0 d-flex justify-center justify-md-end">
        <v-btn-toggle
          mandatory
          v-model="filterBooking"
          tile
          color="#4250f2"
          group
          class="hidden-xs-only"
        >
          <v-btn value="day" small class="font-nunito"> Hôm nay </v-btn>
          <v-btn value="week" small class="font-nunito"> Tuần này </v-btn>
          <v-btn value="month" small class="font-nunito"> Tháng này </v-btn>
        </v-btn-toggle>
        <v-btn
          icon
          v-show="!showSearchBar"
          @click="showSearchBar = !showSearchBar"
          class="hidden-xs-only"
          ><v-icon color="#98a6ad">search</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <div v-show="showSearchBar">
      <v-row no-gutters class="d-flex justify-md-end justify-center">
        <v-col cols="9" md="4" class="d-flex justify-center align-center">
          <v-btn icon
            ><v-icon color="#98a6ad" @click="showSearchBar = !showSearchBar"
              >mdi-chevron-double-left</v-icon
            ></v-btn
          >
          <v-text-field
            label="Tìm kiếm theo tên"
            v-model="searchQuery"
            append-icon="search"
            solo
            hide-details
            class="text-muted pa-0 size-sub-2 slide-booking"
            height="10"
            rounded
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <v-slide-group v-if="bookings.length > 0" show-arrows class="hidden-xs-only">
      <v-slide-item
        v-for="booking in bookings"
        :key="booking.bookingId"
        v-slot:default="{ active, toggle }"
      >
        <v-card
          class="ma-5 pa-3"
          :color="active ? 'indigo lighten-5' : 'white'"
          max-width="250"
          @click="toggle"
          v-if="booking.status !== 'CANCELLED'"
        >
          <span
            class="text-muted font-nunito d-flex"
            style="font-weight: 400 !important; color: #98a6ad !important; font-size: 0.9375rem"
            ><span>{{ getDateString(Number(booking.meetTime)) }}</span>
            <span class="ml-auto">{{ getTimeString(Number(booking.meetTime)) }}</span>
            <v-badge color="red" content="Mới!" bordered left v-if="booking.new"> </v-badge>
          </span>
          <v-list-item dense class="pa-0">
            <v-list-item-avatar
              color="#727cf5"
              height="35"
              width="35"
              min-width="35"
              class="d-flex justify-center"
            >
              <v-img :src="booking.renter.avatar" v-if="booking.renter.avatar"></v-img>
              <span class="text-overline white--text" v-else>{{
                getAvatarTitle(booking.renter.username)
              }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                _style="fontsize: 16px; fontweight: bold; color: #1f17ff;"
                class="font-nunito text-primary-dark"
                >{{ booking.renter.username }}</v-list-item-title
              >
              <v-list-item-subtitle style="color: coral">
                {{ booking.renter.phone }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-if="booking.status === 'INCOMING'" icon @click="changeToString(booking)">
                <v-icon> mdi-qrcode </v-icon>
              </v-btn>
              <v-btn
                v-if="booking.status === 'DONE' && !booking.contractId"
                icon
                :to="`/vendor/contract?bookingId=${booking.bookingId}&mode=create`"
              >
                <v-icon>far fa-handshake</v-icon></v-btn
              >
              <v-btn v-if="booking.status === 'DONE' && booking.contractId" icon>
                <v-icon>done_all</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <div class="text d-flex align-center">
            <v-icon class="px-2">home</v-icon>
            <span class="size9rem font-nunito text-black">{{ booking.group.groupName }}</span>
          </div>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <span
      class="hidden-xs-only font-nunito size1rem text-primary text-center ma-4"
      v-if="bookings.length === 0"
      >Bạn không có lịch hẹn xem phòng nào vào thời gian này!</span
    >
    <span
      v-if="bookings.length > 0"
      class="hidden-xs-only ml-auto mr-8 font-nunito text-primary-hover size-sub-3 cursor"
      @click="viewBookings()"
    >
      Xem thêm
    </span>
    <v-slide-group v-if="allBooking.length > 0" show-arrows class="hidden-sm-and-up">
      <v-slide-item
        v-for="booking in bookings"
        :key="booking.bookingId"
        v-slot:default="{ active, toggle }"
        class="my-3"
      >
        <v-card
          class="ma-5 pa-3"
          :color="active ? 'indigo lighten-5' : 'white'"
          max-width="250"
          @click="toggle"
          v-if="booking.status !== 'CANCELLED'"
        >
          <span
            class="text-muted font-nunito d-flex"
            style="font-weight: 400 !important; color: #98a6ad !important; font-size: 0.9375rem"
            ><span>{{ getDateString(Number(booking.meetTime)) }}</span>
            <span class="ml-auto">{{ getTimeString(Number(booking.meetTime)) }}</span>
            <v-badge color="red" content="Mới!" bordered left v-if="booking.new"> </v-badge>
          </span>
          <v-list-item dense class="pa-0">
            <v-list-item-avatar
              color="#727cf5"
              height="35"
              width="35"
              min-width="35"
              class="d-flex justify-center"
            >
              <v-img :src="booking.renter.avatar" v-if="booking.renter.avatar"></v-img>
              <span class="text-overline white--text" v-else>{{
                getAvatarTitle(booking.renter.username)
              }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                _style="fontsize: 16px; fontweight: bold; color: #1f17ff;"
                class="font-nunito text-primary-dark"
                >{{ booking.renter.username }}</v-list-item-title
              >
              <v-list-item-subtitle style="color: coral">
                {{ booking.renter.phone }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-if="booking.status === 'INCOMING'" icon @click="changeToString(booking)">
                <v-icon> mdi-qrcode </v-icon>
              </v-btn>
              <v-btn
                v-if="booking.status === 'DONE' && !booking.contractId"
                icon
                :to="`/vendor/contract?bookingId=${booking.bookingId}&mode=create`"
              >
                <v-icon>far fa-handshake</v-icon></v-btn
              >
              <v-btn v-if="booking.status === 'DONE' && booking.contractId" icon>
                <v-icon>done_all</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <div class="text d-flex align-center">
            <v-icon class="px-2">home</v-icon>
            <span class="size9rem font-nunito text-black">{{ booking.group.groupName }}</span>
          </div>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <span
      class="hidden-sm-and-up font-nunito size1rem text-primary text-center ma-4"
      v-if="allBooking.length === 0"
      >Bạn không có lịch hẹn xem phòng nào vào thời gian này!</span
    >
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import { mapActions } from 'vuex';
import processFCMForegroundMixins from '../../mixins/processFCMForeground';
import pushNotificationAction from '../../../config/pushNotificationActions';

export default {
  name: 'SlideBooking',
  mixins: [processFCMForegroundMixins],
  components: {
    QrcodeVue,
  },
  methods: {
    ...mapActions({
      getBookings: 'user/getBookings',
    }),
    getDateString(milisecond) {
      const d = new Date(milisecond);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
    getTimeString(milisecond) {
      const d = new Date(milisecond);
      return `${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`;
    },
    changeToString(booking) {
      const { bookingId, qrCode } = booking;
      this.dialog = true;
      this.qrvalue = `booking:${bookingId}:${qrCode}`;
    },
    viewBookings() {
      this.$router.push('/vendor/booking');
    },
    getLastDayOfMonth(year, month) {
      return new Date(year, month, 0).getDate();
    },
    getEndOfWeek() {
      const date = new Date();
      const lastday = date.getDate() - date.getDay() + 7;
      return new Date(date.setDate(lastday));
    },
    getStartOfWeek() {
      const date = new Date();
      const diff = date.getDate() - date.getDay() + 1;
      return new Date(date.setDate(diff));
    },
    closeDialog() {
      this.dialog = false;
      this.scanQRSuccess = false;
    },
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
  },
  computed: {
    bookings() {
      const today = new Date();
      let min = new Date(today);
      let max = new Date(today);
      switch (this.filterBooking) {
        case 'day':
          min.setHours(0, 0, 0, 0);
          max.setHours(23, 59, 59, 59);
          break;
        case 'week':
          min = new Date(
            this.getStartOfWeek().getUTCFullYear(),
            this.getStartOfWeek().getMonth(),
            this.getStartOfWeek().getDate(),
          );
          console.log(today);
          max = new Date(
            this.getEndOfWeek().getUTCFullYear(),
            this.getEndOfWeek().getMonth(),
            this.getEndOfWeek().getDate(),
          );
          console.log(today);
          min.setHours(0, 0, 0, 0);
          max.setHours(23, 59, 59, 59);
          console.log({ min, max });
          break;
        case 'month':
          min = new Date(today.getUTCFullYear(), today.getMonth(), 1);
          max = new Date(
            today.getUTCFullYear(),
            today.getMonth(),
            this.getLastDayOfMonth(today.getUTCFullYear(), today.getMonth()),
          );
          min.setHours(0, 0, 0, 0);
          max.setHours(23, 59, 59, 59);
          break;

        default:
          break;
      }
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        return this.$store.state.user.bookings.data
          .filter((item) => item.meetTime >= min.getTime() && item.meetTime <= max.getTime())
          .filter((item2) => {
            const res =
              item2.renter.username.toLowerCase().indexOf(this.searchQuery.trim().toLowerCase()) !==
              -1;
            return res;
          });
      }
      return this.$store.state.user.bookings.data
        .filter((item) => item.meetTime >= min.getTime() && item.meetTime <= max.getTime())
        .filter((booking) => !booking.contractId);
    },
    incommingBookings() {
      return this.bookings.filter((booking) => booking.status === 'INCOMING');
    },
    isLoadingBooking() {
      return this.$store.state.user.bookings.isLoading;
    },
    filteredBookings() {
      if (!this.timeDiff) {
        return this.bookings;
      }
      return null;
    },
    getBookingsByRealTime() {
      const { length } = this.$store.state.user.bookings.data;
      for (let i = 0; i < length; i += 1) {
        const booking = this.bookings.data[i];
        const meetTime = new Date(booking.meetTime);
        console.log(meetTime);
        return meetTime;
      }
      return null;
    },
    allBooking() {
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        return this.$store.state.user.bookings.data
          .filter((booking) => booking.status === 'INCOMING')
          .filter((item2) => {
            const res =
              item2.renter.username.toLowerCase().indexOf(this.searchQuery.trim().toLowerCase()) !==
              -1;
            return res;
          });
      }
      return this.$store.state.user.bookings.data.filter(
        (booking) => booking.status === 'INCOMING',
      );
    },
  },
  created() {
    if (this.bookings.length === 0) {
      this.getBookings();
    }
    this.registerMessaging();
  },
  data: () => ({
    chipItems: ['Hôm nay', 'Tuần này', 'Tháng này'],
    timeDiff: null,
    dialog: false,
    qrvalue: null,
    searchQuery: null,
    scanQRSuccess: false,
    scanedBookingId: null,
    filterBooking: 'week',
    showSearchBar: false,
    showMobileSearchBar: false,
  }),
  watch: {
    newMessage: {
      handler() {
        if (this.newMessage.data.action === pushNotificationAction.SCAN_BOOKING) {
          this.scanQRSuccess = true;
          this.scanedBookingId = Number(this.newMessage.data.id);
        }
      },
      deep: true,
    },
  },
};
</script>
<style>
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.slide-booking.v-text-field.v-text-field--solo .v-input__control {
  min-height: 35px;
}
.slide-booking .theme--light.v-label {
  color: #98a6ad !important;
  font-family: 'Nunito', sans-serif !important;
}
.slide-booking .theme--light.v-icon {
  color: #98a6ad !important;
}
</style>
