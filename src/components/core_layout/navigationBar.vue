<template>
  <div>
    <!-- eslint-disable max-len -->
    <v-overlay :value="overlay.show" light opacity="0.6"> </v-overlay>
    <v-app-bar
      app
      color="#fff"
      light
      height="80"
      min-height="80"
      max-height="160"
      id="top-bar"
      style="box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15) !important"
    >
      <v-row height="80" class="d-flex pa-0">
        <v-col cols="10" md="8" class="pa-0">
          <v-row class="ma-0 d-flex align-center" style="height: 100%">
            <v-col cols="3" md="2" class="d-flex align-center">
              <router-link to="/">
                <v-img
                  alt="Hostel Renting"
                  class="shrink mr-2"
                  contain
                  src="@/assets/logo-sac.png"
                  transition="scale-transition"
                  max-width="60"
                  max-height="60"
                />
              </router-link>
            </v-col>
            <v-col cols="9" md="7" class="pl-10 pa-0 hidden-xs-only" v-show="!isSearchOptional">
              <v-row class="pa-0 d-flex align-center px-0">
                <v-col cols="9" md="10" class="searchBar d-flex align-center">
                  <gmap-autocomplete
                    :options="gmap"
                    placeholder="Địa điểm, khu vực... bạn muốn ở gần"
                    class="col-11 gmap-input text-body-2 blue-grey--text"
                    @place_changed="setPlace"
                    @change="changeSearchValue"
                    :value="filter.coordinator.address"
                  ></gmap-autocomplete>
                  <v-btn
                    icon
                    @click="clearField()"
                    v-bind:style="{ visibility: computedClearable }"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="2" md="2" class="px-0">
                  <v-btn
                    class="bg-primary"
                    depressed
                    @click="searchByCoordinates"
                    height="40"
                    width="100%"
                    style="
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                    "
                  >
                    <v-icon color="white">search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="2" md="4" class="ml-auto d-flex justify-end align-center pr-5">
          <v-btn
            color="#727cf5"
            light
            depressed
            outlined
            rounded
            class="mr-5 font-weight-regular font-nunito hidden-sm-and-down"
            style="letter-spacing: 0.01rem !important"
            v-if="!user || (user && user.role === 'RENTER')"
            :to="`/room-alert`"
          >
            <v-icon left>mdi-home-search</v-icon>Đăng ký tìm phòng
          </v-btn>
          <notify />
          <v-btn
            to="/vendor"
            depressed
            dark
            color="blue"
            class="hidden-xs-only"
            v-if="user && user.role === 'VENDOR'"
          >
            <v-icon left>settings</v-icon>Quản lý phòng trọ
          </v-btn>
          <v-divider class="mx-3 hidden-xs-only" inset vertical style="height: 60px"></v-divider>
          <v-menu transition="slide-x-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon large class="ma-1" v-bind="attrs" v-on="on">
                <v-avatar
                  color="#727cf5"
                  size="35"
                  min-width="30"
                  min-height="30"
                  item
                  v-if="isLoggedIn && !isLoadingUser"
                >
                  <v-img v-if="user.avatar" :src="user.avatar" :alt="user.username"></v-img>
                  <span v-else class="text-overline white--text">{{
                    getAvatarTitle(user.username)
                  }}</span>
                </v-avatar>
                <v-avatar size="35px" item v-if="!isLoggedIn" min-width="30" min-height="30">
                  <v-icon>face</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <v-list v-if="!isLoggedIn" class="menu">
              <v-list-item to="/login">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-account-arrow-right</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Đăng nhập</v-list-item-title>
              </v-list-item>
              <v-list-item to="/register">
                <v-list-item-icon>
                  <v-icon color="#727cf5">person_add</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Đăng ký</v-list-item-title>
              </v-list-item>
              <v-list-item to="/room-alert" class="hidden-md-and-up">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-home-search</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Đăng ký tìm phòng</v-list-item-title>
              </v-list-item>
              <v-list-item to="/discovery">
                <v-list-item-icon>
                  <v-icon color="#727cf5">explore</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Thị trường thuê trọ</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list v-if="isLoggedIn">
              <v-list-item to="/user">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi mdi-account-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Tài khoản</v-list-item-title>
              </v-list-item>
              <v-list-item to="/vendor/booking" v-if="user && user.role === 'VENDOR'">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-account-clock-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Lịch hẹn của bạn</v-list-item-title>
              </v-list-item>
              <v-list-item to="#" v-if="user" class="hidden-md-and-up">
                <v-list-item-icon>
                  <v-badge color="pink" dot overlap>
                    <!-- <v-icon style="font-size: 25px;" color="#98a6ad">mdi mdi-bell-outline</v-icon> -->
                    <v-icon color="#727cf5">mdi mdi-bell-outline</v-icon>
                  </v-badge>
                </v-list-item-icon>
                <v-list-item-title>Thông báo</v-list-item-title>
              </v-list-item>
              <v-list-item
                to="/room-alert"
                class="hidden-md-and-up"
                v-if="user.role === 'RENTER'"
              >
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-home-search</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Đăng ký tìm phòng</v-list-item-title>
              </v-list-item>
              <v-list-item to="/cart" v-if="user.role === 'RENTER'">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-account-clock-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Lịch hẹn của bạn</v-list-item-title>
              </v-list-item>
              <v-list-item
                to="/contract"
                _class="hidden-md-and-up"
                v-if="user.role === 'RENTER'"
              >
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-file-document-edit</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Hợp đồng</v-list-item-title>
              </v-list-item>
              <v-list-item
                to="/vendor"
                class="hidden-sm-and-up"
                v-if="user.role === 'VENDOR'"
              >
                <v-list-item-icon>
                  <v-icon color="#727cf5">settings</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Quản lý phòng trọ</v-list-item-title>
              </v-list-item>
              <v-list-item to="/qr">
                <v-list-item-icon>
                  <v-icon color="#727cf5">fas fa-qrcode</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Quét mã QR</v-list-item-title>
              </v-list-item>
              <v-list-item to="/discovery">
                <v-list-item-icon>
                  <v-icon color="#727cf5">explore</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Thị trường thuê trọ</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon color="#727cf5">mdi-account-arrow-left</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Đăng xuất</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
</template>
<style>
.v-btn {
  text-transform: none !important;
}
#top-bar .v-input__control > .v-input__slot {
  padding-right: 0;
}
#top-bar .v-input__control > .v-input__slot div:nth-child(4) {
  margin-top: 0;
  height: 100%;
}
.searchBar {
  height: 40px;
  /* border: 1px solid #e4e7ea; */
  background-color: #f1f3fa;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  width: 100%;
}
.gmap-input:focus {
  outline: none;
}
.gmap-input::placeholder {
  color: #adb5bd;
  font-weight: 300 !important;
}
.logo:hover {
  cursor: pointer;
}
</style>
<style scoped>
.v-list-item__title {
  color: #6c757d;
  font-family: 'Nunito', sans-serif !important;
  font-weight: 400;
  font-size: 0.9rem;
}
.v-menu__content {
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.3) !important;
  border: 1px solid #f1f3fa;
  border: 1px solid #e4eaf2;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #6c757d;
}
</style>
<script>
import { mapActions } from 'vuex';
import authenticationMixins from '../mixins/authentication';
import processFCMForegroundMixins from '../mixins/processFCMForeground';
import notify from '../vendor/overview/Notify.vue';

export default {
  name: 'MyAppBar',
  mixins: [authenticationMixins, processFCMForegroundMixins],
  components: { notify },
  data: () => ({
    overlay: {
      show: false,
    },
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
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    viewHomePage() {
      this.$router.push('/');
    },
    setPlace(place) {
      this.currentPlace = place;
      this.address = `${place.name}-${place.formatted_address}`;
      this.searchValue = place.formatted_address;
      this.filter.coordinator.address = `${place.name}-${place.formatted_address}`;
      this.filter.coordinator.latitude = place.geometry.location.lat();
      this.filter.coordinator.longitude = place.geometry.location.lng();
    },
    changeSearchValue() {
      this.visibleProperty = 'visible';
    },
    clearField() {
      this.searchValue = '';
      this.address = '';
      this.visibleProperty = 'hidden';
      this.currentPlace = null;
      this.filter.coordinator.address = '';
      this.filter.coordinator.latitude = '';
      this.filter.coordinator.longitude = '';
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
          const university = this.universities.find((u) => {
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
      if (this.filter.coordinator.latitude && this.filter.coordinator.longitude) {
        const filterValue = this.filter;
        filterValue.around.selects = [];
        filterValue.facility.select = [];
        filterValue.price.disable = false;
        filterValue.minArea.select = '';
        filterValue.schools.select = '';
        filterValue.hometown.select = '';
        filterValue.regulations.select = [];
        this.searchLikeFilter({
          filterProperties: filterValue,
          page: 1,
          size: 5,
        });
        this.suggestUniversity();
        this.setSearchValue(this.coordinates);
        this.nameAddress = this.searchValue.split('-');
        // todo
        this.$router.push(
          `/result/latitude=${this.filter.coordinator.latitude}&longitude=${this.filter.coordinator.longitude}`,
        );
      }
    },
    search() {
      this.setSearchValue(this.searchValue);
      this.setSearchValue(this.coordinates);
      this.searchByCoordinator({
        lat: '',
        long: '',
      });
      this.$router.push('/filter');
    },
    ...mapActions({
      setSearchValue: 'renter/filterResult/setSearchValue',
      setIsSearchOptional: 'renter/home/setSearchTypeValue',
      getUser: 'user/getUser',
      clearUserData: 'user/clearUserData',
      searchByCoordinator: 'renter/filterResult/searchByCoordinator',
      searchLikeFilter: 'renter/filterResult/filterSearchByCoordinatorResult',
      getAllSchools: 'renter/filterResult/getAllSchools',
    }),
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
    messages() {
      return this.$store.state.user.notifications.data;
    },
    filter() {
      this.changeSearchValue();
      return this.$store.state.renter.filterResult.filter;
    },
    universities() {
      return this.$store.state.renter.filterResult.filter.schools.items;
    },
    coordinator() {
      return this.$store.state.renter.filterResult.coordinator;
    },
    searchValue: {
      get() {
        return this.address;
      },
      set(value) {
        this.setSearchValue(value);
      },
    },
    isLoggedIn() {
      return this.$store.state.user.user.data;
    },
    user() {
      return this.$store.state.user.user.data;
    },
    isLoadingUser() {
      return this.$store.state.user.user.isLoading;
    },
    computedClearable() {
      return this.visibleProperty;
    },
  },
  created() {
    this.getUser();
    if (this.universities.length === 0) {
      this.getAllSchools();
    }
  },
};
</script>
