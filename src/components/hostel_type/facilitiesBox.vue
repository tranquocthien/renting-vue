<template>
  <div>
    <v-chip-group column>
      <v-chip
        v-for="item in facilities"
        v-bind:key="item.facilityId"
        class="font-nunito"
        color="#f1f3fa"
      >
        {{ item.facilityName }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
<script>
export default {
  name: 'FacilitiesBox',
  data: () => ({}),
  props: ['facilities'],
};
</script>
