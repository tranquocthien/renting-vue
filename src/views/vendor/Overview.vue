<template>
  <div _style="overflow-y: hidden; height: calc(100vh - 72px);" class="d-flex flex-column">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog width="400" v-model="overlay.show" overlay-opacity="0.9">
      <v-card>
        <Chatbox
          v-if="overlay.doc"
          :doc="overlay.doc"
          :index="1"
          v-on:closeChat="closeMobileChatBox"
        />
      </v-card>
    </v-dialog>
    <v-row v-if="!isLoading" class="d-flex py-0 my-0">
      <v-col cols="12" md="9" class="d-flex flex-column py-0">
        <SlideBooking />
      </v-col>
    </v-row>
    <v-row v-if="!isLoading" class="d-flex">
      <v-col cols="12" md="9" class="d-flex flex-column mb-5">
        <HostelGroupsOverview />
      </v-col>
    </v-row>
    <div
      v-if="!isLoading"
      class="d-flex flex-row flex-nowrap"
      style="overflow-y: hidden; height: 100%"
    >
      <div
        style="width: 25vw; position: fixed; z-index: 3; bottom: 0; right: 0; top: 70px"
        v-show="showChatList"
        class="hidden-sm-and-down primary-box-shadown"
      >
        <ChatList :vendorId="user.userId" v-on:clickChat="showChatBox($event)" />
      </div>
    </div>
    <v-btn
      class="mx-2 hidden-sm-and-down"
      fab
      dark
      large
      color="purple"
      style="position: fixed; right: 10px; bottom: 25px; z-index: 1031"
      @click="showChatList = !showChatList"
    >
      <v-icon dark> mdi-chat-processing </v-icon>
    </v-btn>
    <v-card
      style="position: fixed; right: 330px; bottom: 0px; height: auto; width: 300px; z-index: 101"
      elevation="10"
    >
      <Chatbox
        v-if="this.docs.doc1"
        :doc="this.docs.doc1"
        :index="1"
        v-on:closeChat="closeChatBox($event)"
        class="primary-box-shadown"
      />
    </v-card>
    <v-card
      style="position: fixed; right: 650px; bottom: 0px; height: auto; width: 300px; z-index: 101"
      elevation="10"
    >
      <Chatbox
        v-if="this.docs.doc2"
        :doc="this.docs.doc2"
        :index="2"
        v-on:closeChat="closeChatBox($event)"
        class="primary-box-shadown"
      />
    </v-card>
    <v-card
      style="position: fixed; right: 970px; bottom: 0px; height: auto; width: 300px; z-index: 101"
      elevation="10"
    >
      <Chatbox
        v-if="this.docs.doc3"
        :doc="this.docs.doc3"
        :index="3"
        v-on:closeChat="closeChatBox($event)"
        class="primary-box-shadown"
      />
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import ChatList from '@/components/vendor/overview/ChatList.vue';
import SlideBooking from '@/components/vendor/overview/SlideBooking.vue';
import Chatbox from '@/components/vendor/overview/Chatbox.vue';
import HostelGroupsOverview from '../../components/vendor/overview/HostelGroupsOverview.vue';

export default {
  name: 'Overview',
  components: {
    ChatList,
    SlideBooking,
    Chatbox,
    HostelGroupsOverview,
  },
  data: () => ({
    docList: [],
    docs: {
      doc1: null,
      doc2: null,
      doc3: null,
    },
    overlay: {
      show: false,
      doc: null,
    },
    showChatList: true,
  }),
  computed: {
    ...mapState('vendor/group', ['groups', 'types', 'rooms']),
    isLoading() {
      return (
        this.$store.state.vendor.group.groups.isLoading ||
        this.$store.state.vendor.group.types.isLoading ||
        this.$store.state.vendor.group.rooms.isLoading ||
        this.$store.state.user.user.isLoading
      );
    },
    user() {
      return this.$store.state.user.user.data;
    },
    isOnMobile() {
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
  methods: {
    ...mapActions({
      getGroups: 'vendor/group/getGroups',
      getTypes: 'vendor/group/getTypes',
      getRooms: 'vendor/group/getRooms',
      getUser: 'user/getUser',
    }),
    showMobileChatBox(event) {
      this.overlay.doc = event;
      this.overlay.show = true;
    },
    closeMobileChatBox() {
      this.overlay.doc = null;
      this.overlay.show = false;
    },
    showChatBox(event) {
      console.log(this.docs);
      if (this.isOnMobile) {
        this.showMobileChatBox(event);
        return;
      }
      // event is index of chatbox
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(this.docs)) {
        console.log(key);
        if (value === event) {
          return;
        }
        if (!value) {
          this.docs[key] = event;
          return;
        }
      }
      this.docs.doc3 = null;
      this.$nextTick(() => {
        this.docs.doc3 = event;
      });
    },
    closeChatBox(event) {
      console.log(typeof event);
      console.log(event);
      const { doc1, doc2, doc3 } = this.docs; // eslint-disable-line
      switch (event) {
        case 1:
          this.docs.doc1 = null;
          this.docs.doc2 = null;
          this.docs.doc3 = null;
          this.$nextTick(() => {
            this.docs.doc1 = doc2;
            this.docs.doc2 = doc3;
          });
          break;
        case 2:
          this.docs.doc2 = null;
          this.docs.doc3 = null;
          this.$nextTick(() => {
            this.docs.doc2 = doc3;
          });
          break;
        case 3:
          this.docs.doc3 = null;
          break;
        default:
          console.log('why it go in default slot?');
          break;
      }
    },
  },
  async created() {
    if (this.groups.data.length === 0) {
      this.getGroups().then(() => {
        this.getTypes().then(() => this.getRooms());
      });
    }
    if (!this.user) {
      this.getUser();
    }
  },
};
</script>
<style>
.div-title {
  color: #6c757d !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 1.025rem;
  font-weight: 700;
}
</style>
