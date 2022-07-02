<template>
  <div no-gutters class="d-flex flex-row flex-nowrap" style="height: 100%;">
    <v-card width="100%" height="100%" class="overflow-hidden" :loading="isLoading">
      <div style="position: absolute; width: auto; height: auto; z-index: 15;
            top: 50%;
            left: 50%;
            margin: -100px 0 0 -150px;
            text-align: center;"
      >
        <v-text style="font-size: 20px; opacity: 0.6;">Không có dữ liệu nhà trọ</v-text>
        <br/>
        <v-btn
          tile
          color="#727CF5"
          class="mt-2"
          @click="showGroupCreator = !showGroupCreator"
        >
          <v-icon color="white" left>
            add
          </v-icon>
          <div style="color: white;">Tạo mới khu trọ</div>
        </v-btn>
      </div>
      <HostelGroupCreator
        :show="showGroupCreator"
        @close="showGroupCreator = false"
        :create="true"
        :update="false"
      />
    </v-card>
  </div>
</template>
<script>
import HostelGroupCreator from '@/components/vendor/hostel_management/HostelGroupCreator.vue';
import { mapActions } from 'vuex';

export default {
  name: 'HostelManagement',
  components: {
    HostelGroupCreator,
  },
  data: () => ({
    groupId: null,
    typeId: null,
    drawer: true,
    mini: false,
    miniVariant: true,
    expandOnHover: true,
    showGroupCreator: false,
  }),
  computed: {
    groups() {
      return this.$store.state.vendor.group.groups.data;
    },
    isLoading() {
      return (
        this.$store.state.vendor.group.groups.isLoading ||
        this.$store.state.vendor.group.types.isLoading ||
        this.$store.state.vendor.group.rooms.isLoading
      );
    },
  },
  methods: {
    ...mapActions({
      getGroups: 'vendor/group/getGroups',
      getTypes: 'vendor/group/getTypes',
      getRooms: 'vendor/group/getRooms',
    }),
  },

  async created() {
    if (this.groups.length === 0) {
      this.getGroups().then(() => {
        this.getTypes().then(() => {
          this.getRooms().then(() => {
            if (this.groups.length > 0) {
              this.groupId = this.groups[0].groupId;
            }
          });
        });
      });
    } else {
      this.groupId = this.groups[0].groupId;
    }
  },
};
</script>
<style>
.container {
  height: 100%;
}
</style>
