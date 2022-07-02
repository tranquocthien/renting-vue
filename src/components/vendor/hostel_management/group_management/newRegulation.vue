<template>
  <v-col cols="6" class="d-flex flex-column py-0">
    <div class="d-flex">
      <v-text-field
        class="size-sub form font-nunito"
        color="#727cf5"
        solo
        dense
        label="Tên nội quy"
        light
        v-model="newValue.regulationName"
        hide-details
        style="
          border-top-right-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          border-right: 0px !important;
        "
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
    <span class="font-nunito red--text size-caption" v-show="isDuplicate">Nội quy đã tồn tại</span>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'newRegulation',
  data: () => ({
    rules: {
      required: (value) => !!value || 'Vui lòng nhập tên nội quy',
    },
  }),
  props: { regulation: Object },
  computed: {
    newGroupValue() {
      return this.$store.state.vendor.group.newGroup;
    },
    newValue() {
      return this.regulation;
    },
    allRules() {
      return this.$store.state.renter.common.rules.data;
    },
    isDuplicate() {
      return (
        this.allRules.filter(
          (item) =>
            item.regulationName.toLowerCase().trim() === // eslint-disable-line
            this.newValue.regulationName.toLowerCase().trim(),
        ).length > 0
      );
    },
  },
  methods: {
    ...mapActions({
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    removeItem() {
      this.newGroupValue.newRegulations = this.newGroupValue.newRegulations.filter(
        (item) => item.index !== this.newValue.index,
      );
      this.setNewGroupValue(this.newGroupValue);
    },
  },
  created() {},
};
</script>

<style>
</style>
