<template>
  <div>
    <v-dialog
      v-model="dialog.show"
      max-width="300"
    >
      <v-card>
        <v-card-title style="color:#727cf5">Chọn khoảng thời gian</v-card-title>
        <div class="d-flex flex-row ma-1">
          <el-time-select
            placeholder="Bắt đầu"
            v-model="picker.startTime"
            :picker-options="{
              start: minTime || '06:00',
              step: '00:15',
              end: '21:00',
              minTime,
            }"
          >
          </el-time-select>
          <v-icon class="mx-1">arrow_right_alt</v-icon>
          <el-time-select
            placeholder="Kết thúc"
            v-model="picker.endTime"
            :picker-options="{
              start: picker.startTime || '06:00',
              step: '00:15',
              end: '21:00',
              minTime: picker.startTime,
            }"
          >
          </el-time-select>
        </div>
        <v-card-actions>
          <div class="d-flex justify-center">
              <v-btn
              color="grey"
              text
              @click="dialog.show = false"
            >Hủy</v-btn>
            <v-btn
              color="#727cf5"
              v-if="isValid"
              text
              @click="add"
            >Thêm</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      @click="dialog.show = true"
      outlined
      small
      color="#727CF5"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'VendorScheduleTableColumnCellInput',
  props: ['minTime'],
  data() {
    return {
      picker: {
        startTime: '',
        endTime: '',
      },
      dialog: {
        show: false,
      },
    };
  },
  methods: {
    add() {
      this.$emit('selected', this.picker);
      this.dialog.show = false;
      this.picker.startTime = '';
      this.picker.endTime = '';
    },
  },
  computed: {
    isValid() {
      return this.picker.startTime && this.picker.endTime;
    },
  },
};
</script>
