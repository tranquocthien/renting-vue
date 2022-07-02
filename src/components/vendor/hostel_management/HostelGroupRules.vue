<template>
  <div>
    <v-overlay :value="rules.isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card class="d-flex flex-column inner pa-5" v-if="!rules.isLoading">
      <span class="text-h6 my-2"><v-icon left>warning</v-icon> Nội quy khu trọ</span>
      <div class="d-flex justify-center">
        <v-switch
          label="Bạn có muốn thêm nội quy phòng trọ"
          color="success"
          v-model="checkRule"
          hide-details
          class="mb-3 filter"
        ></v-switch>
      </div>
      <div class="d-flex flex-row flex-wrap mb-3" v-if="checkRule">
        <v-switch
          v-for="(rule, index) in rules.data"
          :key="rule.regulationId"
          :label="rule.regulationName"
          color="success"
          v-model="activeRules[index]"
          hide-details
          class="ml-15 filter"
        ></v-switch>
        <v-switch
          label="Giờ giấc tự do"
          v-model="picker.openAllDay"
          hide-details
          color="success"
          class="ml-15 filter"
        ></v-switch>
        <div v-if="!picker.openAllDay" class="d-flex flex-column justify-center">
          <p class="ma-1 font-weight-bold ml-15 mt-4 mb-4">Giờ mở cửa</p>
          <div class="ml-15 hidden-sm-and-down">
            <span class="font-weight-bold ma-1">Từ</span>
            <el-time-select
              placeholder="Giờ mở cửa"
              v-model="picker.startTime"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59',
              }"
            >
            </el-time-select>
            <span class="font-weight-bold ma-1 ml-3">đến</span>
            <el-time-select
              placeholder="Giờ đóng cửa"
              v-model="picker.endTime"
              :picker-options="{
                start: picker.startTime || '06:00',
                step: '00:30',
                end: '23:59',
                minTime: picker.startTime,
              }"
            >
            </el-time-select>
          </div>
          <div class="ml-15 hidden-sm-and-up">
            <v-col cols="12">
            <span class="font-weight-bold ma-1">Từ</span>
            <el-time-select
              placeholder="Giờ mở cửa"
              v-model="picker.startTime"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59',
              }"
            >
            </el-time-select>
            </v-col>
            <v-col cols="12">
            <span class="font-weight-bold ma-1">đến</span>
            <el-time-select
              placeholder="Giờ đóng cửa"
              v-model="picker.endTime"
              :picker-options="{
                start: picker.startTime || '06:00',
                step: '00:30',
                end: '23:59',
                minTime: picker.startTime,
              }"
            >
            </el-time-select>
            </v-col>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'HostelGroupRules',
  data: () => ({
    picker: {
      startTime: '',
      endTime: '',
      openAllDay: true,
    },
    activeRules: [],
    checkRule: false,
  }),
  computed: {
    ...mapState('renter/common', ['rules']),
    listOfActiveRules() {
      return this.activeRules.map((item, index) => {
        const { regulationName, regulationId } = this.rules.data[index];
        const obj = {
          regulationId,
          regulationName,
          allowed: item,
          active: true,
        };
        return obj;
      });
    },
  },
  methods: {
    ...mapActions({
      getAllRules: 'renter/common/getAllRules',
    }),
  },
  created() {
    if (this.rules.data.length === 0) {
      this.getAllRules().then(() => {
        this.activeRules = Array(this.rules.data.length).fill(false);
      });
    }
  },
  watch: {
    activeRules: {
      handler() {
        this.$emit('newValue', { rules: this.listOfActiveRules, time: this.picker });
      },
      deep: true,
    },
    picker: {
      handler() {
        this.$emit('newValue', { rules: this.listOfActiveRules, time: this.picker });
      },
      deep: true,
    },
  },
};
</script>
