<template>
  <v-row class="banner-right d-flex flex-column justify-center align-center my-0">
    <!-- main thumnail -->
    <v-col cols="11" sm="10" md="8" lg="8" xl="7" class="d-flex justify-center align-center">
      <!-- search by location -->
      <div v-show="!advanceSearch" style="width: 100%">
        <v-row class="d-flex flex-column align-center justify-center">
          <p class="text-md-h2 text-h3 font-weight-bold yellow--text">NHÀ TRỌ SAC</p>
          <p
            class="white--text px-2 mt-4 font-weight-bold slogan hidden-xs-only"
            style="letter-spacing: 0.001em !important; color: #fdde52"
          >
            Hỗ trợ tìm kiếm, đề xuất và đặt lịch xem phòng trọ phù hợp nhất
          </p>
          <v-row class="d-flex px-0 justify-center align-center" :style="{ width: '100%' }">
            <v-col cols="12" md="7" class="py-0">
              <div
                class="d-flex justify-center align-center white"
                :style="{
                  width: '100%',
                  border: '1px solid #F3E5',
                  margin: '0px 0px 4px',
                  height: '50px',
                }"
              >
                <gmap-autocomplete
                  :options="gmap"
                  placeholder="Địa điểm, khu vực bạn muốn ở gần"
                  class="col-11 gmap-input text-body-2 blue-grey--text"
                  @place_changed="setPlace"
                  @change="changeSearchValue"
                  :value="coordinator.address"
                  autofocus
                ></gmap-autocomplete>
                <v-btn icon @click="clearField()" v-bind:style="{ visibility: computedClearable }">
                  <v-icon>clear</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="5" md="3">
              <v-btn
                class="text-button"
                :style="{
                  width: '100%',
                  height: '50px',
                  borderRadius: '0px',
                  boxShadow: 'none',
                  color: '#151515',
                }"
                color="yellow"
                @click="searchByCoordinates()"
                >TÌM KIẾM</v-btn
              >
            </v-col>
          </v-row>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="10" class="d-flex justify-end align-center px-0">
            <v-btn text @click="advanceSearch = !advanceSearch">
              <span class="white--text text-subtitle-1 font-weight-regular px-0 ml-auto"
                >Tìm kiếm nâng cao</span
              >
              <v-icon right color="white">
                {{ advanceSearch ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <!-- search like filter -->
      <div v-show="advanceSearch" :style="{ width: '100%' }">
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="12" class="d-flex justify-end align-center px-0">
            <v-btn text @click="advanceSearch = !advanceSearch">
              <span class="white--text text-subtitle-1 font-weight-regular px-0 ml-auto"
                >Tìm kiếm nâng cao</span
              >
              <v-icon right color="white">
                {{ advanceSearch ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center">
          <!-- address -->
          <v-col cols="12" sm="8" md="9" :style="{ height: '76px' }">
            <div
              class="d-flex justify-center align-center white"
              :style="{
                width: '100%',
                _borderTopLeftRadius: '4px',
                _borderTopRightRadius: '4px',
                border: '1px solid #F3E5',
                margin: '0px 0px 4px',
                height: '100%',
              }"
            >
              <gmap-autocomplete
                :options="gmap"
                placeholder="Địa điểm, khu vực bạn muốn ở gần"
                class="col-11 gmap-input text-body-2 blue-grey--text"
                @place_changed="setPlace"
                @change="changeSearchValue"
                :value="filter.coordinator.address"
                autofocus
              ></gmap-autocomplete>
              <v-btn icon @click="clearField()" v-bind:style="{ visibility: computedClearable }">
                <v-icon>clear</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="7" sm="4" md="3" :style="{ height: '76px' }">
            <v-select
              v-model="filter.distance.select"
              :items="filter.distance.items"
              label="Khoảng cách tối đa"
              class="text-subtitle-2"
              filled
              cache-items
              dense
              color="indigo"
              _clearable
              background-color="white"
              :style="{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
              }"
            ></v-select>
          </v-col>
          <!-- xs-categories -->
          <v-col cols="5" class="d-flex d-sm-none" :style="{ height: '76px' }">
            <v-select
              v-model="filter.categories.select"
              :items="filter.categories.data"
              item-text="categoryName"
              item-value="categoryId"
              label="Loại"
              class="text-subtitle-2"
              filled
              cache-items
              dense
              color="indigo"
              background-color="white"
              :style="{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
              }"
            ></v-select>
          </v-col>
          <!-- university & hometown -->
          <v-col cols="7" sm="8" md="7" :style="{ height: '76px' }">
            <v-autocomplete
              v-model="filter.schools.select"
              :items="filter.schools.items"
              item-text="schoolName"
              item-value="schoolId"
              label="Bạn học trường"
              class="text-body-2"
              filled
              cache-items
              dense
              color="indigo"
              clearable
              background-color="white"
              no-data-text="Không có kết quả phù hợp"
              :style="{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
              }"
            >
              <template slot="selection" slot-scope="{ item }">
                <span class="font-nunito font-weight-medium text-body-2">{{
                  item.schoolName
                }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <span class="font-nunito font-weight-medium text-body-2">{{
                  item.schoolName
                }}</span>
                <span class="font-nunito font-italic text-body-2"
                  >- {{ item.address.districtName }}, {{ item.address.province.provinceName }}</span
                >
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="5" sm="4" md="5" :style="{ height: '76px' }">
            <v-autocomplete
              v-model="filter.hometown.select"
              :items="filter.hometown.items"
              label="Quê ở"
              item-text="provinceName"
              item-value="provinceId"
              class="text-body-2"
              filled
              cache-items
              dense
              color="indigo"
              clearable
              background-color="white"
              no-data-text="Không có kết quả phù hợp"
              :style="{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
              }"
            ></v-autocomplete>
          </v-col>

          <!-- category & price & area -->
          <v-col cols="7" sm="9" md="7" class="d-flex" :style="{ height: '76px' }">
            <div :style="{ width: '30%' }" class="hidden-xs-only">
              <v-select
                v-model="filter.categories.select"
                :items="filter.categories.data"
                item-text="categoryName"
                item-value="categoryId"
                label="Loại"
                class="text-subtitle-2 mr-3"
                filled
                cache-items
                dense
                color="indigo"
                background-color="white"
                :style="{
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px',
                }"
              ></v-select>
            </div>
            <div :style="{ width: '40%' }" class="hidden-xs-only">
              <v-select
                v-model="filter.minArea.select"
                :items="minArea"
                label="`Diện tích tối thiểu"
                class="text-subtitle-2"
                filled
                dense
                color="indigo"
                clearable
                background-color="white"
                :style="{
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px',
                }"
              ></v-select>
            </div>
            <!-- area-xs -->
            <div :style="{ width: '100%' }" class="d-flex d-sm-none">
              <v-select
                v-model="filter.minArea.select"
                :items="minArea"
                label="Diện tích tối thiểu"
                class="text-subtitle-2"
                filled
                dense
                color="indigo"
                clearable
                background-color="white"
                :style="{
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px',
                }"
              ></v-select>
            </div>
            <div :style="{ width: '30%' }" class="hidden-xs-only">
              <v-row class="d-flex align-end pr-3">
                <v-switch class="ml-auto filter" hide-details v-model="disabled" />
                <span
                  class="text-body-1 font-weight-medium px-0"
                  style="line-height: normal; color: #ffff00"
                  >Giá thuê</span
                >
              </v-row>
            </div>
          </v-col>
          <v-col cols="5" class="d-flex d-sm-none" :style="{ height: '76px' }">
            <div :style="{ width: '100%' }" class="d-flex align-end hidden-xs-only">
              <v-switch class="ml-auto filter" hide-details v-model="disabled" />
              <span
                class="text-body-1 font-weight-medium px-0"
                style="line-height: normal; color: #ffff00"
                >Giá thuê</span
              >
            </div>
          </v-col>
          <v-col cols="10" md="5" class="pt-0 mt-10 pl-3">
            <v-range-slider
              v-model="filter.price.range"
              :max="filter.price.max"
              :min="filter.price.min"
              class="price filter"
              hide-details
              :thumb-size="28"
              thumb-label="always"
              step="0.1"
              :disabled="!disabled"
              v-show="disabled"
            />
            <v-row class="justify-center align-center" v-show="disabled">
              <!-- eslint-disable max-len -->
              <v-subheader class="subtitle-2" :style="{ height: '20px' }"
                >{{ filter.price.min }} triệu</v-subheader
              >
              <v-subheader class="ml-auto subtitle-2" :style="{ height: '20px' }"
                >{{ filter.price.max }} triệu</v-subheader
              >
              <v-btn
                icon
                color="indigo"
                height="30"
                width="30"
                :disabled="!disabled"
                @click="changeMaxPrice()"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <!-- utility & facility -->
          <v-col cols="5" md="4">
            <div :style="{ width: '100%', border: '2px solid #b2ccf7' }">
              <div class="flex d-flex justify-center align-center">
                <v-subheader class="white--text text-subtitle-1 font-weight-regular"
                  >Tiện nghi</v-subheader
                >
                <v-btn
                  color="white"
                  icon
                  class="ml-auto mr-2"
                  @click="showMoreFacilities = !showMoreFacilities"
                >
                  <v-icon>{{ showMoreFacilities ? 'remove_circle' : 'add_circle' }}</v-icon>
                </v-btn>
              </div>
              <div v-show="showMoreFacilities" class="banner">
                <v-chip-group
                  v-model="filter.facility.selects"
                  column
                  multiple
                  active-class="deep-purple--text text--accent-4"
                >
                  <v-list style="background: none !important">
                    <v-chip
                      class="font-nunito"
                      v-for="(item, i) in filter.facility.data"
                      :key="`item-${i}`"
                      :value="item.facilityId"
                      >{{ item.facilityName }}</v-chip
                    >
                  </v-list>
                </v-chip-group>
              </div>
            </div>
          </v-col>
          <v-col cols="7" md="5">
            <div :style="{ width: '100%', border: '2px solid #b2ccf7' }">
              <div class="flex d-flex justify-center align-center">
                <v-subheader class="white--text text-subtitle-1 font-weight-regular"
                  >Tiện ích xung quanh</v-subheader
                >
                <v-btn
                  disabled
                  color="white"
                  icon
                  class="ml-auto mr-2"
                  @click="showMoreAround = !showMoreAround"
                >
                  <v-icon>{{ showMoreAround ? 'remove_circle' : 'add_circle' }}</v-icon>
                </v-btn>
              </div>
              <div v-show="showMoreAround" class="banner">
                <v-chip-group
                  v-model="filter.around.selects"
                  column
                  multiple
                  active-class="deep-purple--text text--accent-4"
                >
                  <v-list style="background: none !important">
                    <v-chip
                      class="font-nunito"
                      v-for="(item, i) in filter.around.items"
                      :key="`item-${i}`"
                      :value="item"
                      >{{ item }}</v-chip
                    >
                  </v-list>
                </v-chip-group>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              class="text-button"
              :style="{
                width: '100%',
                height: '50px',
                borderRadius: '0px',
                boxShadow: 'none',
                color: '#151515',
              }"
              color="yellow"
              @click="searchByCoordinates()"
              >TÌM KIẾM</v-btn
            >
          </v-col>
        </v-row>
        <!-- </div> -->
      </div>
    </v-col>
  </v-row>
</template>
<style>
@import url('https://cdn.jsdelivr.net/npm/animate.css@3.5.1');
.banner-right {
  background-image: linear-gradient(rgba(96, 138, 206, 0.85), rgba(96, 138, 206, 0.85)),
    url(../../assets/home/blue-thumnail.png);
  background-size: cover;
  min-height: 500px;
  overflow: hidden;
}
.slogan {
  font-size: 2rem !important;
  font-family: Montserrat;
  letter-spacing: 0.1em !important;
  text-align: center;
}
.slogan-left {
  font-family: Montserrat;
  letter-spacing: 0.1em !important;
  text-align: center;
}
.banner-left {
  background-position: right;
  background-size: cover;
  overflow: hidden;
  margin-right: 20px;
}
.v-application .text-h2 {
  font-size: 60px !important;
  font-weight: bold;
  letter-spacing: 0.1em !important;
  font-family: 'Montserrat' !important;
}
.v-application p {
  margin-bottom: 36px;
}
.price .v-slider--horizontal .v-slider__track-container {
  height: 6px !important;
}
.v-application--is-ltr .v-text-field .v-label {
  font-size: revert !important;
}
.banner .v-list {
  height: 130px;
  overflow-y: auto;
}
</style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'Banner',
  data: () => ({
    showMoreFacilities: false,
    showMoreAround: false,
    advanceSearch: false,
    disabled: false,
    slides: [
      {
        title: 'Slide #1',
        content: 'Slide content',
        image: '',
      },
    ],
    visibleSearchOptional: 'visible',
    address: '',
    center: { lat: 10.7542893, lng: 106.1346955 },
    places: [],
    currentPlace: null,
    visibleProperty: 'hidden',
    gmap: {
      bounds: {
        north: 11.1602136,
        south: 10.3493704,
        east: 107.0265769,
        west: 106.3638784,
      },
      strictBounds: true,
    },
  }),
  methods: {
    ...mapActions({
      setIsSearchOptional: 'renter/home/setSearchTypeValue',
      setNameAddress: 'renter/home/setNameAddress',
      setSchool: 'renter/home/setSchool',
      setHometown: 'renter/home/setHometown',
      setSearchValue: 'renter/filterResult/setSearchValue',
      searchByCoordinator: 'renter/filterResult/searchByCoordinator',
      searchLikeFilter: 'renter/filterResult/filterSearchByCoordinatorResult',
      getAllFacilities: 'renter/filterResult/getAllFacilities',
      getAllCategories: 'renter/filterResult/getAllCategories',
      getAllSchools: 'renter/filterResult/getAllSchools',
      getAllProvinces: 'renter/filterResult/getAllProvinces',
    }),
    setPlace(place) {
      this.currentPlace = place;
      this.searchValue = place.formatted_address;
      this.address = `${place.name}-${place.formatted_address}`;
      this.coordinator.address = `${place.name}-${place.formatted_address}`;
      this.filter.coordinator.address = `${place.name}-${place.formatted_address}`;
      this.filter.coordinator.latitude = place.geometry.location.lat();
      this.filter.coordinator.longitude = place.geometry.location.lng();
    },
    changeSearchValue() {
      this.visibleProperty = 'visible';
    },
    checkSearchValue() {},
    clearField() {
      this.searchValue = '';
      this.address = '';
      this.coordinator.address = '';
      this.visibleProperty = 'hidden';
      this.currentPlace = null;
      this.filter.coordinator.address = '';
      this.filter.coordinator.latitude = '';
      this.filter.coordinator.longitude = '';
    },
    changeMaxPrice() {
      if (this.filter.price.max < 50) this.filter.price.max += 5;
    },
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      return d;
    },
    // Converts numeric degrees to radians
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    suggestUniversity() {
      if (this.currentPlace.name.toLowerCase().includes('đại học')) {
        let universityName = this.currentPlace.name.toLowerCase();
        universityName = universityName.includes('trường')
          ? universityName.split('trường ')[1] // eslint-disable-line
          : universityName; // eslint-disable-line
        let district = this.currentPlace.address_components.find(
          (a) => a.types[0] === 'administrative_area_level_2',
        );
        if (district) {
          district = district.short_name.toLowerCase();
          const university = this.schools.find((u) => {
            const contain =
              universityName.includes(u.schoolName.toLowerCase()) ||
              u.schoolName.toLowerCase().includes(universityName);
            const sameDistrict = u.address.districtName.toLowerCase().includes(district);
            const distance = this.getDistanceFromLatLonInKm(
              this.currentPlace.geometry.location.lat(),
              this.currentPlace.geometry.location.lng(),
              u.latitude,
              u.longitude,
            );
            return (contain && sameDistrict) || distance < 0.2;
          });
          if (university) {
            this.filter.schools.select = university.schoolId;
          } else {
            this.filter.schools.select = '';
          }
        }
      }
    },
    searchByCoordinates() {
      if (this.currentPlace || this.filter.coordinator.address) {
        if (this.advanceSearch) {
          this.searchLikeFilter({
            filterProperties: this.filter,
            page: 1,
            size: 5,
          });
          if (!this.filter.schools.select || this.filter.schools.select === '') {
            this.suggestUniversity();
          }
        } else {
          this.filter.price.disable = this.disabled;
          this.searchByCoordinator({
            lat: this.filter.coordinator.latitude,
            long: this.filter.coordinator.longitude,
          });
          this.suggestUniversity();
        }
        this.setSearchValue(this.coordinates);
        this.coordinator.latitude = this.filter.coordinator.latitude.lat;
        this.coordinator.longitude = this.filter.coordinator.latitude.lng;
        this.nameAddress = this.searchValue.split('-');
        this.isSearchOptional = true;
        this.$router.push(
          `/result/latitude=${this.filter.coordinator.latitude}&longitude=${this.filter.coordinator.longitude}`,
        );
      }
    },
  },
  computed: {
    isSearchOptional: {
      get() {
        return this.$store.state.renter.home.searchType.isOptional;
      },
      set(value) {
        this.setIsSearchOptional(value);
      },
    },
    filter() {
      // this.changeSearchValue();
      return this.$store.state.renter.filterResult.filter;
    },
    facilities() {
      return this.$store.state.renter.filterResult.filter.facility.data;
    },
    schools() {
      return this.$store.state.renter.filterResult.filter.schools.items;
    },
    coordinator() {
      return this.$store.state.renter.filterResult.coordinator;
    },
    categories() {
      return this.$store.state.renter.filterResult.filter.categories.data;
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
    nameAddress: {
      get() {
        return this.$store.state.renter.home.searchType.nameAddress;
      },
      set(value) {
        this.setNameAddress(value);
      },
    },
    school: {
      get() {
        return this.$store.state.renter.home.searchType.school;
      },
      set(value) {
        this.setSchool(value);
      },
    },
    hometown: {
      get() {
        return this.$store.state.renter.home.searchType.hometown;
      },
      set(value) {
        this.setHometown(value);
      },
    },
    searchValue: {
      get() {
        return this.address;
      },
      set(value) {
        this.setSearchValue(value);
      },
    },
    responsive() {
      switch (this.$vuetify.breakpoint.name) {
        case 'sm':
          return {};
        default:
          return {};
      }
    },
    computedClearable() {
      return this.visibleProperty;
    },
  },
  created() {
    this.isSearchOptional = true;
    if (this.facilities.length === 0) {
      this.getAllFacilities();
    }
    if (this.categories.length === 0) {
      this.getAllCategories();
    }
    if (this.filter.schools.items.length === 0) {
      this.getAllSchools();
    }
    if (this.filter.hometown.items.length === 0) {
      this.getAllProvinces();
    }
  },
  destroyed() {
    this.isSearchOptional = false;
  },
};
</script>
