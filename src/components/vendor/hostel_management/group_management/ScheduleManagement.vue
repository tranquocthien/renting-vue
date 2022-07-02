<template>
  <v-row class="mx-0 mt-3 d-flex flex-column">
    <span style="text-align: center" class="text-primary-dark font-nunito size9rem mb-2"
      >Cài đặt lịch rảnh các ngày trong tuần để người thuê có thể gặp bạn hoặc quản lý của khu trọ
      để xem phòng trọ.</span
    >
    <v-row>
      <v-col cols="4">
        <v-autocomplete
          v-model="from"
          :items="getTimes('05:00', '22:00', 'asc')"
          label="Từ"
          class="size9rem font-nunito form"
          solo
          dense
          color="indigo"
          hide-details
          background-color="white"
          no-data-text="Không có kết quả phù hợp"
          style="border: 1px solid #e1e1e1 !important; border-radius: 4px"
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          v-model="to"
          :items="getTimes(String(from), '22:00', 'asc')"
          label="Đến"
          class="size9rem font-nunito form"
          solo
          dense
          color="indigo"
          hide-details
          background-color="white"
          no-data-text="Không có kết quả phù hợp"
          style="border: 1px solid #e1e1e1 !important; border-radius: 4px"
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <div v-show="!visibleCreateSchedule">
          <v-btn
            class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start ml-auto"
            style="letter-spacing: 0.01rem !important"
            ><v-icon small class="mr-1">mdi-calendar-week</v-icon>Áp dụng</v-btn
          >
        </div>

        <v-menu :close-on-content-click="false" offset-y left v-model="menu">
          <template v-slot:activator="{ on, attrs }">
            <div v-show="visibleCreateSchedule">
              <v-btn
                v-bind="attrs"
                v-on="on"
                class="bg-danger-lighten elevation-0 text-danger font-nunito size9rem d-flex justify-start ml-auto"
                style="letter-spacing: 0.01rem !important"
                ><v-icon small class="mr-1">mdi-calendar-week</v-icon>Áp dụng</v-btn
              >
            </div>
          </template>
          <v-card class="pt-4" min-width="500" max-width="500">
            <v-checkbox
              v-model="selectAll"
              label="Tất cả các ngày trong tuần"
              class="filter checkbox-primary mt-0 ml-5 mb-1"
              color="#4250f2"
              hide-details
              @click="selectAllDay()"
            ></v-checkbox>
            <v-divider></v-divider>
            <div class="d-flex flex-wrap pr-5">
              <v-checkbox
                v-model="selectDay"
                v-for="item in allSchedule"
                v-bind:key="item.scheduleId"
                :label="item.dayOfWeek"
                :value="item.scheduleId"
                hide-details
                class="filter mt-1 text-capitalize ml-5 checkbox"
                color="#727cf5"
              ></v-checkbox>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="menu = false" class="font-nunito size-sub-3"> Hủy </v-btn>
              <v-btn color="#4250f2" text class="font-nunito size-sub-3" @click="addSchedule()">
                Thêm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <span class="font-nunito red--text size-caption" v-show="!visibleCreateSchedule"
      >Vui lòng chọn thời gian rảnh</span
    >
    <v-row>
      <ScheduleItem
        v-for="item in newGroup.schedules"
        v-bind:key="item.scheduleId"
        :schedule="item"
      />
    </v-row>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import ScheduleItem from './ScheduleItem.vue';

export default {
  name: 'ScheduleManagement',
  data: () => ({
    selected: [],
    recommendList: [],
    values: '',
    from: '05:00',
    to: '',
    selectAll: false,
    selectDay: [],
    menu: false,
    schedules: [],
  }),
  components: { ScheduleItem },
  computed: {
    allSchedule() {
      return this.$store.state.renter.common.schedule.data;
    },
    newGroup() {
      return this.$store.state.vendor.group.newGroup;
    },
    visibleCreateSchedule() {
      if (this.from === '' || this.to === '' || this.from === null || this.to === null) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions({
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    selectCheckBox() {
      this.newGroup.regulation = this.selected;
      this.setNewGroupValue(this.newGroup);
    },
    selectAllDay() {
      const scheduleIds = [];
      if (this.selectAll) {
        this.allSchedule.forEach((item) => scheduleIds.push(item.scheduleId));
      }
      this.selectDay = scheduleIds;
    },
    addSchedule() {
      const time = `${this.from} - ${this.to}`;
      if (this.newGroup.schedules.length === 0) {
        this.selectDay.forEach((item) => {
          this.newGroup.schedules.push({ scheduleId: item, timeRange: [time] });
        });
      } else {
        this.selectDay.forEach((item) => {
          const index = this.newGroup.schedules.findIndex(
            (schedule) => schedule.scheduleId === item,
          );
          if (index !== -1) {
            this.newGroup.schedules[index].timeRange.push(time);
          } else {
            this.newGroup.schedules.push({ scheduleId: item, timeRange: [time] });
          }
        });
      }
      this.newGroup.schedules.sort((a, b) => a.scheduleId - b.scheduleId);
      this.setNewGroupValue(this.newGroup);
      this.menu = false;
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
  },
  created() {},
};
</script>

<style>
.dropzone {
  border: 2px dashed #dee2e6;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  min-height: 150px;
  padding: 20px;
}
.checkbox-primary .theme--light.v-label {
  color: #727cf5 !important;
  font-size: 0.875rem !important;
  font-family: 'Nunito', sans-serif !important;
}
</style>
