<template>
  <v-img
    height="350"
    width="100%"
    :src="url"
    gradient="to top right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)"
  >
    <v-row class="fill-height ma-0" align="center" justify="center">
      <v-col cols="12">
        <p class="text-h3 font-weight-medium text-center white--text">Thị trường thuê phòng trọ</p>
        <p class="text-center white--text text-h6">
          Tìm hiểu về giá cả thuê phòng trọ trên từng khu vực để giúp bạn tìm được một căn phòng ưng
          ý.
        </p>
      </v-col>
    </v-row>
  </v-img>
</template>
<script>
export default {
  name: 'TopDiscoveryBanner',
  props: ['inputUrl'],
  data: () => ({
    fixedUrl:
      'https://res.cloudinary.com/thetripguru/image/upload/v1568697849/Ho_Chi_Minh_1_g3sdda.jpg',
  }),
  computed: {
    url() {
      return this.inputUrl || this.fixedUrl;
    },
  },
};
</script>
