<template>
  <!-- eslint-disable max-len -->
  <div>
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="!isLoading">
      <div v-if="stepper.step == 1">
        <v-card color="white" width="400" class="px-1 pb-6 pt-2">
          <v-card-text>
            <span
              class="font-weight-bold text-subtitle-2 py-0"
              :style="{ color: '#101526', textAlign: 'center' }"
              >Chọn Ngày</span
            >
            <div :style="{ width: '30px', height: '2px', backgroundColor: '#4F60C9' }"></div>
          </v-card-text>
          <v-chip-group class="mt-3" mandatory light v-model="pickedDate" center-active show-arrows>
            <v-chip
              light
              v-for="(item, i) in schedules"
              :key="`item-${i}`"
              :value="i"
              label
              large
              class="pickDay mr-1 d-flex justify-center align-center"
              active-class="white--text"
              style="height: 60px"
              link
            >
              <div class="d-flex flex-column justify-center align-center pa-1 flex-wrap">
                <p class="ma-0 text-capitalize">{{ item.dayOfWeek }}</p>
                <p class="ma-0 font-weight-bold">{{ item.date }}</p>
              </div>
            </v-chip>
          </v-chip-group>
          <v-card-actions class="justify-center mt-4">
            <v-btn
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="stepper.step += 1"
              >Tiếp tục</v-btn
            >
            <v-btn
              small
              outlined
              color="#9e9fa7"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="$emit('cancel')"
              >Hủy</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
      <div v-if="stepper.step == 2">
        <v-card class="px-5 pb-6 pt-2" color="white" width="400" elevation="0">
          <v-card-text class="px-0">
            <span
              class="font-weight-bold text-subtitle-2 py-0"
              :style="{ color: '#101526', textAlign: 'center' }"
              >Chọn Giờ</span
            >
            <div :style="{ width: '30px', height: '2px', backgroundColor: '#4F60C9' }"></div>
          </v-card-text>
          <v-chip-group v-model="selectedTime" light column center-active show-arrows>
            <v-chip
              v-for="item in schedules[pickedDate].freeTimes"
              :key="item"
              :value="item"
              label
              class="pickTime mr-2 py-1 text-subtitle-2 text-xs-center font-nunito"
              active-class="white--text"
              link
              style="width: 60px"
              >{{ item }}</v-chip
            >
          </v-chip-group>
          <v-card-actions>
            <v-btn
              small
              outlined
              color="#9e9fa7"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="$emit('cancel')"
              >Hủy</v-btn
            >
            <v-btn
              small
              outlined
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="stepper.step -= 1"
              >Quay lại</v-btn
            >
            <v-btn
              v-if="selectedTime"
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="stepper.step += 1"
              >Tiếp tục</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
      <div v-if="stepper.step == 3">
        <v-card
          class="d-flex flex-column justify-center align-center pa-2"
          color="white"
          width="400"
        >
          <v-card-text class="d-flex flex-column">
            <span
              class="text-subtitle-1 font-weight-medium"
              :style="{ color: '#5a669f', textAlign: 'center' }"
              >Xác nhận bạn muốn đặt lịch hẹn xem phòng vào</span
            >
            <div class="d-flex justify-space-between mt-6 px-4">
              <div class="d-flex align-center">
                <div
                  class="d-flex justify-center align-center pa-2"
                  style="border: 2px solid #ecedf1; border-radius: 50px"
                >
                  <v-img max-height="15" max-width="15" src="../../assets/typeDetail/date.png" />
                </div>
                <span class="ml-2 text-subtitle-2" style="color: #101526">{{
                  schedules[pickedDate].formatDay
                }}</span>
              </div>
              <div class="d-flex align-center">
                <div
                  class="d-flex justify-center align-center pa-2"
                  style="border: 2px solid #ecedf1; border-radius: 50px"
                >
                  <v-img max-height="15" max-width="15" src="../../assets/typeDetail/time.png" />
                </div>
                <span class="ml-2 text-subtitle-2" style="color: #101526">{{ selectedTime }}</span>
              </div>
            </div>
            <div class="d-flex flex-column mt-2 px-4">
              <div class="d-flex align-end">
                <v-icon large color="#727cf5">mdi-home-currency-usd</v-icon>
                <span
                  class="font-nunito text-gray text-subtitle-1 ml-2 text-decoration-line-through"
                  v-if="lastDeal"
                  >{{ price }} {{ priceUnit }}</span
                >
                <span class="font-nunito text-warning text-subtitle-1 ml-auto" v-if="lastDeal">
                  <v-icon color="#ffbc00">{{
                    Number(price) >= Number(lastDeal.bargain.newPrice)
                      ? 'mdi mdi-arrow-down-bold'
                      : 'mdi mdi-arrow-up-bold'
                  }}</v-icon>
                  {{ lastDeal.bargain.newPrice }} {{ priceUnit }}
                </span>
                <span class="font-nunito text-warning text-subtitle-1 ml-2" v-else>
                  {{ price }} {{ priceUnit }}
                </span>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              small
              outlined
              color="#9e9fa7"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="$emit('cancel')"
              >Hủy</v-btn
            >
            <v-btn
              small
              outlined
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2"
              depressed
              @click="stepper.step -= 1"
              >Quay lại</v-btn
            >
            <v-btn
              small
              color="#4F60C9"
              class="text-caption px-4 py-2 mx-2 white--text"
              depressed
              @click="$emit('ok', pickDateAndTime())"
              >Đồng ý</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'dateTimePickerStepper',
  props: {
    width: {
      type: Number,
      required: false,
      default: undefined,
    },
    groupId: Number,
    price: Number,
    lastDeal: Object,
    priceUnit: String,
  },
  data: () => ({
    stepper: {
      step: 1,
    },
    schedules: [],
    dates: [],
    pickedDate: 0,
    selectedTime: null,
  }),
  methods: {
    ...mapActions({
      getSchedules: 'renter/hostelType/getSchedules',
      getDeals: 'user/getDeals',
    }),
    getNextDate(date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    },
    initListOf7Dates() {
      // this function return list of seven dates from today
      const today = new Date();
      const dates = [today];
      for (let i = 0; i < 7; i += 1) {
        dates.push(this.getNextDate(dates[i]));
      }
      return dates;
    },
    mapDateCode(code) {
      let day;
      switch (code) {
        case 0:
          day = 'SUN';
          break;
        case 1:
          day = 'MON';
          break;
        case 2:
          day = 'TUE';
          break;
        case 3:
          day = 'WED';
          break;
        case 4:
          day = 'THU';
          break;
        case 5:
          day = 'FRI';
          break;
        default:
          day = 'SAT';
          break;
      }
      return day;
    },
    get7dates() {
      const dates = this.initListOf7Dates();
      const sevenDates = [];
      for (let i = 0; i < 7; i += 1) {
        const day = {
          date: dates[i].getDate(),
          code: this.mapDateCode(dates[i].getDay()),
          formatDay: dates[i].toLocaleDateString('vi-vn'),
        };
        sevenDates.push(day);
      }
      return sevenDates;
    },
    modifyTimeRange(schedules) {
      const modifyListTimeRange = schedules.map((ltr) => ({
        ...ltr,
        timeRange: ltr.timeRange.map((tr) => ({
          start: tr.split(' - ')[0].split(':'),
          end: tr.split(' - ')[1].split(':'),
        })),
      }));

      const listFreeTime = modifyListTimeRange.map((tri) => ({
        ...tri,
        timeRange: tri.timeRange
          .sort((a, b) => Number(a.start[0]) - Number(b.start[0]))
          .map((tr) => {
            const startHour = Number(tr.start[0]);
            const endHour = Number(tr.end[0]);
            const freeTime = [];
            for (let index = startHour; index <= endHour; index += 1) {
              // if-else
              if (index === startHour && Number(tr.start[1]) === 30) {
                freeTime.push(`${startHour}:30`);
              } else if (index === endHour && Number(tr.end[1]) === 0) {
                freeTime.push(`${endHour}:00`);
              } else freeTime.push(`${index}:00`, `${index}:30`);
            }
            return freeTime;
          })
          .flat(),
      }));
      return listFreeTime;
    },
    getGroupSchedule() {
      const sevenDates = this.get7dates();
      const schedules = [];
      for (let i = 0; i < 7; i += 1) {
        const freeDay = this.modifyTimeRange(this.rawSchedule).filter(
          (d) => d.code === sevenDates[i].code,
        );
        let freeTimes = freeDay[0].timeRange;
        if (i === 0) {
          // i == 0 to confirm filter first day only (first day == today)
          const today = new Date();
          const freeTime = new Date();
          today.setHours(today.getHours() + 3);

          freeTimes = freeTimes.filter((t) => {
            const time = t.split(':');
            freeTime.setHours(time[0]);
            freeTime.setMinutes(time[1]);
            freeTime.setMilliseconds(0);
            return freeTime.getTime() > today.getTime();
          });
        }
        if (freeTimes.length !== 0) {
          const day = {
            scheduleId: freeDay[0].scheduleId,
            date: sevenDates[i].date,
            formatDay: sevenDates[i].formatDay,
            dayOfWeek: freeDay[0].dayOfWeek,
            freeTimes,
          };
          schedules.push(day);
        }
      }
      this.schedules = schedules;
    },
    pickDateAndTime() {
      return {
        date: this.schedules[this.pickedDate].formatDay,
        time: this.selectedTime,
      };
    },
    cancelPickDateAndTime() {
      this.pickedDate = null;
      this.selectedTime = null;
    },
  },
  created() {
    this.getDeals();
    this.getSchedules(this.groupId).then(() => this.getGroupSchedule());
    console.log(this.lastDeal);
  },
  computed: {
    rawSchedule() {
      return this.$store.state.renter.hostelType.schedules.data;
    },
    isLoading() {
      return this.$store.state.renter.hostelType.schedules.isLoading;
    },
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.pickDay.v-chip--active {
  height: 70px !important;
  width: 20%;
  background-color: #4f60c9;
}
.pickTime.v-chip--active {
  background-color: #4f60c9;
  /* font-weight: bold; */
}
</style>
