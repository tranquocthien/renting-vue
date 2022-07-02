<template>
  <!-- eslint-disable max-len -->
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
            height="180"
            hide-delimiters
            show-arrows-on-hover
            v-if="type.imageUrls.length !== 0"
          >
            <v-carousel-item
              v-for="(image, i) in type.imageUrls"
              :key="i"
              :src="type.imageUrls[i].resourceUrl"
            >
              <div class="top">
                <span class="text-body-2 amber--text" _style="color: #3476b2">{{
                  getGroupByType.category.categoryName
                }}</span>
                <br />
                <span class="text-caption">{{ type.view }} lượt xem</span>
              </div>
              <!-- </v-img> -->
            </v-carousel-item>
          </v-carousel>
          <v-img src="@/assets/image-error.png" v-else style="height: 180px" class="image-box">
            <div class="top">
              <!-- <span class="text-body-2 amber--text" _style="color: #3476b2">{{
                type.category.categoryName
              }}</span> -->
              <br />
              <span class="text-caption">{{ type.view }} lượt xem</span>
            </div>
          </v-img>
          <div class="item-classic-price text-body-1 white--text">
            <span>{{ type.price }} {{ type.priceUnit }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="8" md="8" lg="8" class="cursor hidden-xs-only" @click="viewHostelType()">
        <v-col cols="12" class="px-6 white">
          <div class="type-name mt-2" style="height: 40px">
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
                  {{ type.facilities.filter((f) => f.facilityName.includes('WC'))[0].facilityName }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-3 align-center d-flex">
            <span class="item-text font-nunito" style="color: #656565">Giới nghiêm:</span>
            <span
              class="item-text font-nunito font-weight-medium ml-1"
              v-if="getGroupByType.curfewTime === null"
              >Giờ giấc tự do</span
            >
            <span v-else class="item-text font-nunito font-weight-medium ml-1">{{
              getGroupByType.curfewTime
            }}</span>
            <span
              class="item-text font-nunito font-weight-medium ml-auto"
              v-if="getGroupByType.ownerJoin == false"
              >Không chung chủ</span
            >
            <span class="item-text font-nunito font-weight-medium ml-auto" v-else>Chung chủ</span>
            <!-- </div> -->
          </div>
        </v-col>
      </v-col>
      <v-col
        cols="12"
        sm="8"
        md="8"
        lg="8"
        class="no-padding d-flex justify-center align-center cursor d-flex d-sm-none"
        style="padding-left: 7px !important; background: #f3f4f9"
        @click="viewHostelType()"
      >
        <v-col cols="12" class="px-6 white">
          <div class="type-name mt-2" style="height: 40px">
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
                  {{ type.facilities.filter((f) => f.facilityName.includes('WC'))[0].facilityName }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <span class="item-text" style="color: #656565">Giới nghiêm:</span>
            <div class="d-flex ml-1 left">
              <span
                class="item-text font-nunito font-weight-medium"
                v-if="getGroupByType.curfewTime === null"
                >Giờ giấc tự do</span
              >
              <span v-else class="item-text font-nunito font-weight-medium">{{
                getGroupByType.curfewTime
              }}</span>
            </div>
            <div class="ml-auto d-flex">
              <span class="item-text font-nunito font-weight-medium" v-if="getGroupByType.ownerJoin == false"
                >Không chung chủ</span
              >
              <span class="item-text font-nunito font-weight-medium" v-else>Chung chủ</span>
            </div>
          </div>
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
  z-index: 100;
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

.top {
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  width: auto;
  max-width: 80%;
  padding: 8px 16px;
  background: rgba(132, 132, 132, 0.66);
  color: #fff;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  border-bottom-left-radius: 24px;
  box-sizing: border-box;
}
.detail:hover {
  cursor: pointer;
}
</style>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'TypeRequest',
  props: {
    index: Number,
    type: Object,
    groups: Array,
  },
  data: () => ({
    numberIcons: [
      'mdi-numeric-1-circle-outline',
      'mdi-numeric-2-circle-outline',
      'mdi-numeric-3-circle-outline',
      'mdi-numeric-4-circle-outline',
      'mdi-numeric-5-circle-outline',
    ],
  }),
  created() {
    this.getProvinces();
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
    }),
    viewHostelType() {
      this.$router.push(`/detail/${this.type.typeId}`);
    },
  },
  computed: {
    isSearchOptional() {
      return this.$store.state.renter.home.searchType.isOptional;
    },
    nameAddress() {
      return this.$store.state.renter.home.searchType.nameAddress;
    },
    school() {
      return this.$store.state.renter.home.searchType.school;
    },
    hometown() {
      return this.$store.state.renter.home.searchType.hometown;
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
    getGroupByType() {
      return this.groups.filter((item) => item.groupId === this.type.groupId)[0];
    },
  },
};
</script>
