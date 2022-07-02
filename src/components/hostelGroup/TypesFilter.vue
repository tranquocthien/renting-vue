<template>
  <!-- eslint-disable max-len -->
  <v-card style="width: 100%" outlined>
    <v-card-title
      style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
      class="d-flex align-center justify-center text-uppercase"
      >Bộ lọc</v-card-title
    >
    <v-expansion-panels focusable multiple accordion>
      <v-expansion-panel>
        <!-- <v-expansion-panel-header>Loại</v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filterSelected.categoriesIds" column multiple>
            <v-chip
              filter
              outlined
              v-for="(item, i) in categories"
              :key="`item-${i}`"
              :value="item.categoryId"
            >
              {{ item.categoryName }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content> -->
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Tiện nghi</v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filterSelected.facilitiesIds" column multiple>
            <v-chip
              filter
              outlined
              v-for="(item, i) in facilities"
              :key="`item-${i}`"
              :value="item.facilityId"
              >{{ item.facilityName }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Giá tiền</v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-row>
            <v-col class="px-5 pt-0">
              <v-switch
                class="ml-auto mb-4 filter"
                height="10"
                v-model="filterSelected.disabledPrice"
                label="Lọc"
              />
              <v-range-slider
                v-model="filterSelected.range"
                :max="max"
                :min="min"
                hide-details
                class="filter"
                :thumb-size="23"
                thumb-label="always"
                step="0.1"
                :disabled="!filterSelected.disabledPrice"
              />
              <v-row class="justify-center align-center">
                <v-subheader>{{ min }} tr</v-subheader>
                <v-subheader class="ml-auto">{{ max }} tr</v-subheader>
                <v-btn
                  icon
                  color="indigo"
                  height="30"
                  width="30"
                  :disabled="!filterSelected.disabledPrice"
                  @click="changeMaxPrice()"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <!-- </v-card-text> -->
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel class="lastItem">
        <v-expansion-panel-header>Diện tích tối thiểu</v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filterSelected.minSuperficiality" column>
            <v-chip
              outlined
              v-for="(item, i) in filter.minArea.items"
              :key="`item-${i}`"
              :value="item"
              >{{ item }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions class="pa-4" style="border-top: 1px solid rgba(0, 0, 0, 0.12)">
      <v-btn color="#727cf5" class="white--text" width="100%" @click="filterSubmit()"
        >Áp dụng</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<style>
.noPadding {
  padding: 0 !important;
}
.v-expansion-panel-content__wrap {
  padding: 0 10px 0 !important;
}
.noWrap {
  white-space: normal;
}
</style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'TypesFilter',
  props: {
    types: Array,
  },
  data: () => ({
    facilityIds: [],
    serviceIds: [],
    min: 0,
    max: 15,
    slider: 3,
    minSuperficiality: 0,
    filterSelected: {
      facilitiesIds: [],
      categoriesIds: [],
      range: [0, 2.5],
      minSuperficiality: '',
      disabledPrice: false,
    },
  }),
  methods: {
    ...mapActions({
      getAllFacilities: 'renter/filterResult/getAllFacilities',
      getAllCategories: 'renter/filterResult/getAllCategories',
      setFilterValue: 'renter/hostelGroup/setFilterValue',
      filterTypes: 'renter/hostelGroup/filterHostelType',
    }),
    // submit() {
    //   this.setFilterValue(this.filter);
    //   this.$emit('submitFilter');
    // },
    changeMaxPrice() {
      if (this.max < 50) this.max += 5;
    },
    filterSubmit() {
      console.log(this.filterSelected);
      this.setFilterValue(this.filterSelected);
      this.filterTypes({
        types: this.types,
        filterParam: this.filterSelected,
      });
    },
  },
  computed: {
    filter() {
      return this.$store.state.renter.filterResult.filter;
    },
    facilities: {
      get() {
        return this.$store.state.renter.filterResult.filter.facility.data;
      },
    },
    categories() {
      return this.$store.state.renter.filterResult.filter.categories.data;
    },
    filterParamValue() {
      return this.$store.state.renter.hostelGroup.filter;
    },
  },
  created() {
    if (this.facilities.length === 0) {
      this.getAllFacilities();
    }
    if (this.categories.length === 0) {
      this.getAllCategories();
    }
  },
};
</script>
<style scoped>
.v-expansion-panel::before {
  box-shadow: none !important;
}
</style>
>
