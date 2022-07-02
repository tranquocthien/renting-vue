<template>
  <v-sheet class="main d-flex flex-column pa-1 flex-wrap" light :width="width">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="!isLoading" class="above d-flex justify-center flex-column pa-1 flex-wrap red">
      <p class="h6-text text-center">CHỌN NGÀY</p>
      <v-chip-group mandatory light v-model="pickedDate" center-active show-arrows>
        <v-chip
          light
          v-for="i in 7"
          v-bind:key="i"
          x-large
          label
          class="mr-1"
          outlined
          active-class="red--text red"
          link
          @click="getTimesForDate(i - 1)"
        >
          <v-sheet class="d-flex flex-column justify-center align-center ma-1 pa-1 flex-wrap" light>
            <p class="ma-0">{{ daysOfWeek[dates[i - 1].getDay()] }}</p>
            <p class="ma-0 text-h5 font-weight-bold">{{ dates[i - 1].getDate() }}</p>
          </v-sheet>
        </v-chip>
      </v-chip-group>
    </div>
    <div v-if="timesForDate != null" class="below d-flex flex-column align-center pa-1 flex-wrap">
      <p class="h6-text">CHỌN GIỜ</p>
      <div class="pa-2">
        <v-chip-group mandatory light v-model="pickedTime" center-active show-arrows>
          <v-chip
            light
            v-for="j in timesForDate.length"
            v-bind:key="j"
            large
            label
            class="mr-1"
            outlined
            active-class="amber--text amber"
            link
            >{{ timesForDate[j - 1] }}</v-chip
          >
        </v-chip-group>
      </div>
    </div>
    <div class="d-flex justify-space-around mt-1">
      <v-btn color="warning" @click="$emit('cancel')">HỦY</v-btn>
      <v-btn
        color="success"
        v-if="pickedDate != null && pickedTime != null"
        @click="$emit('ok', pickDateAndTime())"
        >CHỌN</v-btn
      >
    </div>
  </v-sheet>
</template>
<style scoped></style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'DateTimePicker',
  props: {
    width: {
      type: Number,
      required: false,
      default: undefined,
    },
    groupId: Number,
  },
  data: () => ({
    daysOfWeekEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysOfWeek: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    dates: [],
    timesForDate: null,
    pickedDate: null,
    pickedTime: null,
  }),
  methods: {
    ...mapActions({
      getSchedules: 'renter/hostelType/getSchedules',
    }),
    getNextDate(date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    },
    getListOf7Dates(length = 7) {
      // this function return list of seven dates from today
      const today = new Date();
      const dates = [today];
      for (let i = 0; i < length; i += 1) {
        dates.push(this.getNextDate(dates[i]));
      }
      return dates;
    },
    getTimesForDate(index) {
      this.timesForDate = this.times[index];
    },
    pickDateAndTime() {
      return {
        date: this.dates[this.pickedDate],
        time: this.times[this.pickedDate][this.pickedTime],
      };
    },
    cancelPickDateAndTime() {
      this.pickedDate = null;
      this.pickedTime = null;
    },
  },
  created() {
    this.getSchedules(this.groupId).then(() => {
      [this.timesForDate] = this.times;
    });
    this.dates = this.getListOf7Dates();
  },
  computed: {
    rawSchedule() {
      return this.$store.state.renter.hostelType.schedules.data;
    },
    isLoading() {
      return this.$store.state.renter.hostelType.schedules.isLoading;
    },
    times() {
      const arr = [];
      this.daysOfWeek.forEach((day) => {
        let result = this.rawSchedule.filter((item) => item.dayOfWeek === day.toLowerCase());
        result = result.map((item) => `${item.startTime} - ${item.endTime}`);
        arr.push(result);
      });
      return arr;
    },
  },
};
</script>
