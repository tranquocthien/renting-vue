<template>
  <v-card class="mx-4" max-width="310" min-width="310">
    <!-- eslint-disable max-len -->
    <v-carousel
      height="170"
      hide-delimiters
      show-arrows-on-hover
      v-if="type.imageUrls.length !== 0"
    >
      <v-carousel-item v-for="(image, i) in images" :key="i" :src="images[i]">
        <div class="category">
          <span class="text-body-2 white--text">{{ group.category.categoryName }}</span>
          <br />
        </div>
        <div class="price">
          <span>{{ type.price }} {{ type.priceUnit }}</span>
        </div>
      </v-carousel-item>
    </v-carousel>
    <v-img style="height: 170px" src="@/assets/image-error.png" v-else>
      <div class="category">
        <span class="text-body-2 white--text">{{ group.category.categoryName }}</span>
        <br />
      </div>
      <div class="price">
        <span>{{ type.price }} {{ type.priceUnit }}</span>
      </div>
    </v-img>
    <v-divider class="mx-4" />
    <v-row class="d-flex align-center justify-center">
      <v-col cols="10 pt-2" @click="getDetail(type.typeId)">
        <span
          v-if="group"
          class="text-body-2 font-nunito"
          style="
            display: block;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #484848;
          "
        >
          {{ group.address.districtName }}, {{ group.address.provinceName }}
        </span>
        <div class="d-flex align-center py-3" style="height: 60px">
          <p
            style="
              display: block;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #4b9ef1;
              border-bottom: 1px solid #e2e6ed;
            "
            class="text-body-1 font-weight-medium mb-0"
          >
            {{ type.title }}
          </p>
        </div>
        <div class="d-flex rounded-0 d-flex justify-space-between mt-2 font-nunito">
          <div>
            <div class="d-flex justify-center align-center">
              <v-img
                src="@/assets/home/superficies.svg"
                transition="scale-transition"
                class="shrink mr-3"
                max-width="16"
                max-height="16"
              />
              <span class="text-body-1 font-weight-bold" style="color: #656565">
                {{ type.superficiality }}
                <span class="text-body-2 font-weight-medium" style="color: #656565">
                  m
                  <sup>2</sup>
                </span>
              </span>
            </div>
            <span class="text-caption" style="color: #656565">Diện tích</span>
          </div>
          <div>
            <div class="d-flex justify-center align-center">
              <v-img
                src="@/assets/home/people.png"
                transition="scale-transition"
                class="shrink mr-2"
                max-width="17"
                max-height="17"
              />
              <span class="text-body-1 font-weight-bold ml-auto" style="color: #656565">
                {{ type.capacity }}
                <span class="text-body-2 font-weight-medium" style="color: #656565">người</span>
              </span>
            </div>
            <span class="text-caption" style="color: #656565; float: right">Sức chứa</span>
          </div>
        </div>
        <div
          class="d-flex rounded-0 d-flex justify-space-between mt-2 font-nunito"
          style="height: 70px"
        >
          <div style="width: 60%" v-if="type.schoolmate > 0">
            <div class="d-flex align-center">
              <v-img
                src="@/assets/home/school.svg"
                transition="scale-transition"
                class="shrink mr-2"
                max-width="23"
                max-height="23"
              />
              <span class="text-body-1 font-weight-bold" style="color: #656565">
                {{ type.schoolmate }}
                <span class="text-body-2 font-weight-medium" style="color: #656565">người</span>
              </span>
            </div>
            <span
              class="text-caption"
              style="
                color: #656565;
                display: block;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              >{{ renter.school.schoolName }}</span
            >
          </div>
          <div v-if="type.compatriot > 0">
            <div class="d-flex justify-center align-center">
              <v-img
                src="@/assets/home/hometown.png"
                transition="scale-transition"
                class="shrink mr-2"
                max-width="20"
                max-height="20"
              />
              <span class="text-body-1 font-weight-bold ml-auto" style="color: #656565">
                {{ type.compatriot }}
                <span class="text-body-2 font-weight-medium" style="color: #656565">người</span>
              </span>
            </div>
            <span class="text-caption" style="color: #656565; float: right">{{
              renter.hometown.provinceName
            }}</span>
          </div>
        </div>
        <!-- <v-card-actions class="px-0 mt-3" md="auto">
          <v-btn color="#484848" class="btnDetail pl-3 pr-3" :to="'/detail/' + type.typeId">CHI TIẾT</v-btn>
        </v-card-actions>-->
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'SugesstionItem',
  props: {
    type: Object,
  },
  computed: {
    isLoadingProvinces() {
      return this.$store.state.renter.common.provinces.isLoading;
    },
    images: {
      get() {
        if (this.type.imageUrls.length !== 0) {
          return this.type.imageUrls.map((item) => item.resourceUrl);
        }
        return [];
      },
    },
    group: {
      get() {
        const id = this.type.groupId;
        return this.$store.getters['renter/hostelType/getHostelGroupById'](id);
      },
    },
    renter() {
      return this.$store.state.user.user.data;
    },
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
      getUtilities: 'renter/hostelGroup/getNearByUtilities',
      getDistrictStatistic: 'renter/discovery/getDistrictStatistic',
    }),
    getDetail(typeId) {
      this.$router.push(`/detail/${typeId}`);
      this.getUtilities({
        distance: '3',
        longitude: this.group.longitude,
        latitude: this.group.latitude,
      });
      this.getDistrictStatistic(this.group.address.districtId);
    },
  },
  created() {},
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
  background: rgba(132, 132, 132, 0.66);
  color: #fff;
  text-align: center;
  border-bottom-left-radius: 24px;
  box-sizing: border-box;
}
.btnDetail {
  font-size: 13px;
  color: #fff;
  font-family: 'Nunito';
  width: 100%;
}
.v-btn:hover {
  background-color: #6c98c6 !important;
}
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.price {
  position: absolute;
  left: 0;
  bottom: 0;
  display: block;
  width: auto;
  max-width: 70%;
  padding: 5px 10px;
  background: #1b1d2a;
  font-weight: 400;
  color: #fff;
}
</style>
