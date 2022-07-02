<template>
  <v-card>
    <v-row class="mx-0 d-flex">
      <v-col
        cols="12"
        sm="4"
        md="4"
        lg="4"
        class="item-classic-left left"
        style="background: #f3f4f9"
      >
        <div class="item-classic-media" style="padding-right: 0px !important">
          <v-carousel
            height="235"
            hide-delimiters
            show-arrows-on-hover
            v-if="type.imageUrls.length !== 0"
          >
            <v-carousel-item v-for="(image, i) in type.imageUrls" :key="i" :src="image.resourceUrl">
            </v-carousel-item>
          </v-carousel>
          <v-img src="@/assets/image-error.png" v-else style="height: 235px" class="image-box">
          </v-img>
          <div class="top">
            Top
            <span class="yellow--text">{{ (page - 1) * 5 + index }}</span>
          </div>
          <div class="arrow-price">
            <span class="text-caption"
              >{{ type.currentBooking }} lịch hẹn / {{ type.availableRoom }} phòng</span
            >
          </div>
          <div class="item-classic-price text-body-1 white--text">
            <span>{{ type.price }} {{ type.priceUnit }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="8" md="8" lg="8" class="hidden-xs-only">
        <div class="d-flex flex-column px-1 pt-2">
          <v-card
            :to="'/detail/' + type.typeId"
            style="box-shadow: none !important"
            class="py-0 px-7"
          >
            <span
              class="item-address"
              style="
                display: block;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ group.address.streetName }}, {{ group.address.wardName }},
              {{ group.address.districtName }},
              {{ group.address.provinceName }}
            </span>
            <span class="d-flex font-nunito mt-1" v-if="realDistance">
              <span
                ><v-icon class="mr-2">mdi-map-marker-distance</v-icon
                >{{ realDistance.rows[0].elements[0].distance.text }}</span
              >
              <v-spacer />
              <span
                ><v-icon class="mr-2">mdi-motorbike</v-icon
                >{{ realDistance.rows[0].elements[0].duration.text }}</span
              >
            </span>
            <div class="type-name mt-1" style="height: 40px">
              <p
                style="
                  display: block;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                class="font-weight-bold mb-0"
              >
                {{ type.title }}
              </p>
            </div>
            <div class="align-center justify-center">
              <div class="mt-3 d-flex align-center">
                <v-img
                  src="@/assets/home/superficies.svg"
                  transition="scale-transition"
                  class="shrink mr-3"
                  max-width="15"
                  max-height="15"
                />
                <span class="item-text font-nunito font-weight-medium">
                  {{ type.superficiality }}
                  m
                  <sup>2</sup>
                </span>
                <div class="ml-auto d-flex justify-center align-center">
                  <v-img
                    src="@/assets/home/people.png"
                    transition="scale-transition"
                    class="shrink mr-3"
                    max-width="15"
                    max-height="15"
                  />
                  <span class="item-text font-nunito font-weight-medium"
                    >{{ type.capacity }} người</span
                  >
                </div>
                <div
                  class="ml-auto d-flex align-center"
                  v-if="type.facilities.filter((f) => f.facilityName.includes('WC')).length !== 0"
                >
                  <v-img
                    src="@/assets/home/toilet.png"
                    transition="scale-transition"
                    class="shrink mr-3"
                    max-width="15"
                    max-height="15"
                  />
                  <span class="item-text font-nunito font-weight-medium">
                    {{
                      type.facilities.filter((f) => f.facilityName.includes('WC'))[0].facilityName
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-center">
              <span class="item-text" style="color: #656565">Giới nghiêm:</span>
              <div class="d-flex ml-1 left">
                <span class="item-text" v-if="group.curfewTime === null">Giờ giấc tự do</span>
                <span class="item-text">{{ group.curfewTime }}</span>
              </div>
              <div class="ml-auto d-flex font-nunito">
                <span class="item-text" v-if="group.ownerJoin == false">Không chung chủ</span>
                <span class="item-text" v-else>Chung chủ</span>
              </div>
            </div>
          </v-card>
          <v-sheet class="pa-0 pt-3" max-width="100%" v-if="type.facilities.length !== 0">
            <v-slide-group show-arrows class="px-0" mobile-breakpoint>
              <v-slide-item v-for="(item, i) in type.facilities" :key="`item-${i}`">
                <v-chip class="ma-1 font-nunito" small>
                  {{ item.facilityName }}
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </div>
      </v-col>
      <v-col
        cols="12"
        class="no-padding d-flex justify-center align-center cursor d-flex d-sm-none"
        style="padding-left: 7px !important; background: #f3f4f9"
      >
        <v-col cols="12" class="pa-0">
          <v-card
            style="box-shadow: none !important"
            :to="'/detail/' + type.typeId"
            class="pt-5 px-6"
          >
            <span
              class="item-address"
              style="
                display: block;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ group.address.streetName }}, {{ group.address.wardName }},
              {{ group.address.districtName }},
              {{ group.address.provinceName }}
            </span>
            <span class="d-flex font-nunito mt-1" v-if="realDistance">
              <span
                ><v-icon class="mr-2">mdi-map-marker-distance</v-icon
                >{{ realDistance.rows[0].elements[0].distance.text }}</span
              >
              <v-spacer />
              <span
                ><v-icon class="mr-2">mdi-motorbike</v-icon
                >{{ realDistance.rows[0].elements[0].duration.text }}</span
              >
            </span>
            <div class="type-name mt-1" style="height: 40px">
              <p
                style="
                  display: block;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                class="font-weight-bold mb-0"
              >
                {{ type.title }}
              </p>
            </div>
            <div class="align-center justify-center">
              <div class="mt-3 d-flex align-center">
                <v-img
                  src="@/assets/home/superficies.svg"
                  transition="scale-transition"
                  class="shrink mr-3"
                  max-width="15"
                  max-height="15"
                />
                <span class="item-text font-nunito font-weight-medium">
                  {{ type.superficiality }}
                  m
                  <sup>2</sup>
                </span>
                <div class="ml-auto d-flex justify-center align-center">
                  <v-img
                    src="@/assets/home/people.png"
                    transition="scale-transition"
                    class="shrink mr-3"
                    max-width="15"
                    max-height="15"
                  />
                  <span class="item-text font-nunito font-weight-medium"
                    >{{ type.capacity }} người</span
                  >
                </div>
                <div
                  class="ml-auto d-flex align-center"
                  v-if="type.facilities.filter((f) => f.facilityName.includes('WC')).length !== 0"
                >
                  <v-img
                    src="@/assets/home/toilet.png"
                    transition="scale-transition"
                    class="shrink mr-3"
                    max-width="15"
                    max-height="15"
                  />
                  <span class="item-text font-nunito font-weight-medium">
                    {{
                      type.facilities.filter((f) => f.facilityName.includes('WC'))[0].facilityName
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex align-center">
              <span class="item-text" style="color: #656565">Giới nghiêm:</span>
              <div class="d-flex ml-1 left">
                <span class="item-text" v-if="group.curfewTime === null">Giờ giấc tự do</span>
                <span class="item-text" v-else>{{ group.curfewTime }}</span>
              </div>
              <div class="ml-auto d-flex font-nunito">
                <span class="item-text" v-if="group.ownerJoin == false">Không chung chủ</span>
                <span class="item-text" v-else>Chung chủ</span>
              </div>
            </div>
          </v-card>
          <v-sheet class="pa-0 pt-3" max-width="100%" v-if="type.facilities.length !== 0">
            <v-slide-group show-arrows class="px-0" mobile-breakpoint>
              <v-slide-item v-for="(item, i) in type.facilities" :key="`item-${i}`">
                <v-chip class="ma-1 font-nunito" small>
                  {{ item.facilityName }}
                </v-chip>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-col>

      <v-col
        cols="12"
        class="pr-0 pb-0 pt-0"
        v-if="
          searchValue &&
          (schoolSelected || hometownSelected) &&
          (type.schoolmate !== 0 || type.compatriot !== 0)
        "
        style="background: #f3f4f9; padding-left: 7px !important"
      >
        <v-col
          cols="12"
          class="d-flex justify-space-around align-center"
          style="background-color: #e7e9f0 !important"
        >
          <v-row class="d-flex justify-space-around">
            <!-- <v-col cols="11" md="3" style="padding: 0 !important;">
              <v-icon class="ml-2" color="#ABB4C0">visibility</v-icon>
              <span class="text-caption ml-2">{{ type.view }} lượt xem</span>
            </v-col> -->
            <v-col
              cols="11"
              md="7"
              style="padding: 0 !important"
              v-if="schoolSelected && type.schoolmate !== 0"
              class="d-flex justify-center align-center"
            >
              <v-icon color="#ABB4C0" class="mr-2">school</v-icon>
              <span class="text-caption"
                >{{ type.schoolmate }} người học {{ schoolSelected.schoolName }}</span
              >
            </v-col>
            <v-col
              cols="11"
              md="4"
              style="padding: 0 !important"
              v-if="hometownSelected && type.compatriot !== 0"
              class="d-flex justify-center align-center"
            >
              <v-icon color="#ABB4C0" class="mr-2">supervisor_account</v-icon>
              <span class="text-caption"
                >{{ type.compatriot }} người quê {{ hometownSelected.provinceName }}</span
              >
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped>
.item-classic {
  position: relative;
  overflow: hidden !important;
  z-index: 1;
  letter-spacing: 0;
  transition: 0.15s ease-out all;
  backface-visibility: hidden;
}
.v-card:hover {
  box-shadow: 0 0 29px 0 rgba(0, 0, 0, 0.16) !important;
}
.item-classic-horizontal {
  padding: 0;
  box-shadow: none;
  overflow: visible !important;
  text-align: left;
}
.item-classic-left {
  display: flex;
  flex-shrink: 0;
  padding: 0;
}
.no-padding {
  padding: 0 !important;
}
.item-classic-price {
  left: 0 !important;
  top: 28px;
  bottom: auto !important;
  z-index: 1;
  position: absolute;
  padding: 2px 21px 2px 11px;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  background-image: linear-gradient(to right, rgba(52, 203, 247), #1c63b8);
}
.item-classic-price::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 8px 8px 0;
  border-color: transparent #367dc3 transparent transparent;
}
.item-classic-media {
  position: relative;
  padding-left: 7px;
  overflow: hidden;
  padding-right: 20px;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.14),
    0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}
.v-img {
  background-size: contain, cover !important;
}

.item-equipment {
  background-color: #e7e9f0;
}
.top {
  position: absolute;
  right: 0;
  top: 0;
  /* display: block; */
  width: auto;
  max-width: 80%;
  padding: 8px 16px;
  background: rgba(32, 112, 185, 0.66);
  color: #fff;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  border-bottom-left-radius: 24px;
  box-sizing: border-box;
  z-index: 2;
}

.equipment-name {
  /* #656565 */
  color: #0d0d0d;
  font-size: 15px;
  font-family: 'Lato';
  font-weight: normal;
  min-height: 15px;
  line-height: 15px;
}

.item-address {
  color: #9a9a9a;
  font-size: 0.85rem;
}
.btnDetail {
  font-size: 13px;
  color: #fff;
  padding: 0 0 30px 30px;
  font-family: 'Nunito';
}
.v-btn:hover {
  background-color: #6c98c6 !important;
}
/* .image-box {
  transition: all 3s;
  transform: scale(1);
}
.image-box:hover {
  transform: scale(1.3);
} */
</style>
<style>
.arrow-price {
  background-image: linear-gradient(to right, rgba(114, 124, 245, 0.71), #1c63b8);
  color: #fff;
  padding: 4px 10px;
  position: absolute;
  bottom: 0;
  right: -1px;
}
.arrow-price:before {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  content: '';
  left: -12px;
  border-top: 15px solid transparent;
  border-right: 12px solid rgba(114, 124, 245, 0.71);
  border-bottom: 15px solid transparent;
  width: 0;
}
</style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'Article',
  props: {
    index: Number,
    type: Object,
    page: Number,
  },
  data: () => ({
    realDistance: '',
  }),
  created() {
    this.getProvinces();
    if (this.paramsSearchValue) {
      console.log(this.fetchDistance());
      console.log(this.realDistance);
    }
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
    }),
    viewDetail() {
      this.$router.push(`/detail/${this.type.typeId}`);
    },
    async fetchDistance() {
      return new Promise((resolve, reject) => {
        // let response;
        // eslint-disable-next-line
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            // eslint-disable-next-line
            origins: [
              // eslint-disable-next-line
              new google.maps.LatLng(
                this.paramsSearchValue.latitude,
                this.paramsSearchValue.longitude,
              ),
            ],
            // eslint-disable-next-line
            destinations: [
              // eslint-disable-next-line
              new google.maps.LatLng(this.group.latitude, this.group.longitude),
            ],
            // eslint-disable-next-line
            travelMode: google.maps.TravelMode.DRIVING,
          },
          // eslint-disable-next-line
          function (resp, status) {
            // eslint-disable-next-line
            if (status !== google.maps.DistanceMatrixStatus.OK) {
              reject(status);
            } else {
              resolve(resp);
              // this.realDistance = response;
            }
          },
        );
        // return response;
      })
        .then((res) => {
          this.realDistance = res;
        })
        .catch((err) => {
          this.realDistance = err;
        });
    },
    // async distance() {
    //   if (this.paramsSearchValue) {
    //     // eslint-disable-next-line
    //     const matrix = new google.maps.DistanceMatrixService();

    //     matrix.getDistanceMatrix(
    //       {
    //         // eslint-disable-next-line
    //         origins: [
    //           // eslint-disable-next-line
    //           new google.maps.LatLng(
    //             this.paramsSearchValue.latitude,
    //             this.paramsSearchValue.longitude,
    //           ),
    //         ],
    //         // eslint-disable-next-line
    //         destinations: [
    //           // eslint-disable-next-line
    //           new google.maps.LatLng(this.group.latitude, this.group.longitude),
    //         ],
    //         // eslint-disable-next-line
    //         travelMode: google.maps.TravelMode.DRIVING,
    //       },
    //       // eslint-disable-next-line
    //       function (response) {
    //         // eslint-disable-next-line
    //         console.log(response);
    //         this.realDistance = response;
    //       },
    //     );
    //   }
    // },
  },
  computed: {
    paramsSearchValue() {
      const param = this.$route.params.searchValue;
      if (param && param.includes('latitude')) {
        const items = param.split('&');
        const latitude = items[0].split('latitude=')[1];
        const longitude = items[1].split('longitude=')[1];
        return { latitude, longitude };
      }
      return null;
    },

    isSearchOptional() {
      return this.$store.state.renter.home.searchType.isOptional;
    },
    nameAddress() {
      return this.$store.state.renter.home.searchType.nameAddress;
    },
    school() {
      return this.$store.state.renter.filterResult.filter.schools;
    },
    schoolSelected() {
      if (this.searchValue && this.searchValue.includes('schoolId')) {
        window.$cookies.set('schoolMate', Number(this.type.schoolMate));
        const schoolIdSelected = Number(this.searchValue.split('&schoolId=')[1].split('&')[0]);
        return this.school.items.find((i) => i.schoolId === schoolIdSelected);
      }
      window.$cookies.set('schoolMate', 0);
      return null;
    },
    hometown() {
      return this.$store.state.renter.filterResult.filter.hometown;
    },
    hometownSelected() {
      if (this.searchValue && this.searchValue.includes('provinceId')) {
        window.$cookies.set('compatriot', Number(this.type.compatriot));
        const hometownIdSelectd = Number(this.searchValue.split('&provinceId=')[1].split('&')[0]);
        return this.hometown.items.find((p) => p.provinceId === hometownIdSelectd);
      }
      window.$cookies.set('compatriot', 0);
      return null;
    },
    services() {
      return this.type.services.map((s) => ({
        name: s.service.serviceName,
        price: `${s.servicePrice} ${s.priceUnit}/${s.userUnit}`,
      }));
    },
    facilities() {
      return this.type.facilities.map((f) => ({
        name: f.facilityName,
      }));
    },
    res() {
      return this.$vuetify.breakpoint.name;
    },
    responsive: {
      get() {
        const breakpoint = this.$vuetify.breakpoint.name;
        switch (breakpoint) {
          case 'xs':
          case 'sm':
          case 'md':
            return {
              image: {
                height: 300,
                width: '100%',
              },
              article: {
                width: 390,
              },
            };
          // case 'lg': return {};
          // case 'xl': return {};
          default:
            return {
              image: {
                height: 300,
                width: 300,
              },
              article: {
                width: '100%',
              },
            };
        }
      },
    },
    group: {
      get() {
        const id = this.type.groupId;
        let data = this.$store.getters['renter/home/getHostelGroupById'](id);
        if (!data) {
          data = this.$store.getters['renter/filterResult/getHostelGroupById'](id);
        }
        return data;
      },
    },
    searchValue() {
      return window.$cookies.get('searchValue');
    },
    filter() {
      return this.$store.state.renter.filterResult.filter;
    },
  },
};
</script>
