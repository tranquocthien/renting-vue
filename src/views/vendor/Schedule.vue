<template>
  <v-sheet>
    <ScheduleTable />
  </v-sheet>
</template>
<script>
import ScheduleTable from '../../components/vendor/schedule/ScheduleTable.vue';

export default {
  name: 'VendorSchedule',
  components: { ScheduleTable },
};
</script>
