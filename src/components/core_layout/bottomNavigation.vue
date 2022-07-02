<template>
  <v-bottom-navigation :value="value" color="#727cf5" grow app>
    <v-btn to="/vendor/overview">
      <span class="font-nunito">Tổng quan</span>

      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-btn to="/vendor/mobile-message">
      <span class="font-nunito">Tin nhắn</span>

      <v-icon>mdi-chat-processing</v-icon>
    </v-btn>

    <v-btn to="/vendor/booking">
      <span class="font-nunito">Lịch hẹn</span>

      <v-icon>mdi-calendar-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'bottomNavigation',
  data: () => ({ value: 1 }),
};
</script>

<style>
</style>
