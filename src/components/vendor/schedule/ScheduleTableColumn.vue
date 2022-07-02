<template>
  <v-card>
    <v-card-title class="d-flex justify-center">{{ columnName }}</v-card-title>
    <v-card-actions class="d-flex justify-center">
      <ColumnCellInput
        v-on:selected="receiveSelectedTimeRange"
        :minTime="lastItem.endTime"
      />
    </v-card-actions>
    <v-list-item-group>
      <ColumnCell
        v-for="item in items"
        :key="item.now"
        :value="item"
        @remove="remove"
      />
      <v-list-item
        dense
        v-if="items.length === 0"
      >
        <v-list-item-subtitle class="d-flex justify-center">
          Không có dữ liệu
        </v-list-item-subtitle>
      </v-list-item>
    </v-list-item-group>
  </v-card>
</template>
<script>
import ColumnCell from './ScheduleTableColumnCell.vue';
import ColumnCellInput from './ScheduleTableColumnCellInput.vue';

export default {
  name: 'VendorScheduleTableColumn',
  props: ['columnName', 'dataT'],
  components: { ColumnCell, ColumnCellInput },
  data: () => ({
    items: [],
    id: 0,
  }),
  methods: {
    receiveSelectedTimeRange(range) {
      if (this.columnName.localeCompare('Thứ hai') === 0) {
        this.id = 1;
      }
      if (this.columnName.localeCompare('Thứ ba') === 0) {
        this.id = 2;
      }
      if (this.columnName.localeCompare('Thứ tư') === 0) {
        this.id = 3;
      }
      if (this.columnName.localeCompare('Thứ năm') === 0) {
        this.id = 4;
      }
      if (this.columnName.localeCompare('Thứ sáu') === 0) {
        this.id = 5;
      }
      if (this.columnName.localeCompare('Thứ bảy') === 0) {
        this.id = 6;
      }
      if (this.columnName.localeCompare('Chủ nhật') === 0) {
        this.id = 7;
      }
      this.items.push({
        now: Date.now(),
        ...range,
        scheduleId: this.id,
      });
    },
    remove(e) {
      this.items.splice(this.items.indexOf(e), 1);
    },
  },
  watch: {
    items: {
      handler() {
        this.$emit('new', this.items, this.id);
      },
      deep: true,
    },
  },
  computed: {
    lastItem() {
      return this.items[this.items.length - 1] || {};
    },
    getValue() {
      return this.dataT.filter((item) => this.columnName.toLowerCase() === item.dayOfWeek).forEach((element) => {
        const { scheduleId } = element;
        element.timeRange.forEach((element2) => {
          const { startTime } = element2;
          const { endTime } = element2;
          const now = Date.now();
          this.items.push({
            scheduleId, startTime, endTime, now,
          });
        });
      });
    },
  },
};
</script>
