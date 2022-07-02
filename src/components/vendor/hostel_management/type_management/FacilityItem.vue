<template>
  <v-col cols="6" class="d-flex flex-column py-0">
    <div class="d-flex">
      <v-text-field
        class="size-sub form font-nunito"
        color="#727cf5"
        solo
        dense
        light
        hide-details=""
        v-model="newValue.facilityName"
        style="
          border-top-right-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          border-right: 0px !important;
        "
        @input="changeName()"
      />
      <div
        class="d-flex align-center justify-center pa-2"
        style="height: 38px; background-color: #e9ecef; border: 1px solid #dee2e6"
      >
        <v-btn icon class="btn-hover" color="#6c757d" @click="removeItem()">
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </div>
    </div>
    <span class="font-nunito red--text size-caption">{{ message }}</span>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'FacilityItem',
  data: () => ({
    message: '',
  }),
  props: { facility: Object },
  computed: {
    newRoomValue() {
      return this.$store.state.vendor.group.newRoom.data;
    },
    createRooms() {
      return this.$store.state.vendor.group.creatRooms.rooms;
    },
    newValue() {
      return this.facility;
    },
    newTypeValue() {
      return this.$store.state.vendor.group.createType.data;
    },
    allFacilities() {
      return this.$store.state.renter.common.facilities.data;
    },
  },
  methods: {
    ...mapActions({
      setCreateTypeValue: 'vendor/group/setCreateTypeValue',
    }),
    removeItem() {
      this.newTypeValue.newFacilities = this.newTypeValue.newFacilities.filter(
        (item) => item.index !== this.newValue.index,
      );
      this.setCreateTypeValue(this.newTypeValue);
    },
    changeName() {
      if (!this.newValue.facilityName) {
        this.message = 'Vui lòng điền tên tiện ích!';
      } else if (
        this.allFacilities.filter(
          (item) =>
            item.facilityName.toLowerCase().trim() === // eslint-disable-line
            this.newValue.facilityName.toLowerCase().trim(),
        ).length > 0
      ) {
        this.message = 'Tiện ích đã tồn tại!';
      } else if (
        this.newTypeValue.newFacilities.filter(
          (item) =>
            item.facilityName.toLowerCase().trim() === // eslint-disable-line
            this.newValue.facilityName.toLowerCase().trim(),
        ).length > 1
      ) {
        this.message = 'Bạn đang tạo các tiện ích cùng tên!';
      } else {
        this.message = '';
      }
    },
  },
  created() {},
};
</script>

<style>
</style>
