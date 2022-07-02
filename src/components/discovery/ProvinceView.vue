<template>
  <div>
    <v-row>
      <v-col cols="6" md="8" lg="10" class="d-flex justify-start">
        <p class="text-h5 font-weight-medium">{{ province.provinceName }}</p>
      </v-col>
      <v-col cols="6" md="4" lg="2">
        <v-select
          :items="selectionItems"
          v-model="selectedDistrict"
          dense
          outlined
          prepend-inner-icon="filter_list"
          flat
          placeholder="Chọn quận/huyện"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        v-for="(district, index) in districts"
        :key="district.districtId"
      >
        <DistrictItem :district="district" :img="imgs[index]" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import DistrictItem from './DistrictItem.vue';

export default {
  name: 'DisctrictView',
  components: {
    DistrictItem,
  },
  props: {
    province: Object,
  },
  data: () => ({
    selectedDistrict: null,
    imgs: [
      'https://batdongsanexpress.vn/wp-content/uploads/2017/08/thi-truong-du-an-can-ho-quan-1.jpg',
      'http://www.cbrevietnam.com/wp-content/uploads/2017/08/cbre-district-2-Hochiminh.jpg',
      'https://blogcdn.muaban.net/wp-content/uploads/2017/08/a215.jpg',
      'https://icdn.dantri.com.vn/2018/5/25/photo-1-1527260873692776860973.jpg',
      'https://cdn.shortpixel.ai/client/q_glossy,ret_img,w_800/https://dothobattrang.vn/wp-content/uploads/2018/11/chua-ong-bon-quan-5.jpg',
      'https://3.bp.blogspot.com/-4FT4X4v7H0M/VwFFtvVouRI/AAAAAAAAAMo/9As_svQ18NgHtiiOdLqTYyPX-NSOe3YFQ/s1600/cho-dau-moi-binh-tay.jpg',
      'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/09/1-12-e1505536237895.jpg',
      'https://cdn.tuoitre.vn/thumb_w/640/2018/3/9/photo-2-15205856151881485086011.jpg',
      'https://dichvukhambenhtainha.com/wp-content/uploads/2016/01/quan-9.jpg',
      'https://thuexesaigon.net/wp-content/uploads/2016/06/cho-thue-xe-quan-10.jpg',
      'https://data.voh.com.vn//uploads/Image/2016/08/10/1747515_qmsp.jpg',
      'http://www.cns.com.vn/assets/uploads/myfiles/images/2018-01-18-QTSC-mo-chi-nhanh-tai-silicon.jpg',
      'https://propzy.vn/tin-tuc/wp-content/uploads/2019/05/aeon_mall_binh_tan.jpg',
      'https://batdongsanhungthinh.com.vn/wp-content/uploads/2018/04/capitaland-quan-binh-thanh-4.jpg',
      'https://munkas.com/wp-content/uploads/2018/10/Quan-Go-Vap-anh1-1024x659.jpg',
      'https://propzy.vn/tin-tuc/wp-content/uploads/2019/05/22-du-an-duong-phan-xich-long.jpg',
      'https://iwater.vn/Image/Picture/New/quan_tan_binh.jpg',
      'https://blog.hoozing.vn/wp-content/uploads/2018/12/Bat-dong-san-quan-tan-phu-2.jpg',
      'https://fptfiber.vn/wp-content/uploads/2018/10/qu%E1%BA%ADn-th%E1%BB%A7-%C4%91%E1%BB%A9c.jpg',
      'https://image.sggp.org.vn/w580/Uploaded/2020/dudbexqdre/2019_09_30/phan-lo-ban-nen_ibpf.jpg',
      'https://daothanhan.com/wp-content/uploads/2018/10/%C4%90%E1%BA%A3o-Th%E1%BA%A1nh-An.jpg',
      'http://sosachketoan.vn/upload/images/dichvuketoan/dich-vu-ke-toan-huyen-cu-chi.jpg',
      'https://photo-1-baomoi.zadn.vn/w1000_r1/2018_08_01_114_27100718/df0a91c5a7864ed81797.jpg',
      'https://image.thanhnien.vn/660/uploaded/dinhson/2020_05_13/nhabe2_pydv.jpg',
    ],
  }),
  computed: {
    districts() {
      return this.province.districts;
    },
    selectionItems() {
      return this.province.districts.map((district) => ({
        text: district.districtName,
        value: district.districtId,
      }));
    },
  },
};
</script>
