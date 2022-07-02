<template>
  <v-container class="pa-0">
    <div style="height: 100%" class="hidden-xs-only">
      <v-card
        height="100%"
        class="d-flex flex-column"
        v-if="!user.isLoading"
        rounded="0"
        style="background: linear-gradient(135deg, #8f75da 0, #727cf5 60%)"
      >
        <div class="d-flex pa-4 align-center" style="border-bottom: 1px solid #cedce4">
          <router-link to="/">
            <div
              style="height: 55px; width: 55px; border-radius: 50%"
              class="white d-flex flex-column justify-center align-center"
            >
              <v-img
                alt="Hostel Renting"
                class="shrink ml-1"
                contain
                src="@/assets/logo-sac.png"
                transition="scale-transition"
                max-width="50"
                max-height="35"
              />
            </div>
          </router-link>
          <span class="font-nunito font-weight-bold white--text ml-5" style="font-size: 1rem"
            >Nhà Trọ SAC</span
          >
        </div>
        <v-list dense nav class="ma-auto mx-0" _height="100%">
          <v-list-item to="/vendor/mobile-message" v-if="isMobile" class="menu-item">
            <v-list-item-content class="font-nunito size-h4 text-primary py-5">
              <span class="menu-title"
                ><v-icon class="mr-5">mdi-chat-processing</v-icon>Tin nhắn</span
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="item in itemsplus"
            :key="item.title"
            :to="item.link"
            class="menu-item"
          >
            <v-list-item-content class="font-nunito size-h4 text-primary py-5">
              <span class="menu-title"
                ><v-icon class="mr-5">{{ item.icon }}</v-icon
                >{{ item.title }}</span
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <div tyle="height: 100%" class="hidden-sm-and-up">
      <v-card height="100%" class="d-flex flex-column" rounded="0" v-if="!user.isLoading">
        <div
          class="d-flex flex-column justify-center align-center"
          style="height: 150px; background: linear-gradient(135deg, #8f75da 0, #727cf5 60%)"
        >
          <v-btn icon>
            <v-avatar color="#fff" size="50" min-width="50" min-height="50" item>
              <v-img v-if="userData.avatar" :src="userData.avatar" :alt="userData.username"></v-img>
              <span v-else class="text-overline primary-text">{{
                getAvatarTitle(userData.username)
              }}</span>
            </v-avatar>
          </v-btn>
          <span class="font-nunito size-1rem white--text mt-3">{{ userData.username }}</span>
          <span class="font-nunito size9rem mt-1" style="color: #cedce4"
            >{{ userData.role === 'RENTER' ? 'Khách thuê' : '' }}
            {{ userData.role === 'VENDOR' ? 'Chủ trọ' : '' }}
          </span>
        </div>
        <v-expansion-panels accordion>
          <v-expansion-panel v-for="(item, i) in itemsMobile" :key="i">
            <v-expansion-panel-header @click="toTheNextPage(item.link)"
              ><span class="font-nunito size-sub-3 text-gray-dark font-weight-600"
                ><v-icon small class="mr-2" color="#343a40">{{ item.icon }}</v-icon
                >{{ item.title }}</span
              >
              <template v-slot:actions>
                <v-icon v-if="item.child"> mdi-chevron-down </v-icon>
                <v-icon v-else>mdi-chevron-right</v-icon></template
              ></v-expansion-panel-header
            >
            <v-expansion-panel-content v-if="item.child">
              <v-col
                cols="11"
                class="border-col py-2 ml-auto cursor"
                v-for="(child, index) in item.child"
                :key="index"
                @click="toTheNextPage(child.link)"
              >
                <span class="font-nunito size-sub-3 text-gray-dark font-weight-600">{{
                  child.title
                }}</span>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import pushNotificationMixins from '../mixins/pushNotification';
import authenticationMixins from '../mixins/authentication';

export default {
  name: 'SideMenuBar',
  mixins: [pushNotificationMixins, authenticationMixins],
  data() {
    return {
      drawer: true,
      itemsplus: [
        { title: 'Tổng quan', icon: 'mdi-view-dashboard', link: '/vendor/overview' },
        { title: 'Lịch xem phòng', icon: 'mdi-calendar-account', link: '/vendor/booking' },
        { title: 'Lịch rảnh', icon: 'mdi-calendar-clock', link: '/vendor/schedule' },
        {
          title: 'Quản lý nhà trọ',
          icon: 'mdi-home-group',
          link: '/vendor/groups',
        },
        {
          title: 'Quản lý hợp đồng',
          icon: 'mdi-file-document-edit',
          link: '/vendor/view-contract',
        },
      ],
      itemsMobile: [
        { title: 'Tin nhắn', icon: 'mdi-chat-processing', link: '/vendor/mobile-message' },
        { title: 'Lịch xem phòng', icon: 'mdi-calendar-account', link: '/vendor/booking' },
        {
          title: 'Quản lý nhà trọ',
          icon: 'mdi-home-group',
          child: [
            { title: 'Quản lý khu trọ', link: '/vendor/groups' },
            { title: 'Quản lý phòng trọ', link: '/vendor/rooms' },
          ],
          link: '#',
        },
        { title: 'Lịch rảnh', icon: 'mdi-application-cog', link: '/vendor/schedule' },
        { title: 'Mẫu hợp đồng chung', icon: 'mdi-content-save-cog-outline', link: '#' },
        {
          title: 'Quản lý hợp đồng',
          icon: 'mdi-file-document-edit',
          link: '/vendor/view-contract',
        },
        {
          title: 'Thống kê',
          icon: 'mdi-chart-scatter-plot-hexbin',
          link: '#',
        },
      ],

      itemadds: [
        { title: 'Tài khoản', icon: 'menu_profile', link: '/user' },
        { title: 'Liên hệ', icon: 'menu_contact', link: '#' },
      ],
      color: 'success',
      right: false,
      permanent: true,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      panel: [2],
    };
  },
  methods: {
    showItem(itemadd) {
      return !itemadd.mobile || (itemadd.mobile && this.isMobile);
    },
    ...mapActions({
      clearUserData: 'user/clearUserData',
      getUser: 'user/getUser',
    }),
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    toTheNextPage(link) {
      if (link !== '#') {
        this.$router.push(link);
      }
    },
  },
  created() {
    this.getUser().then(() => {
      console.log('get fcm token at sideMenuBar.vue');
      this.doGetMessagingToken();
    });
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
    hasMessagingToken() {
      return localStorage.getItem('messagingToken') != null;
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true;
        case 'sm':
          return true;
        default:
          return false;
      }
    },
  },
};
</script>
<style>
.item-image {
  height: 200px;
}
.item-text-display {
  color: #031d5f;
}
.text-display {
  color: #b4b7c8;
}
.side-nav-title {
  font-size: 0.6875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-weight: 700 !important;
}
.menu-title {
  color: #fff;
}
.menu-item .v-icon.v-icon {
  color: #fff !important;
}
</style>
