<template>
  <div>
    <v-chip-group column>
      <v-chip
        v-for="item in regulations"
        v-bind:key="item.regulationId"
        :color="notAllowRule(item.regulationName) ? 'red lighten-4' : '#f1f3fa'"
        class="font-nunito"
      >
        <v-icon small color="#4250f2" v-if="!notAllowRule(item.regulationName)">done</v-icon>
        <v-icon x-small color="red" v-else>close</v-icon>
        {{ item.regulationName }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
<script>
export default {
  name: 'RegulationsBox',
  data: () => ({
    icons: ['ac_unit', 'kitchen'],
  }),
  props: ['regulations'],
  methods: {
    notAllowRule(ruleName) {
      return ruleName.toLowerCase().includes('cấm') || ruleName.toLowerCase().includes('không');
    },
  },
};
</script>
