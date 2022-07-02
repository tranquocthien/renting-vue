<template>
  <div style="height: calc(100vh - 72px); overflow-y: hidden;" class="d-flex flex-column">
    <v-dialog v-model="chatBox.show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <div
        style="height: 100vh; width: 100wv; overflow-y: hidden; background-color: #fff;"
        class="d-flex flex-column"
      >
        <ChatBox v-on:closeChat="closeChatBox" :doc="chatBox.doc" :height="'100%'" />
      </div>
    </v-dialog>
    <div v-if="!isLoading" style="height: 100%; overflow-y: hidden;" class="d-flex flex-column">
      <ChatList v-on:clickChat="showChatBox" :vendorId="user.userId" />
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

import ChatList from '../../components/vendor/overview/ChatList.vue';
import ChatBox from '../../components/vendor/overview/Chatbox.vue';

export default {
  name: 'MessageOnMobile',
  components: { ChatList, ChatBox },
  computed: {
    user() {
      return this.$store.state.user.user.data;
    },
    isLoading() {
      return (
        this.$store.state.vendor.group.groups.isLoading ||
        this.$store.state.vendor.group.types.isLoading ||
        this.$store.state.vendor.group.rooms.isLoading ||
        this.$store.state.user.user.isLoading
      );
    },
  },
  data: () => ({
    chatBox: {
      show: false,
      doc: null,
    },
  }),
  methods: {
    ...mapActions({
      getGroups: 'vendor/group/getGroups',
      getTypes: 'vendor/group/getTypes',
      getUser: 'user/getUser',
    }),
    showChatBox(doc) {
      this.chatBox.show = true;
      this.chatBox.doc = doc;
    },
    closeChatBox() {
      this.chatBox.show = false;
    },
  },
  async created() {
    this.getGroups().then(() => {
      this.getTypes();
    });
    this.getUser();
  },
};
</script>
