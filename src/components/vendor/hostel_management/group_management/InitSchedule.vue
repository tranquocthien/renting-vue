<template>
  <v-row
    style="background-color: #f1f3fa; border-radius: 0.5rem"
    class="my-3 d-flex flex-column pl-4 mx-10"
  >
    <v-col cols="12" class="pa-0">
      <v-row class="mx-5">
        <v-col cols="2">
          <v-autocomplete
            v-model="from"
            :items="timeFrom"
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
        <v-col cols="2">
          <v-autocomplete
            v-model="to"
            :items="timeTo"
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
        <v-col cols="2">
          <div v-show="!visibleCreateSchedule">
            <v-btn
              class="btn-success white--text font-nunito size9rem d-flex justify-start"
              style="letter-spacing: 0.01rem !important"
              height="40"
              ><v-icon small class="mr-1">mdi-calendar-week</v-icon>Áp dụng</v-btn
            >
          </div>

          <v-menu :close-on-content-click="false" offset-y v-model="menu">
            <template v-slot:activator="{ on, attrs }">
              <div v-show="visibleCreateSchedule">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  height="40"
                  class="btn-success white--text font-nunito size9rem d-flex justify-start"
                  style="letter-spacing: 0.01rem !important"
                  ><v-icon small class="mr-1">mdi-calendar-week</v-icon>Áp dụng</v-btn
                >
              </div>
            </template>
            <v-card class="hidden-xs-only pt-4" min-width="500" max-width="500">
              <v-checkbox
                v-model="selectAll"
                label="Tất cả các ngày trong tuần"
                class="filter checkbox-primary checkbox-small mt-0 ml-5 mb-1"
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
                  class="filter mt-1 text-capitalize ml-5 checkbox-small"
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
            <v-card class="hidden-sm-and-up pt-4" min-width="400" max-width="400">
              <v-checkbox
                v-model="selectAll"
                label="Tất cả các ngày trong tuần"
                class="filter checkbox-primary checkbox-small mt-0 ml-5 mb-1"
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
                  class="filter mt-1 text-capitalize ml-5 checkbox-small"
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
        <v-col cols="6" class="px-0 d-flex align-end">
          <span class="red--text font-nunito size-caption">{{ errorMsg }}</span>
        </v-col>
      </v-row>
    </v-col>

    <v-row class="pl-4">
      <v-col cols="5" class="d-flex pa-0">
        <v-col
          cols="4"
          class="d-flex flex-column align-center py-3 px-2"
          v-for="item in newGroup.schedules"
          v-bind:key="item.scheduleId"
          style="border-radius: 0.35rem"
        >
          <span
            class="font-nunito size9rem d-flex justify-center font-weight-600 text-capitalize py-2"
            style="
              letter-spacing: 0.01rem !important;
              border: 1px solid #324581;
              color: #324581;
              background-color: #fff;
              width: 110px;
              border-radius: 0.25rem;
            "
            ><v-icon small class="mr-1">mdi-alarm-plus</v-icon>{{ item.dayOfWeek }}</span
          >
          <div v-if="item.timeRange.length > 0" class="d-flex flex-column align-center mt-2">
            <div
              v-for="time in item.timeRange"
              v-bind:key="time"
              class="font-nunito size9rem mt-2 py-2"
              style="
                background-color: #eaecf2;
                border-radius: 0.25rem;
                width: 110px;
                text-align: center;
                position: relative;
              "
            >
              <v-hover v-slot="{ hover }">
                <div>
                  {{ time }}
                  <v-expand-transition>
                    <v-icon
                      size="25"
                      color="#fff"
                      v-if="hover"
                      class="d-flex transition-fast-in-fast-out cursor"
                      style="
                        height: 100%;
                        width: 110px;
                        position: absolute;
                        top: 0;
                        background-color: rgba(0, 0, 0, 0.45);
                        border-radius: 0.25rem;
                      "
                      @click="removeFreeTime(item.scheduleId, time)"
                    >
                      mdi-delete-forever
                    </v-icon>
                  </v-expand-transition>
                </div>
              </v-hover>
            </div>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <v-dialog v-model="showAddNewFreeTime" hide-overlay persistent max-width="600px">
      <v-card class="d-flex pa-4">
        <v-row class="ma-0">
          <v-col cols="4">
            <v-autocomplete
              v-model="from"
              :items="timeFrom"
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
              :items="timeTo"
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
          <v-col cols="4" class="d-flex justify-end">
            <v-btn class="btn btn-primary font-nunito mx-4" @click="addNewFreeTime()"> Thêm </v-btn>
            <v-btn class="btn btn-light red--text elevation-0 font-nunito" @click="closeDialog()">
              Hủy
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'InitSchedule',
  data: () => ({
    showAddNewFreeTime: false,
    from: '05:00',
    to: '',
    day: -1,
    schedule: [],
    selectAll: false,
    selectDay: [],
    menu: false,
    errorMsg: '',
  }),
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
    timeFrom() {
      let times = this.getFullTimes('05:00', '21:30', 'asc');
      let timeSelected = this.newGroup.schedules.find((item) => item.scheduleId === this.day);
      let timeIgnore = [];
      if (timeSelected) {
        timeSelected = timeSelected.timeRange;
        timeSelected.forEach((item) => {
          const [start, end] = item.split(' - ');
          timeIgnore = [...timeIgnore, ...this.getFullTimes(start, end, 'asc')];
        });
        timeIgnore.forEach((item) => {
          times = times.filter((t) => t !== item);
        });
      }
      return times;
    },
    timeTo() {
      let times = this.getTimes(String(this.from), '22:00', 'asc');
      let timeSelected = this.newGroup.schedules.find((item) => item.scheduleId === this.day);
      let timeIgnore = [];
      if (timeSelected) {
        timeSelected = timeSelected.timeRange;
        timeSelected.forEach((item) => {
          const [start, end] = item.split(' - ');
          timeIgnore = [...timeIgnore, ...this.getTimes(start, end, 'asc')];
        });
        timeIgnore.forEach((item) => {
          times = times.filter((t) => t !== item);
        });
        const startTimes = timeSelected.map((item) => item.slice(0, 5).trim());
        startTimes.push(this.from);
        startTimes.sort((prev, next) => {
          const [prevHour, prevMinute] = prev.split(':').map((item) => Number(item));
          const [nextHour, nextMinute] = next.split(':').map((item) => Number(item));
          return prevHour !== nextHour ? prevHour - nextHour : prevMinute - nextMinute;
        });
        if (startTimes.indexOf(this.from) < startTimes.length - 1) {
          const endTime = startTimes[startTimes.indexOf(this.from) + 1];
          const endTimeNumber = {
            hour: Number(endTime.slice(0, 5).trim().split(':')[0]),
            minute: Number(endTime.slice(0, 5).trim().split(':')[1]),
          };
          const halfBeforeEndTime =
            endTimeNumber.minute === 0
              ? `${endTimeNumber.hour - 1}:30` // eslint-disable-line
              : `${endTimeNumber.hour}:00`; // eslint-disable-line
          return times.slice(0, times.indexOf(halfBeforeEndTime) + 1);
        }
      }
      return times;
    },
  },
  methods: {
    ...mapActions({
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    selectAllDay() {
      const scheduleIds = [];
      if (this.selectAll) {
        this.allSchedule.forEach((item) => scheduleIds.push(item.scheduleId));
      }
      this.selectDay = scheduleIds;
    },
    checkDupplicateTime() {
      const dayDuplicate = [];
      this.selectDay.forEach((item) => {
        let timeSelected = this.newGroup.schedules.find((s) => s.scheduleId === item);
        let timeIgnore = [];
        if (timeSelected) {
          timeSelected = timeSelected.timeRange;
          timeSelected.forEach((t) => {
            const [start, end] = t.split(' - ');
            timeIgnore = [...timeIgnore, ...this.getTimes(start, end, 'asc')];
          });
          let flat = 0;
          timeIgnore.forEach((i) => {
            if (this.getFullTimes(this.from, this.to, 'asc').includes(i)) {
              flat += 1;
            }
          });
          if (flat > 0) {
            dayDuplicate.push(item);
          }
        }
      });
      return dayDuplicate;
    },
    addSchedule() {
      this.errorMsg = '';
      if (this.checkDupplicateTime().length > 0) {
        this.errorMsg = 'Lịch rảnh bạn vừa chọn hiện đang có khoảng thời gian trùng vào các ngày';
        this.checkDupplicateTime().forEach((item, index) => {
          this.errorMsg += ` ${this.allSchedule.find((s) => s.scheduleId === item).dayOfWeek}`;
          this.errorMsg += index === this.checkDupplicateTime().length - 1 ? '.' : ',';
        });
      } else {
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
      }
      this.menu = false;
    },
    getTimes(from, to, sort) {
      const [fromH, fromM] = from.split(':').map((m) => Number(m));
      const [toH, toM] = to.split(':').map((m) => Number(m));
      const hourArr = [...Array(toH - fromH + 1)];
      const preSort = hourArr.flatMap((_, index) => {
        const indexHour = fromH + index;
        if (index === 0 && fromH === toH) {
          return fromM < 30 && toM >= 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }
        // getTimes
        if (index === 0) {
          // min output = start + 30m
          return fromM < 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }

        // if (index === 0) {
        //   // min output = start + 30m
        //   return fromM == 0 // eslint-disable-line
        //     ? [`${indexHour}:00`, `${indexHour}:30`] // eslint-disable-line
        //     : fromM < 30 // eslint-disable-line
        //     ? `${indexHour}:30` // eslint-disable-line
        //     : []; // eslint-disable-line
        // }
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
    getFullTimes(from, to, sort) {
      const [fromH, fromM] = from.split(':').map((m) => Number(m));
      const [toH, toM] = to.split(':').map((m) => Number(m));
      const hourArr = [...Array(toH - fromH + 1)];
      const preSort = hourArr.flatMap((_, index) => {
        const indexHour = fromH + index;
        if (index === 0 && fromH === toH) {
          return fromM < 30 && toM >= 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }
        // get Fulltimes
        if (index === 0) {
          // min output = start + 30m
          return fromM == 0 // eslint-disable-line
            ? [`${indexHour}:00`, `${indexHour}:30`] // eslint-disable-line
            : fromM <= 30 // eslint-disable-line
            ? `${indexHour}:30` // eslint-disable-line
            : []; // eslint-disable-line
        }
        // if (index === 0) {
        //   // min output = start + 30m
        //   return fromM < 30 // eslint-disable-line
        //     ? `${indexHour}:30` // eslint-disable-line
        //     : []; // eslint-disable-line
        // }
        if (index === hourArr.length - 1) {
          return toM >= 30 // eslint-disable-line
            ? [`${indexHour}:00`, `${indexHour}:30`] // eslint-disable-line
            : `${indexHour}:00`; // eslint-disable-line
        }
        return [`${indexHour}:00`, `${indexHour}:30`];
      });
      if (sort === 'desc') {
        return preSort.reverse();
      }
      return preSort;
    },
    openDialog(scheduleId) {
      this.day = scheduleId;
      this.showAddNewFreeTime = true;
    },
    closeDialog() {
      this.showAddNewFreeTime = false;
      this.from = '05:00';
      this.to = '';
      this.day = -1;
    },
    addNewFreeTime() {
      const time = `${this.from} - ${this.to}`;
      const index = this.newGroup.schedules.findIndex((item) => item.scheduleId === this.day);
      this.newGroup.schedules[index].timeRange.push(time);
      this.setNewGroupValue(this.newGroup);
      this.closeDialog();
    },
    removeFreeTime(scheduleId, timeRange) {
      const index = this.newGroup.schedules.findIndex((item) => item.scheduleId === scheduleId);
      this.newGroup.schedules[index].timeRange = this.newGroup.schedules[index].timeRange.filter(
        (item) => item !== timeRange,
      );
      this.setNewGroupValue(this.newGroup);
    },
  },
  created() {
    this.newGroup.schedules = this.allSchedule.map((item) => ({
      scheduleId: item.scheduleId,
      dayOfWeek: item.dayOfWeek,
      timeRange: [],
    }));
  },
};
</script>

<style>
.day:hover {
  background-color: #f1f1f4 !important;
}
</style>
