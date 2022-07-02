<template>
  <v-card class="ml-5 mr-5" style="box-shadow: 0 0 20px 0 rgba(154, 161, 171, 0.15) !important">
    <v-carousel
      height="180"
      hide-delimiters
      show-arrows-on-hover
      v-if="type.imageUrls.length !== 0"
    >
      <v-carousel-item v-for="(image, i) in type.imageUrls" :key="i" :src="image.resourceUrl">
        <div class="category">
          <span class="font-weight-bold text-body-1 yellow--text"
            >{{ type.price }} {{ type.priceUnit }}</span
          >
          <br />
          <span class="text-caption">{{ type.view }} lượt xem</span>
        </div>
        <div class="arrow-price">
          <span class="transition-swing text-caption">{{ group.category.categoryName }}</span>
        </div>
      </v-carousel-item>
    </v-carousel>
    <v-img height="180" src="@/assets/image-error.png" v-else>
      <div class="category">
        <!-- eslint-disable max-len -->
        <span class="font-weight-bold text-body-1 yellow--text"
          >{{ type.price }} {{ type.priceUnit }}</span
        >
        <br />
        <span class="text-caption">{{ type.view }} lượt xem</span>
      </div>
      <div class="arrow-price">
        <span class="transition-swing text-caption">{{ group.category.categoryName }}</span>
      </div>
    </v-img>
    <v-divider class="mx-4" />
    <v-row class="d-flex align-center justify-center">
      <v-col cols="10 pt-0">
        <div
          class="text-primary d-flex align-center py-3"
          style="height: 60px; border-bottom: 1px solid #e2e6ed"
        >
          <p
            style="
              display: block;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            class="font-weight-bold mb-0"
          >
            {{ type.title }}
          </p>
        </div>
        <div class="mt-3 d-flex align-center" style="height: 40px" v-if="group">
          <v-img
            class="shrink mr-3"
            src="@/assets/home/address.png"
            transition="scale-transition"
            max-width="20px"
            max-height="20px"
          />
          <span class="font-nunito text-gray item-text">
            {{ group.address.streetName }}, {{ group.address.districtName }},
            {{ group.address.provinceName }}
          </span>
        </div>
        <div class="mt-3 d-flex align-center">
          <v-img
            class="shrink mr-5"
            src="@/assets/home/superficies.svg"
            transition="scale-transition"
            max-width="15px"
            max-height="15px"
          />
          <span class="item-title font-weight-black font-nunitoy">DIỆN TÍCH</span>
          <span class="item-text ml-auto font-nunito text-gray-dark"
            >{{ type.superficiality }} m<sup>2</sup></span
          >
        </div>
        <div class="mt-3 d-flex align-center">
          <v-img
            class="shrink mr-5"
            src="@/assets/home/people.png"
            transition="scale-transition"
            max-width="15"
            max-height="15"
          />
          <span class="item-title font-weight-black font-nunito">SỨC CHỨA</span>
          <span class="item-text ml-auto font-nunito text-gray-dark"
            >{{ type.capacity }} người</span
          >
        </div>
        <v-card-actions class="px-0 mt-3" md="auto">
          <!-- eslint-disable -->
          <v-btn
            class="btnDetail font-nunito bg-primary pl-3 pr-3 white--text"
            :to="'/detail/' + type.typeId"
            >Chi Tiết</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'TopCarouselItem',
  props: {
    type: Object,
    typeGroup: Object,
  },
  computed: {
    isLoadingProvinces() {
      return this.$store.state.renter.common.provinces.isLoading;
    },
    group: {
      get() {
        if (this.typeGroup) {
          return this.typeGroup;
        }
        const id = this.type.groupId;
        return this.$store.getters['renter/home/getTopViewHostelGroupById'](id);
      },
    },
    ward() {
      const { streetId } = this.group.street;
      const res = this.$store.getters['renter/common/getWardByStreetId'](streetId);
      return res;
    },
    district() {
      const { wardId } = this.ward;
      return this.$store.getters['renter/common/getDistrictByWardId'](wardId);
    },
    province() {
      const { districtId } = this.district;
      return this.$store.getters['renter/common/getProvinceByDistrictId'](districtId);
    },
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
    }),
  },
  created() {
    this.getProvinces();
    this.getRealDistance();
  },
};
</script>
<style scoped>
.v-card {
  border-radius: 0;
}
.category {
  position: absolute;
  right: 0;
  top: 0;
  display: block;
  width: auto;
  max-width: 80%;
  padding: 8px 16px;
  background: rgba(26, 103, 175, 0.66);
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 24px;
  box-sizing: border-box;
}
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
.item-title {
  color: #838e9d;
  font-size: 13px;
  font-weight: normal;
  font-family: 'Lato';
}
.item-text {
  font-size: 0.9rem !important;
  font-weight: 400 !important;
}
.item-text-detail {
  color: #3357b4 !important;
}
.btnDetail {
  width: 100%;
}
.btnDetail:hover {
  color: #fff !important;
  background-color: #4250f2 !important;
  border-color: #3645f1 !important;
}
</style>
