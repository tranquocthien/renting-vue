<template>
  <div>
    <span class="text-h6"><v-icon>info</v-icon> Thông tin cơ bản</span>
    <v-text-field v-model="type.title" hide-details prefix="Tên:" prepend-icon="closed_caption" />
    <v-text-field
      type="number"
      v-model="type.price"
      prefix="Giá:"
      suffix="triệu"
      prepend-icon="local_offer"
    ></v-text-field>
    <v-text-field
      type="number"
      v-model="type.superficiality"
      prefix="Diện tích:"
      prepend-icon="crop"
      suffix="m²"
    ></v-text-field>
    <v-text-field
      type="number"
      v-model="type.capacity"
      suffix="người ở"
      prepend-icon="group"
    ></v-text-field>
  </div>
</template>
<script>
export default {
  name: 'HostelTypeInfoEditor',
  props: ['type'],
};
</script>
