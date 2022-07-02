<template>
  <div v-if="!isLoadingContracts" style="width: 100%;" class="pa-1 d-flex flex-column">
    <v-virtual-scroll
      :items="expiringContracts"
      :item-height="40"
      height="200"
      v-if="expiringContracts.length > 0"
    >
      <template v-slot="{ item, index }">
        <v-list-item
          :key="item.contractId"
          class="px-0 py-0 d-flex align-center overview"
          v-bind:style="index % 2 === 0 ? 'background-color: #f1f3fa;' : 'background-color: #fff;'"
        >
          <v-row class="d-flex align-center ma-0">
            <v-col cols="5" class="px-3 d-flex align-center">
              <span class="size-sub-3 font-nunito">{{ item.room.roomName }}</span>
            </v-col>
            <v-col cols="4" class="px-3 d-flex align-center">
              <span class="size-sub-3 font-nunito">{{ item.renter.username }}</span>
            </v-col>
            <v-col cols="3" class="px-3 d-flex align-center">
              <span class="size-sub-3 font-nunito">{{ getExpiringDateString(item) }}</span>
            </v-col>
          </v-row>
        </v-list-item>
      </template>
    </v-virtual-scroll>
    <span
      v-if="expiringContracts.length === 0"
      class="d-flex justify-center font-nunito text-primary size9rem"
    >
      Không có hợp đồng sắp hết hạn
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ExpiringRoom',
  props: ['groupId'],
  data: () => ({
    expiringContracts: [],
  }),
  methods: {
    ...mapActions({
      getContracts: 'user/getContracts',
    }),
    updateExpiringRoomList(groupId) {
      console.log('watch groupid run');
      const oneMonth = 31 * 24 * 60 * 60 * 1000;
      let expiring = [];
      // get all the contracts which has valid time less than one month
      const now = Date.now();
      expiring = this.contracts
        .filter((contract) => contract.group.groupId === groupId)
        .filter((contract) => {
          const diff = now - contract.startTime;
          return diff < 6 * oneMonth;
        });
      this.expiringContracts = expiring;
    },
    getExpiringDateString(contract) {
      const { startTime, duration } = contract;
      const d = this.expiringDate(startTime, duration);
      return d.toLocaleDateString('vi-vn');
    },
    expiringDate(startTime, duration) {
      const oneMonth = 31 * 24 * 60 * 60 * 1000;
      const durationInMilis = duration * oneMonth;
      return new Date(startTime + durationInMilis);
    },
  },
  computed: {
    contracts() {
      return this.$store.state.user.contracts.data;
    },
    isLoadingContracts() {
      return this.$store.state.user.contracts.isLoading;
    },
  },
  watch: {
    groupId(newGroupId) {
      this.updateExpiringRoomList(newGroupId);
    },
  },
  created() {
    if (this.contracts.length === 0) {
      this.getContracts();
    }
    this.updateExpiringRoomList(this.groupId);
  },
};
</script>
<style>
.overview.v-list-item {
  min-height: 40px;
}
</style>
