<template>
  <v-row class="ma-0 d-flex">
    <v-col cols="6" class="pa-0">
      <v-col
        cols="12"
        class="d-flex flex-column justify-center font-nunito size-caption font-weight-bold"
        style="text-align: center"
      >
        <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
        <span>Độc lập – Tự do – Hạnh phúc</span>
        <span>------***------</span>
        <span class="size9rem mt-5">HỢP ĐỒNG THUÊ PHÒNG TRỌ</span>
      </v-col>
      <v-col
        cols="12"
        class="d-flex flex-column font-nunito font-weight-thin font-italic"
        style="font-size: 0.6rem !important"
      >
        <span
          >- Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015 và các văn bản hướng dẫn thi
          hành;</span
        >
        <span>- Căn cứ Luật Nhà ở, Luật Đất đai và các văn bản hướng dẫn thi hành;</span>
        <span>- Căn cứ vào năng lực và nhu cầu của các bên chủ thể giao kết hợp đồng;</span>
        <span>- Căn cứ nhu cầu thuê phòng trọ của Ông (Bà):</span>
      </v-col>
      <v-col cols="12" class="d-flex flex-column font-nunito font-weight-thin size-caption">
        <span>Hôm nay, ngày ... tháng ... năm 2020, tại địa chỉ {{ newGroup.address }}</span>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AppendixContract',
  computed: {
    newGroup() {
      return this.$store.state.vendor.group.newGroup;
    },
  },
};
</script>
<style scoped>
</style>
