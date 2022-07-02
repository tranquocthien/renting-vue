<template>
  <!-- eslint-disable max-len -->
  <div>
    <!-- <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
    <!-- <v-container v-if="!isLoading"> -->
    <v-container>
      <v-row justify="center" class="mt-10">
        <v-col cols="11" md="11" lg="11" xl="10" sm="11" class="white">
          <v-row class="d-flex justify-space-around">
            <v-col cols="12" md="2">
              <!-- <v-btn-toggle
                v-model="buttonGroup.selectedBookingStatus"
                tile
                color="deep-purple accent-3"
                group
                _class="d-flex flex-column"
              >
                  <v-btn value="incomming">
                    Sắp tới
                    <span class="amber--text">({{ counter.incomming }})</span>
                  </v-btn>

                  <v-btn value="center">
                    Đã xem phòng
                    <span class="amber--text">({{ counter.done }})</span>
                  </v-btn>

                  <v-btn value="right">
                    Bỏ lỡ
                    <span class="amber--text">({{ counter.cancel }})</span>
                  </v-btn>
              </v-btn-toggle> -->
              <v-row>
                <v-col cols="4" md="12" class="py-2">
                  <v-btn
                    v-model="status"
                    min-width="100%"
                    class="bg-info-lighten elevation-0 text-info font-nunito size9rem d-flex justify-start"
                    value="incoming"
                    style="letter-spacing: 0.01rem !important;"
                    ><v-icon x-small class="mr-1">stop_circle</v-icon>Sắp tới</v-btn
                  >
                </v-col>
                <v-col cols="4" md="12" class="py-2">
                  <!-- <v-btn
                    :color="color ? 'red' : 'yellow'"
                    min-width="100%"
                    tile
                    dark
                    @click="saptoi()"
                    >Đã xem phòng</v-btn
                  > -->
                  <v-btn
                    v-model="status"
                    min-width="100%"
                    class="bg-warning-lighten elevation-0 text-warning font-nunito size9rem d-flex justify-start"
                    value="done"
                    style="letter-spacing: 0.01rem !important;"
                    ><v-icon x-small class="mr-1">stop_circle</v-icon>Đã xem phòng</v-btn
                  >
                </v-col>
                <v-col cols="4" md="12" class="py-2">
                  <v-btn
                    v-model="status"
                    min-width="100%"
                    class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start"
                    value="done"
                    style="letter-spacing: 0.01rem !important;"
                    ><v-icon x-small class="mr-1">stop_circle</v-icon>Đã hủy</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="9">
              <v-row>
                <v-btn-toggle v-model="buttonGroup.preNextCalendar" color="red">
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2 pl-1"
                    style="
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                    "
                    @click="$refs.calendar.prev()"
                    dark
                    ><v-icon small color="white">mdi-chevron-left</v-icon>Trước</v-btn
                  >
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2 pr-1"
                    style="
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                    "
                    @click="$refs.calendar.next()"
                    dark
                    >Sau<v-icon color="white" small>mdi-chevron-right</v-icon></v-btn
                  >
                </v-btn-toggle>
                <v-btn @click="showToDay" class="btn-primary font-nunito text-subtitle-2 ml-4" dark
                  >Hôm nay</v-btn
                >
                <v-btn-toggle v-model="buttonGroup.typeDislay" class="ml-auto">
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2"
                    style="
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                    "
                    dark
                    value="month"
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
                    value="week"
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
                    value="day"
                    >Ngày</v-btn
                  >
                  <v-btn
                    class="btn-primary font-nunito text-subtitle-2"
                    style="
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                    "
                    value="4day"
                    dark
                    >Tất cả</v-btn
                  >
                </v-btn-toggle>
              </v-row>
              <v-app id="inspire" class="mt-5">
                <div>
                  <!-- <v-sheet tile height="54" color="grey lighten-3" class="d-flex">
                    <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-sheet> -->
                  {{ value }}
                  <v-sheet height="600">
                    <v-calendar
                      ref="calendar"
                      v-model="value"
                      :weekdays="weekday"
                      :type="buttonGroup.typeDislay"
                      :events="events"
                      :event-overlap-mode="'stack'"
                      :event-overlap-threshold="30"
                      :event-color="getEventColor"
                      @change="getEvents"
                      @click:event="showEvent"
                      locale="vi-vn"
                    ></v-calendar>
                  </v-sheet>
                </div>
              </v-app>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style scoped></style>
<script>
// import bookingItem from '@/components/view_cart/bookingItem.vue';
import { mapActions } from 'vuex';

export default {
  name: 'ViewCard',
  components: {
    // bookingItem
  },
  data: () => ({
    color: false,
    arrayEvents: null,
    date: new Date().toISOString().substr(0, 10),
    buttonGroup: {
      selectedBookingStatus: 0,
      preNextCalendar: 1,
      typeDislay: '4day',
    },
    status: '',
    // demo
    types: ['month', 'week', 'day', '4day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    // weekdays: [
    //   { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
    //   { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
    //   { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
    //   { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    // ],
    value: '',
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  methods: {
    ...mapActions({
      getBookings: 'user/getBookings',
      getUser: 'user/getUser',
      getProvinces: 'renter/common/getProvinces',
    }),
    saptoi() {
      this.color = !this.color;
    },
    showToDay() {
      this.value = '';
    },
    showEvent(event) {
      console.log(event);
    },
    // demo
    getEvents({ start, end }) {
      console.log(start);
      console.log(this.bookings);
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      console.log(this.bookings.length);
      console.log(this.bookings[0]);
      for (let i = 0; i < this.bookings.length; i += 1) {
        const booking = this.bookings[i];
        const meetTime = new Date(booking.meetTime);
        if (meetTime >= min && meetTime <= max) {
          const endTime = meetTime.setMinutes(meetTime.getMinutes() + 30);
          events.push({
            name: booking.group.groupName,
            start: meetTime.getTime(),
            end: endTime,
            color: 'pink',
            timed: true,
            data: booking,
          });
        }
      }
      console.log(events);
      this.events = events;
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  created() {
    this.getUser().then(() => {
      this.getBookings().then(() => this.getEvents());
      // this.getBookings().then(() => {
      //   // const bookings = this.$store.state.user.bookings.data;
      //   // this.arrayEvents = bookings.map((booking) =>
      // new Date(booking.meetTime).toISOString().substr(0, 10),);
      // });
    });
  },
  computed: {
    isLoading() {
      const loadingUser = this.$store.state.user.user.isLoading;
      const loadingBookings = this.$store.state.user.bookings.isLoading;
      const loadingDeals = this.$store.state.user.deals.isLoading;
      const loadingProvinces = this.$store.state.renter.common.provinces.isLoading;
      return loadingUser || loadingBookings || loadingDeals || loadingProvinces;
    },
    bookings() {
      const list = this.$store.state.user.bookings.data;
      const result = list.filter((booking) => {
        const selectedIdx = this.buttonGroup.selectedBookingStatus;
        switch (selectedIdx) {
          case 0:
            return booking.status === 'INCOMING';
          case 1:
            return booking.status === 'DONE';
          case 2:
            return booking.status === 'CANCELLED';
          default:
            return true;
        }
      });
      return result;
    },
    incommingBooking() {
      return this.bookings.filter((booking) => booking.status === 'INCOMING');
    },
    doneBookings() {
      return this.bookings.filter((booking) => booking.status === 'DONE');
    },
    cancelledBookings() {
      return this.bookings.filter((booking) => booking.status === 'CANCELLED');
    },
    isLoadingBooking() {
      return this.$store.state.user.bookings.isLoading;
    },
    counter() {
      const bookings = this.$store.state.user.bookings.data;
      let incomming = 0;
      let done = 0;
      let cancel = 0;
      bookings.forEach((booking) => {
        switch (booking.status) {
          case 'INCOMING':
            incomming += 1;
            break;
          case 'DONE':
            done += 1;
            break;
          case 'CANCELLED':
            cancel += 1;
            break;
          default:
            console.log('error in counter computed');
        }
      });
      return { incomming, done, cancel };
    },
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
</style>
