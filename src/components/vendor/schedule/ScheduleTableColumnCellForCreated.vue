<template>
  <v-chip
    @click:close="remove(value)"
    outlined
    close
    color="#727CF5"
  >
    <span>{{ value.startTime }}</span>
    <v-icon class="mx-1">arrow_right_alt</v-icon>
    <span>{{ value.endTime }}</span>
  </v-chip>
</template>
<script>
export default {
  name: 'VendorScheduleTableColumnCellForCreated',
  props: ['value'],
  methods: {
    remove(removeItem) {
      // removeItem = `${this.value.scheduleId}-${this.value.startTime}-${this.value.endTime}`;
      this.$emit('remove', removeItem);
    },
  },
};
</script>
