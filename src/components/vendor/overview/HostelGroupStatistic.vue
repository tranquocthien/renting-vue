<template>
  <div class="d-flex flex-column" _style="height: 100%; width: 100%; overflow-y: auto;">
    <v-row class="d-flex ma-0 pa-0">
      <v-col cols="9" class="pa-0">
        <v-progress-linear :value="stat.stat" height="25" color="#727cf5">
          <span class="font-nunito size-sub-3 white--text mr-auto ml-2" v-if="stat.stat >= 50"
            >{{ stat.total - stat.empty }} phòng đang thuê</span
          >
          <span class="font-nunito size-sub-3 ml-auto mr-2" v-if="stat.stat <= 50"
            >{{ stat.empty }} phòng trống</span
          >
        </v-progress-linear>
      </v-col>
      <v-col cols="3" class="pa-0 d-flex justify-end text-gray font-nunito size9rem">
        <span>{{ stat.total }} phòng</span>
      </v-col>
    </v-row>
    <!-- <div style="width: 100%;" elevation="0">
      <div class="font-weight-thin text-h6">Thống kê</div>
      <v-divider />
      <v-card-text>
        <div>
          Tổng số:
          <span class="font-weight-bold">{{ stat.total }}</span>
          phòng
        </div>
        <div>
          Trống:
          <span class="font-weight-bold">{{ stat.empty }}</span>
          phòng
        </div>
        <div>
          Tỷ lệ lấp đầy:
          <span class="font-weight-bold">
            {{ stat.total == 0 ? 100 : Number((100 - (stat.empty / stat.total) * 100).toFixed(2)) }}
          </span>
          %
        </div>
      </v-card-text>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'showEmptyRoom',
  props: ['group'],
  data: () => ({
    stat: {
      total: 0,
      empty: 0,
      stat: 0,
    },
  }),
  methods: {
    calcStat(group) {
      const { types } = group;
      this.stat = {
        total: 0,
        empty: 0,
        stat: 0,
      };
      if (types) {
        this.stat = types.reduce((c, type) => {
          const newCount = c;
          if (type.rooms) {
            newCount.total += type.rooms.length;
            newCount.empty += type.rooms.filter((room) => room.available).length;
            newCount.stat =
              newCount.total === 0
                ? 100 // eslint-disable-line
                : Number((100 - (newCount.empty / newCount.total) * 100).toFixed(2)); // eslint-disable-line
          }
          return newCount;
        }, this.stat);
      }
    },
  },
  computed: {
    groups() {
      return this.$store.state.vendor.group.groups;
    },
    groupList() {
      return this.$store.state.vendor.group.groups.data;
    },
  },
  watch: {
    group(newGroup) {
      this.calcStat(newGroup);
    },
  },
  created() {
    this.calcStat(this.group);
  },
};
</script>
