<template>
  <v-col cols="12" class="d-flex align-center py-1">
    <span
      style="
        width: 100px;
        min-width: 100px;
        height: 100%;
        background-color: #e9ecef;
        opacity: 1;
        border: 1px solid #e9ecef;
      "
      class="text-capitalize d-flex justify-center align-center font-nunito text-gray-dark py-1"
      >{{ scheduleName }}</span
    >
    <div class="d-flex flex-wrap">
      <span
        v-for="(item, index) in schedule.timeRange"
        v-bind:key="index"
        class="font-nunito pa-1"
        style="border: 1px solid #dee2e6; border-left: 0px"
        >{{ item }}</span
      >
    </div>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ScheduleItem',
  data: () => ({
    radioEmpty: true,
    radioRenting: false,
  }),
  props: { schedule: Object },
  computed: {
    allSchedule() {
      return this.$store.state.renter.common.schedule.data;
    },
    scheduleName() {
      return this.allSchedule.find((schedule) => schedule.scheduleId === this.schedule.scheduleId)
        .dayOfWeek;
    },
  },
  methods: {
    ...mapActions({
      getAllRules: 'renter/common/getAllRules',
      setNewRoom: 'vendor/group/setNewRoom',
      setCreatRooms: 'vendor/group/setCreatRooms',
    }),
    removeItem() {
      const result = this.createRooms.filter((item) => item.index !== this.newValue.index);
      this.setCreatRooms(result);
      console.log(this.createRooms);
    },
  },
  created() {},
};
</script>

<style>
</style>
