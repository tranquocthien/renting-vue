<template>
  <div>
    <v-row
      no-gutters
      class="mt-3 hidden-sm-and-down"
    >
      <v-col
        cols="1"
        style="display: flex;
              justify-content: center;
              align-items: center;"
      >
        <span>{{ columnName }}</span>
      </v-col>
      <v-col
        cols="1"
        style="display: flex;
              justify-content: center;
              align-items: center;"
      >
        <ColumnCellInput
          v-on:selected="receiveSelectedTimeRange"
          :minTime="lastItem.endTime"
        />
      </v-col>
      <v-col
        cols="9"
        v-if="items"
      >
        <v-chip-group
          active-class="primary--text"
          column
        >
          <ColumnCell
            v-for="item in items"
            :key="item.now"
            :value="item"
            @remove="remove"
          />
          <v-chip
            v-if="items.length === 0"
            class="d-flex justify-center"
          >
            <span>
              Hiện tại không có
            </span>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="mt-3 hidden-sm-and-up"
    >
      <v-col
        cols="6"
        class="d-flex justify-start"
      >
        <span style="font-size:20px">{{ columnName }}</span>
      </v-col>
      <v-col
        cols="6"
        class="d-flex justify-end"
      >
        <ColumnCellInput
          v-on:selected="receiveSelectedTimeRange"
          :minTime="lastItem.endTime"
        />
      </v-col>
      <v-col
        cols="12"
        v-if="items"
        style="display: flex;
              justify-content: center;
              align-items: center;"
      >
        <v-chip-group
          active-class="primary--text"
          column
        >
          <ColumnCell
            v-for="item in items"
            :key="item.now"
            :value="item"
            @remove="remove"
          />
          <div
            v-if="items.length === 0"
            class="d-flex justify-center"
            style="opacity:0.7;"
          >
            <span>
              Không có dữ liệu
            </span>
          </div>
        </v-chip-group>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ColumnCell from './ScheduleTableColumnCellForCreated.vue';
import ColumnCellInput from './ScheduleTableColumnCellInput.vue';

export default {
  name: 'VendorScheduleTableColumnForCreated',
  props: ['columnName'],
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

    // sendData() {
    //   this.$emit('new', this.items);
    //   console.log(`trong column${this.items}`);
    //   console.log(this.items);
    // },

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
    test() {
      return this.items;
    },
  },
  mounted() {
    this.$store.dispatch('scheduleNew', this.items);
  },
};
</script>
