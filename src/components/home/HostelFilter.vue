<template>
  <!-- eslint-disable max-len -->
  <v-card style="width: 100%" outlined>
    <v-card-title
      class="d-flex align-center justify-center white--text font-nunito py-5"
      style="background-color: #7d86f6"
      >Bộ tìm kiếm nâng cao</v-card-title
    >
    <v-expansion-panels focusable _multiple accordion v-model="panel">
      <v-col cols="12" class="border-col py-1">
        <v-autocomplete
          v-model="filter.schools.select"
          :items="filter.schools.items"
          item-text="schoolName"
          item-value="schoolId"
          label="Bạn cùng trường"
          class="text-body-2"
          append-icon="$expand"
          filled
          outlined
          cache-items
          dense
          color="indigo"
          hide-details
          hide-selected
          background-color="white"
          no-data-text="Không có kết quả phù hợp"
          :style="{
            borderRadius: '0px',
          }"
        >
          <template slot="selection" slot-scope="{ item }">
            <span class="font-nunito font-weight-medium text-caption text-primary-dark">{{
              item.schoolName
            }}</span>
          </template>
          <template slot="item" slot-scope="{ item }">
            <span class="font-nunito font-weight-medium text-caption">{{ item.schoolName }}</span>
            <br />
            <span class="font-nunito font-italic text-caption"
              >- {{ item.address.districtName }}</span
            >
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" class="border-col py-1">
        <v-autocomplete
          v-model="filter.hometown.select"
          :items="filter.hometown.items"
          label="Bạn cùng quê"
          item-text="provinceName"
          item-value="provinceId"
          class="text-body-2 text-primary-dark"
          append-icon="$expand"
          outlined
          dense
          color="indigo"
          hide-details
          hide-selected
          background-color="white"
          no-data-text="Không có kết quả phù hợp"
          :style="{
            borderRadius: '0px',
          }"
        >
          <template slot="selection" slot-scope="{ item }">
            <span class="font-nunito font-weight-medium text-caption text-primary-dark">{{
              item.provinceName
            }}</span>
          </template>
        </v-autocomplete>
      </v-col>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Loại</span>
              <v-fade-transition leave-absolute>
                <span v-if="!open" key="1" class="ml-auto text-body-2 text-primary-dark">
                  {{ getCategoryName(filter.categories.select) }}
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.categories.select" column>
            <v-chip
              filter
              outlined
              v-for="(item, i) in filter.categories.data"
              :key="`item-${i}`"
              :value="item.categoryId"
            >
              {{ item.categoryName }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Bán kính tìm kiếm tối đa</span>
              <v-fade-transition leave-absolute>
                <span v-if="open" key="0" class="text-caption text-muted">
                  Khoảng cách từ điểm tìm kiếm đến điểm thuê
                </span>
                <span v-else key="1" class="ml-auto text-body-2 text-primary-dark">
                  {{ filter.distance.select }}
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.distance.select" column>
            <v-chip
              filter
              outlined
              v-for="(item, i) in filter.distance.items"
              :key="`item-${i}`"
              :value="item"
            >
              {{ item }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="text-body-2 header-label">
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Tiện nghi xung quanh</span>
              <v-fade-transition leave-absolute>
                <span
                  v-if="!open && filter.around.selects.length !== 0"
                  key="1"
                  class="ml-auto text-body-2 text-primary-dark"
                >
                  <span v-if="filter.around.selects.length !== filter.around.data.length">
                    chọn {{ filter.around.selects.length }}
                  </span>
                  <span v-else>đã chọn tất cả</span>
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.around.selects" column multiple>
            <v-chip
              class="font-nunito"
              filter
              outlined
              v-for="(item, i) in utilities"
              :key="`item-${i}`"
              :value="item.categoryId"
              >{{ item.name }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="text-body-2 header-label">
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Tiện ích</span>
              <v-fade-transition leave-absolute>
                <span
                  v-if="!open && filter.facility.selects.length !== 0"
                  key="1"
                  class="ml-auto text-body-2 text-primary-dark"
                >
                  <span v-if="filter.facility.selects.length !== filter.facility.data.length">
                    chọn {{ filter.facility.selects.length }}
                  </span>
                  <span v-else>đã chọn tất cả</span>
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.facility.selects" column multiple>
            <v-chip
              class="font-nunito"
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
      <!-- <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Quy định</span>
              <v-fade-transition leave-absolute>
                <span v-if="open" key="0" class="text-caption text-muted">
                  Không cấm những hành động sau
                </span>
                <span v-else key="1" class="ml-auto text-body-2 text-primary-dark"> </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.regulations.select" column multiple>
            <v-chip
              filter
              outlined
              v-for="(item, i) in filter.regulations.items"
              :key="`item-${i}`"
              :value="item.regulationId"
              >{{ item.regulationName }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel> -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Giá thuê</span>
              <v-fade-transition leave-absolute v-if="filter.price.disable">
                <span v-if="!open" key="1" class="ml-auto text-body-2 text-primary-dark">
                  {{ filter.price.range[0] }} - {{ filter.price.range[1] }} triệu
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-row>
            <v-col class="px-5 pt-0">
              <v-switch
                class="ml-auto mb-4 filter"
                height="10"
                v-model="filter.price.disable"
                label="Lọc"
                color="#727cf5"
              />
              <v-range-slider
                v-model="filter.price.range"
                :max="filter.price.max"
                :min="filter.price.min"
                hide-details
                :thumb-size="28"
                thumb-label="always"
                step="0.1"
                :disabled="!filter.price.disable"
                color="#3645f1"
                class="filter"
              />
              <v-row class="justify-center align-center">
                <v-subheader>{{ min }} triệu</v-subheader>
                <v-subheader class="ml-auto">{{ max }} triệu</v-subheader>
                <v-btn
                  icon
                  color="indigo"
                  height="30"
                  width="30"
                  :disabled="!filter.price.disable"
                  @click="changeMaxPrice()"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel class="lastItem">
        <v-expansion-panel-header>
          <template v-slot:default="{ open }">
            <v-row no-gutters class="d-flex flex colum">
              <span class="text-body-2 header-label">Diện tích tối thiểu</span>
              <v-fade-transition leave-absolute>
                <span v-if="!open" key="1" class="ml-auto text-body-2 text-primary-dark">
                  {{ filter.minArea.select }}
                </span>
              </v-fade-transition>
            </v-row>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="noPadding">
          <v-chip-group v-model="filter.minArea.select" column>
            <v-chip
              outlined
              v-for="(item, i) in minArea"
              :key="`item-${i}`"
              :value="item"
              class="font-nunito"
              >{{ item }}</v-chip
            >
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions class="pa-4" style="border-top: 1px solid rgba(0, 0, 0, 0.12)">
      <v-btn
        class="bg-primary bt-primary-hover white--text font-nunito"
        width="100%"
        @click="filterSubmit()"
        :loading="isCreate"
        >Tìm kiếm</v-btn
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
.border-col {
  border: 0.8px solid rgba(0, 0, 0, 0.12) !important;
  border-left: 0px !important;
  border-right: 0px !important;
  border-bottom: 0px !important;
  border-radius: 0px;
}
</style>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: rgba(0, 0, 0, 0.12);
  border: 0px;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}

.header-label {
  color: #313a46 !important;
}
</style>
<style>
.filter .v-input__slot {
  /* color: #313a46; */
  border: none !important;
}
</style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'HostelFilter',
  data: () => ({
    panel: [2],
    facilityIds: [],
    serviceIds: [],
    min: 0,
    max: 15,
    range: [0, 2.5],
    disabled: false,
    slider: 3,
    minSuperficiality: 0,
    // new
    filterSelected: {
      categoriesIds: [],
      range: [0, 2.5],
      minSuperficiality: '',
      disabledPrice: false,
    },
  }),
  methods: {
    ...mapActions({
      getAllFacilities: 'renter/filterResult/getAllFacilities',
      getAllUtilities: 'renter/filterResult/getAllUtilities',
      getAllCategories: 'renter/filterResult/getAllCategories',
      getAllRegulations: 'renter/filterResult/getAllRegulations',
      getAllSchools: 'renter/filterResult/getAllSchools',
      getAllProvinces: 'renter/filterResult/getAllProvinces',
      getRealDistances: 'renter/filterResult/getRealDistances',
    }),
    ...mapActions({
      setFilterValue: 'renter/filterResult/setFilterValue',
      setPageValue: 'renter/filterResult/setPageValue',
    }),
    submit() {
      this.setFilterValue(this.filter);
      this.setPageValue(1);
      this.$emit('submitFilter');
    },
    changeMaxPrice() {
      if (this.filter.price.max < 50) {
        this.filter.price.max += 5;
        this.max = this.filter.price.max;
      }
    },
    filterSubmit() {
      if (!this.filter.coordinator.address) {
        let coordinator = [];
        coordinator = this.searchValue.split('&'); // eslint-disable-line
        this.filter.coordinator.latitude = coordinator[0].split('=')[1]; // eslint-disable-line
        this.filter.coordinator.longitude = coordinator[1].split('=')[1]; // eslint-disable-line
      }

      this.filterSearchByCoordinatorResult({
        filterProperties: this.filter,
        page: 1,
        size: 5,
      });
      window.$cookies.set('page', 1);
      this.setPageValue(1);
      // } else {
      //   console.log(this.$route.params.searchValue);
      // }
    },
    getCategoryName(id) {
      return this.filter.categories.data.filter((c) => c.categoryId === id)[0].categoryName;
    },
    ...mapActions({
      filterSearchByCoordinatorResult: 'renter/filterResult/filterSearchByCoordinatorResult',
    }),
  },
  computed: {
    searchValue() {
      return this.$route.params.searchValue;
    },
    page() {
      return this.$store.state.renter.filterResult.results.page;
    },
    filter() {
      return this.$store.state.renter.filterResult.filter;
    },
    place() {
      const address = `${this.$store.state.renter.filterResult.filter.coordinator.address}`;
      return address.split('-')[0];
    },
    facilities: {
      get() {
        return this.$store.state.renter.filterResult.filter.facility.data;
      },
    },
    utilities: {
      get() {
        return this.$store.state.renter.filterResult.filter.around.data;
      },
    },
    coordinates: {
      get() {
        return this.$store.state.renter.filterResult.search.value;
      },
    },
    minArea() {
      const selectedCatgory = this.filter.categories.select;
      switch (selectedCatgory) {
        case 2:
          return ['30 m2', '40 m2', '50 m2', '50 m2', '70 m2', '80 m2', '90 m2', '100 m2'];
        case 1:
          return ['10 m2', '15 m2', '20 m2', '25 m2', '30 m2', '40 m2'];
        default:
          return [];
      }
    },
    isCreate() {
      return this.$store.state.renter.filterResult.results.isLoading;
    },
  },
  created() {
    if (this.facilities.length === 0) {
      this.getAllFacilities();
    }
    if (this.utilities.length === 0) {
      this.getAllUtilities();
    }
    if (this.filter.categories.data.length === 0) {
      this.getAllCategories();
    }
    if (this.filter.regulations.items.length === 0) {
      this.getAllRegulations();
    }
    if (this.filter.hometown.items.length === 0) {
      this.getAllProvinces();
    }
    if (this.filter.schools.items.length === 0) {
      this.getAllSchools();
    }
  },
};
</script>
