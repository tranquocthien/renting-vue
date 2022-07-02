<template>
  <v-row class="d-flex justify-center">
    <v-alert
      v-model="show"
      dismissible
      color="#fedee5"
      min-width="150"
      class="py-3 px-10"
      v-if="type === 'failed'"
    >
      <span
        ><v-icon small color="#823040" class="mr-2">mdi-cancel</v-icon
        ><strong style="color: #823040 !important" class="font-nuito size9rem">{{
          action
        }}</strong></span
      >
    </v-alert>
  </v-row>
</template>

<script>
export default {
  name: 'successAlert',
  props: { action: String, showAlert: Boolean, type: String },
  data: () => ({}),
  computed: {
    show() {
      return this.showAlert;
    },
  },
};
</script>

<style>
</style>
