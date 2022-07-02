<template>
  <v-col col="4" md="4">
    <v-card class="pa-2">
      <v-card-text class="pa-0">
        <span class="d-flex align-center"
          ><v-icon class="mr-2">{{
            room.roomObj.available ? 'mdi-door-closed' : 'mdi-door-closed-lock'
          }}</v-icon
          ><span class="font-nunito text-gray sixe1rem">{{ room.roomObj.roomName }}</span></span
        >
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'roomItem',
  props: { room: Object, type: Object },
};
</script>

<style>
</style>
