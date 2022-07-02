<template>
  <div class="d-flex flex-column">
    <div class="above d-flex justify-space-around">
      <div style="width: 25%">
        <p class="font-weight-medium grey--text">Diện tích</p>
        <p class="font-weight-bold">{{ info.superficiality }} m2</p>
      </div>
      <div style="width: 25%">
        <p class="font-weight-medium grey--text">Sức chứa</p>
        <p class="font-weight-bold">{{ info.capacity }} người</p>
      </div>
      <div style="width: 25%">
        <p class="font-weight-medium grey--text">Toilet</p>
        <p class="font-weight-bold">{{ 'Có' }}</p>
      </div>
      <div style="width: 25%">
        <p class="font-weight-medium grey--text">Nấu ăn</p>
        <p class="font-weight-bold" v-if="true">Có</p>
        <p class="font-weight-bold" v-if="false">Không</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.above {
  width: 100%;
}
.below {
  width: 100%;
  background: #f3f5f5;
}
</style>
<script>
export default {
  name: 'mainInfo',
  props: {
    info: Object,
    group: Object,
  },
};
</script>
