<template>
  <v-row no-gutters>
    <v-col
      v-for="day in daysOfWeek"
      :key="day"
      cols="12"
    >
      <TableColumn
        :columnName="day"
        @new="sendData"
      />
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>
<script>
import TableColumn from './ScheduleTableColumnForCreated.vue';

export default {
  name: 'VendorScheduleTableForCreated',
  components: { TableColumn },
  data: () => ({
    daysOfWeek: ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
    schedules: [
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
      {
        scheduleId: 0,
        timeRange: [],
      },
    ],
  }),
  methods: {
    sendData(scheduleObjList, id) {
      // console.log('schedule obj list');
      // console.log(scheduleObjList);

      this.schedules[id - 1].timeRange = [];

      for (let scheduleObj = 0; scheduleObj < scheduleObjList.length; scheduleObj += 1) {
        const { startTime, endTime, scheduleId } = scheduleObjList[scheduleObj];
        if (scheduleId === 1) {
          this.schedules[0].scheduleId = scheduleId;
          if (this.schedules[0].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[0].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 2) {
          this.schedules[1].scheduleId = scheduleId;
          if (this.schedules[1].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[1].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 3) {
          this.schedules[2].scheduleId = scheduleId;
          if (this.schedules[2].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[2].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 4) {
          this.schedules[3].scheduleId = scheduleId;
          if (this.schedules[3].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[3].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 5) {
          this.schedules[4].scheduleId = scheduleId;
          if (this.schedules[4].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[4].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 6) {
          this.schedules[5].scheduleId = scheduleId;
          if (this.schedules[5].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[5].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
        if (scheduleId === 7) {
          this.schedules[6].scheduleId = scheduleId;
          if (this.schedules[6].timeRange.indexOf(`${startTime} - ${endTime}`) === -1) {
            this.schedules[6].timeRange.push(`${startTime} - ${endTime}`);
          }
        }
      }
    },
  },
  watch: {
    schedules: {
      handler() {
        this.$emit('newValue', this.schedules.filter((item) => item.timeRange.length > 0));
      },
      deep: true,
    },
  },
  computed: {
  },
};
</script>
