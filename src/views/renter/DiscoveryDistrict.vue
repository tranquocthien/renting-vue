<template>
  <!-- eslint-disable max-len -->
  <div class="bg-main">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!isLoading">
      <v-row class="justify-center">
        <v-col cols="11" sm="11" md="11" lg="11">
          <v-row class="d-flex justify-center align-center">
            <span class="font-weight-black font-nunito text-primary size-h3">{{
              district.districtName
            }}</span>
            <span class="text-brown size-h3 mx-2">-</span>
            <span class="font-nunito text-gray size-h3">Thành phố Hồ Chí Minh</span>
          </v-row>
          <v-row class="d-flex align-center justify-space-between mt-2">
            <v-col cols="12" sm="3" md="3" lg="4">
              <v-card class="px-4">
                <v-list-item two-line>
                  <v-list-item-content>
                    <span class="text-lowercase text-h5 mb-4">
                      {{
                        getDownPayment(
                          getPriceArea(districtStat.avgPrice, districtStat.avgSuperficiality),
                          'triệu',
                        )
                      }}/m<sup>2</sup>
                    </span>
                    <v-list-item-subtitle class="text-muted font-nunito"
                      >Giá thuê trung bình / m<sup>2</sup></v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-avatar tile color="white">
                    <v-icon x-large>attach_money</v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4">
              <v-card class="px-4">
                <v-list-item two-line>
                  <v-list-item-content>
                    <span class="text-uppercase text-h5 mb-4">
                      {{ districtStat.avgSuperficiality }}
                      <span class="text-lowercase">m<sup>2</sup></span>
                    </span>
                    <v-list-item-subtitle class="text-muted font-nunito"
                      >Diện tích trung bình / phòng</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-avatar tile color="white">
                    <v-img
                      style="width: 10px"
                      src="@/assets/home/superficies.svg"
                      transition="scale-transition"
                    />
                  </v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="4">
              <v-card class="px-4">
                <v-list-item two-line>
                  <v-list-item-content>
                    <span class="text-uppercase text-h5 mb-4">
                      {{ districtStat.avgPrice }}
                      <span class="text-lowercase">triệu</span>
                    </span>
                    <v-list-item-subtitle class="text-muted font-nunito"
                      >Giá trung bình / phòng</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-avatar tile color="white">
                    <v-icon x-large>attach_money</v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="d-flex mt-10">
            <v-col cols="12" lg="6">
              <v-card outlined class="flex" width="100%" style="height: 100%">
                <v-card-title class="d-flex justify-center" :style="{ backgroundColor: '#f4f4f4' }">
                  <span class="text-body-1 txt-dark text-capitalize font-nunito font-weight-medium"
                    >THEO PHƯỜNG</span
                  >
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchWard"
                    append-icon="mdi-magnify"
                    label="Tên phường"
                    single-line
                    hide-details
                    class="pt-0 filter"
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="itemWards"
                  :items-per-page="5"
                  class="elevation-1 filter"
                  :search="searchWard"
                  :footer-props="{
                    itemsPerPageAllText: 'Tất cả',
                    itemsPerPageText: 'Số lượng phường hiển thị',
                  }"
                ></v-data-table>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card width="100%" style="height: 100%" outlined>
                <v-card-title
                  class="d-flex justify-space-between"
                  :style="{ backgroundColor: '#f4f4f4' }"
                >
                  <span class="text-body-1 txt-dark text-capitalize font-nunito font-weight-medium"
                    >THEO ĐƯỜNG</span
                  >
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="searchStreet"
                    append-icon="mdi-magnify"
                    label="Tên đường"
                    single-line
                    hide-details
                    class="pt-0 filter"
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headerStreets"
                  :items="itemStreets"
                  :items-per-page="5"
                  class="elevation-1 filter"
                  :search="searchStreet"
                  :footer-props="{
                    itemsPerPageAllText: 'Tất cả',
                    itemsPerPageText: 'Số lượng đường hiển thị',
                  }"
                ></v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import {
  mapActions,
  // mapState,
  mapGetters,
} from 'vuex';

export default {
  name: 'DiscoveryDistrict',
  props: {
    districtInput: Object,
  },
  data: () => ({
    expand: false,
    mini: true,
    searchWard: '',
    searchStreet: '',
    headers: [
      {
        text: 'Phường',
        value: 'ward',
        align: 'start',
      },
      {
        text: 'Giá trung bình / phòng (Triệu)',
        value: 'wardAverage',
      },
      {
        text: 'Diện tích trung bình / phòng (m2)',
        value: 'wardM2',
      },
    ],
    headerStreets: [
      {
        text: 'Đường',
        value: 'street',
      },
      {
        text: 'Giá trung bình / phòng (Triệu)',
        value: 'streetAverage',
      },
      {
        text: 'Diện tích trung bình / phòng (m2)',
        value: 'streetM2',
      },
    ],
  }),
  computed: {
    ...mapGetters({
      getAverage: 'renter/discovery/getAverage',
    }),
    statistic() {
      return this.$store.state.renter.discovery.stats.district.data;
    },
    proviceStat() {
      return this.statistic.provinces[0];
    },
    districtStat() {
      if (!this.districtInput) {
        return this.proviceStat.districts[0];
      }
      return this.districtInput;
    },
    average() {
      return this.getAverage(this.streetIds);
    },
    districtId() {
      return this.$route.params.districtId;
    },
    district() {
      console.log(this.districtInput);
      return (
        this.districtInput ||
        this.$store.state.renter.common.districts.data.find(
          (district) => district.districtId === Number(this.districtId),
        )
      );
    },
    wards() {
      return this.districtStat.wards;
    },
    streets() {
      let allStreets = [];
      this.wards.forEach((item) => {
        allStreets = [
          ...allStreets,
          ...item.streets.map((street) => ({
            ward: item.wardName,
            streetId: street.streetId,
            streetName: street.streetName,
            avgPrice: street.avgPrice,
            avgSuperficality: street.avgSuperficality,
          })),
        ];
      });
      return allStreets;
    },
    streetIds() {
      return this.streets.map((street) => street.streetId);
    },
    wardNames() {
      return this.wards.map((ward) => ward.wardName);
    },
    isLoading() {
      return (
        this.$store.state.renter.common.provinces.isLoading ||
        this.$store.state.renter.discovery.stats.streets.isLoading ||
        this.$store.state.renter.discovery.stats.district.isLoading
      );
    },
    itemWards() {
      return this.wards.map((ward) => ({
        ward: ward.wardName,
        wardAverage: ward.avgPrice,
        wardM2: ward.avgSuperficality,
      }));
    },
    itemStreets() {
      return this.streets.map((street) => ({
        street: `${street.streetName} (${street.ward})`,
        streetAverage: street.avgPrice,
        streetM2: street.avgSuperficality,
      }));
    },
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
      getDistrictStatistic: 'renter/discovery/getDistrictStatistic',
    }),
    getStreetIds(ward) {
      return ward.streets.map((street) => street.streetId);
    },
    getWardStat(wardId) {
      const ward = this.districtStat.wards.find((w) => w.wardId === wardId);
      if (ward) {
        return { avgPrice: ward.avgPrice, avgSuperficality: ward.avgSuperficality };
      }
      return { avgPrice: 'Không xác định', avgSuperficality: 'Không xác định' };
    },
    getStreetStat(streetId) {
      const ward = this.districtStat.wards.find(
        (w) => w.streets.find((s) => s.streetId === streetId), // eslint-disable-line
      ); // eslint-disable-line
      if (ward) {
        const street = ward.streets.find((s) => s.streetId === streetId);
        return { avgPrice: street.avgPrice, avgSuperficality: street.avgSuperficality };
      }
      return { avgPrice: 'Không xác định', avgSuperficality: 'Không xác định' };
    },
    getPriceArea(priceAvg, areaAvg) {
      return priceAvg / areaAvg;
    },
    getDownPayment(price, priceUnit) {
      if (priceUnit === 'triệu') {
        if (price < 1) {
          return `${Math.round(price * 1000 * 1000) / 1000} nghìn`;
        }
        return `${price} triệu`;
      }
      return `${price} triệu`;
    },
  },
  created() {
    if (!this.districtInput) {
      this.getProvinces();
      if (!this.statistic) {
        this.getDistrictStatistic(this.districtId);
      }
    }
  },
};
</script>
<style>
.txt-dark {
  color: #212121 !important;
}
thead.v-data-table-header th {
  font-size: smaller !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: small !important;
}
</style>
