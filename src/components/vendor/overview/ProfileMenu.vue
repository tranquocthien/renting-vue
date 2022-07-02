<template>
  <div
    class="d-flex align-center justify-center mr-md-3"
    style="
      height: 100%;
      background-color: #fafbfd !important;
      border: 1px solid #f1f3fa !important;
      border-width: 0 1px !important;
    "
  >
    <v-menu offset-y bottom open-on-hover _v-if="!isLoadingUser">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="d-flex justify-center align-center px-4"
          style="min-width: 150px !important"
        >
          <v-btn icon>
            <v-avatar color="#727cf5" size="35" min-width="30" min-height="30" item>
              <v-img v-if="user.avatar" :src="user.avatar" :alt="user.username"></v-img>
              <span v-else class="text-overline white--text">{{
                getAvatarTitle(user.username)
              }}</span>
            </v-avatar>
          </v-btn>
          <div class="hidden-xs-only">
            <span class="text-muted d-flex flex-column font-nunito">
              <span class="size9rem text-primary">{{ user.username }}</span>
              <span class="size-caption">Chủ trọ</span>
            </span>
          </div>
        </div>
      </template>
      <v-list>
        <v-list-item
          style="min-height: 20px !important"
          class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
        >
          <v-icon color="#6c757d" class="mr-2 item-hover" size="15">mdi-account-circle</v-icon>
          <v-list-item-title class="item-hover font-nunito text-gray size9rem"
            >Tài khoản của tôi</v-list-item-title
          >
        </v-list-item>
        <v-list-item
          style="min-height: 20px !important"
          class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
          @click="logout"
        >
          <v-icon color="#6c757d" class="mr-2 item-hover" size="15">mdi-account-arrow-left</v-icon>
          <v-list-item-title class="item-hover font-nunito text-gray size9rem"
            >Đăng xuất</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import authenticationMixins from '../../mixins/authentication';

export default {
  mixins: [authenticationMixins],
  data: () => ({
    infoMenu: [
      {
        title: 'Thông tin',
        url: '',
      },
    ],
  }),
  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      clearUserData: 'user/clearUserData',
    }),
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
  },
  computed: {
    user() {
      return this.$store.state.user.user.data;
    },
    isLoadingUser() {
      return this.$store.state.user.user.isLoading;
    },
  },
};
</script>
