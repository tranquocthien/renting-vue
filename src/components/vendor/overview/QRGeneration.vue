<template>
  <v-row>
    <v-col
      v-for="item in bookings"
      :key="item"
      cols="12"
      sm="4"
      v-on="changeToString(item.bookingId)"
    >
      <div>
        <qrcode-vue :value="qrvalue" :size="200" level="H"></qrcode-vue>
      </div>
      <div>
        <p>test value in qrcode</p>
        <h1>{{ qrvalue }}</h1>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import { mapActions } from 'vuex';

export default {
  name: 'QRGeneration',
  components: {
    QrcodeVue,
  },
  data() {
    return {
      qrvalue: null,
    };
  },
  methods: {
    ...mapActions({
      getBookings: 'user/getBookings',
      getUser: 'user/getUser',
    }),
    // changeToString(groupId, renterId, bookingId) {
    changeToString(bookingId) {
      // this.qrvalue = `${groupId.toString()}/${renterId.toString()}/${bookingId.toString()}`;
      this.qrvalue = bookingId.toString();
      // this.qrvalue = `${this.bookings.group.groupId.toString()}
      // ${this.bookings.renter.renterId}`;
      return this.qrvalue;
    },
  },
  computed: {
    isLoading() {
      return this.$store.state.user.bookings.isLoading;
    },
    bookings() {
      return this.$store.state.user.bookings.data;
    },
  },
  created() {
    this.getUser().then(() => this.getBookings());
  },
};
</script>
