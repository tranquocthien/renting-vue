<template>
  <div
    v-if="!isLoadingRenterList || !isLoadingUser"
    class="d-flex flex-column"
    style="height: 100%; background: #fff; border-left: 1px solid #dedede"
  >
    <div class="d-flex flex-column px-4 py-3">
      <v-tabs color="#727cf5" height="35" background-color="#EEF2F7" v-model="tab">
        <v-tab class="size-caption text-capitalize font-nunito font-weight-bold">Tất cả</v-tab>
        <v-tab class="size-caption text-capitalize font-nunito font-weight-bold">Trả giá</v-tab>
        <v-tab class="size-caption text-capitalize font-nunito font-weight-bold">Đặt lịch</v-tab>
      </v-tabs>
      <v-text-field
        label="Tìm kiếm"
        v-model="searchQuery"
        append-icon="search"
        solo
        hide-details
        class="mt-3 text-muted pa-0 size-sub-2 chat"
        height="35"
        rounded
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div style="height: 100%; overflow-y: auto; min-width: 310px">
      <vue-scroll>
        <v-list two-line nav avatar class="rounded-0 pa-0">
          <v-list-item-group color="primary">
            <v-list-item
              dense
              v-for="item in resultQuery"
              :key="item.id"
              @click="$emit('clickChat', getDocRef(item.id))"
              class="ma-0 rounded-0"
              style="border-bottom: 1px solid #dedede"
            >
              <v-list-item-avatar
                color="#727cf5"
                max-height="35"
                max-width="35"
                min-height="35"
                min-width="35"
                class="d-flex align-center justify-center"
              >
                <v-img
                  max-height="35"
                  max-width="35"
                  min-height="35"
                  min-width="35"
                  v-if="getUserById(item.renterId).avatar"
                  :src="getUserById(item.renterId).avatar"
                ></v-img>
                <!-- <v-icon v-else>face</v-icon> -->
                <span v-else class="text-overline white--text">{{
                  getAvatarTitle(getUserById(item.renterId).username)
                }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <span class="font-nunito text-gray-black size-sub-2 font-weight-bold">{{
                  getUserById(item.renterId).username
                }}</span>
                <p>
                  <span
                    class="badge-danger-lighten size-caption float-right text-right"
                    v-if="item.lastedMessage.bargain"
                    ><v-icon x-small color="#fa5c7c">mdi-arrow-down</v-icon>
                    {{ item.lastedMessage.bargain.newPrice }} triệu</span
                  >
                  <span
                    class="badge-success-lighten size-sub-caption pa-1 float-right text-right"
                    v-if="item.lastedMessage.book"
                  >
                    {{ item.lastedMessage.book.date }}, {{ item.lastedMessage.book.time }}</span
                  >
                  <span v-if="getType(item.typeId)" class="text-gray size-sub-3 mr-1">{{
                    getType(item.typeId).title || 'Phòng đã bị xoá'
                  }}</span>
                  <span v-if="!getType(item.typeId)" class="text-gray size-sub-3 mr-1"
                    >Phòng đã bị xoá</span
                  >
                </p>
                <p
                  v-bind:class="{
                    'font-weight-bold': !item.lastedMessage.seen,
                  }"
                  class="size-caption mt-1"
                  style="color: #727cf5"
                >
                  {{ item.lastedMessage.message }}
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import firebase from '../../../config/firebase';

const { store } = firebase;
const chatCollectionRef = store.collection('chat');

export default {
  name: 'ChatList',
  props: {
    chatShow: Boolean,
    itemSelected: Object,
    vendorId: String,
  },
  data() {
    return {
      items: [],
      dialogAccept: false,
      dialogDeny: false,
      docRefs: [],
      docs: [],
      renterIds: [],
      searchQuery: '',
      idList: [],
      tab: 0,
    };
  },
  computed: {
    ...mapGetters({
      getUserById: 'vendor/overview/getUserById',
    }),
    docsHasMessage() {
      return this.docs;
    },
    listDealChange() {
      return this.items.filter((items) => {
        if (items.bargain) {
          return true;
        }
        return false;
      });
    },
    listMessageChange() {
      return this.items.filter((items) => {
        if (!items.bargain && !items.book) {
          return true;
        }
        return false;
      });
    },
    user() {
      return this.$store.state.user.user.data;
    },
    isLoadingUser() {
      return this.$store.state.user.user.isLoading;
    },
    renterList() {
      return this.$store.state.vendor.overview.usersChatList.data;
    },
    isLoadingRenterList() {
      return this.$store.state.vendor.overview.usersChatList.isLoadings;
    },
    chatListHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '400px';
        case 'sm':
          return '400px';
        case 'md':
          return '400px';
        case 'lg':
          return '400px';
        case 'xl':
          return '700px';
        default:
          return null;
      }
    },
    resultQuery() {
      console.log(this.docs);
      console.log(this.tab);
      let listChat = this.docs;
      switch (this.tab) {
        case 0:
          listChat = this.docs;
          break;
        case 1:
          listChat = this.docs.filter((msg) => msg.lastedMessage.bargain);
          break;
        case 2:
          listChat = this.docs.filter((msg) => msg.lastedMessage.book);
          break;
        default:
          listChat = this.docs;
          break;
      }
      if (this.searchQuery) {
        const idList = this.renterList
          .filter(
            (item1) => item1.username.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1,
          )
          .map((item2) => item2.userId);
        return listChat
          .filter((item) => idList.includes(item.renterId))
          .filter((item2) => item2.lastedMessage);
      }
      return listChat.filter((item) => item.lastedMessage);
    },
    types() {
      return this.$store.state.vendor.group.types.data;
    },
  },
  methods: {
    myOnScroll() {},
    ...mapActions({
      getUserByIds: 'vendor/overview/getUserByIds',
      addUserToListById: 'vendor/overview/addUserToListById',
      getOneBooking: 'user/getOneBooking',
    }),
    ...mapGetters({
      findTypesById: 'vendor/group/findTypesById',
    }),
    acceptMessage() {
      // this.visible = true;
      this.dialogAccept = false;
      store.collection('chat').add({
        renter: false,
        message: 'Chấp nhận trả giá của bạn',
        bargain: true,
        booking: false,
        createdAt: new Date(),
      });

      // this.$nextTick(() => this.scrollToBottom());
      // this.visible = false;
    },
    getDocRef(id) {
      const res = this.docRefs[id];
      // console.log(res);
      return res;
    },
    denyMessage() {
      // this.visible = true;
      this.dialogDeny = false;
      store.collection('chat').add({
        renter: false,
        message: 'Từ chối trả giá của bạn',
        bargain: true,
        booking: false,
        createdAt: new Date(),
      });
      this.$nextTick(() => this.scrollToBottom());
      // this.visible = false;
    },
    getItemSelected() {
      // this.itemSelected = selectedItem;
      // this.chatShow = true;
    },
    async getLastedMessage(docRef) {
      // const docId = `renter-${renterId}:vendor-${vendorId}:type-${typeId}`;
      let message = null;
      await docRef.ref
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot((querySnapshot) => {
          let result = null;
          querySnapshot.forEach((doc) => {
            result = { id: doc.id, ...doc.data() };
          });
          message = result;
        });
      // console.log(message);
      return message;
    },
    async fetchNewBooking(doc) {
      if (doc.data.book) {
        this.getOneBooking(doc.data.book.bookingId);
      }
    },
    async fetchConversations() {
      await chatCollectionRef
        .where('vendorId', '==', this.vendorId)
        .orderBy('lastedMessage.createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          this.docRefs = {};
          this.docs = [];
          this.renterIds = [];
          querySnapshot.docs.map(async (doc) => {
            this.fetchNewBooking(doc);
            this.docRefs[doc.id] = doc;
            this.docs.push({ ...doc.data(), id: doc.id });
            this.renterIds.push(doc.data().renterId);
          });
          this.getUserByIds(this.renterIds);
        });
      await this.docRefs.forEach((docRef, index) => {
        docRef.ref
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .onSnapshot((querySnapshot) => {
            let result = null;
            querySnapshot.forEach((doc) => {
              result = { id: doc.id, ...doc.data() };
            });
            this.lastedMessages[index] = result;
          });
      });
    },
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    getType(id) {
      const result = this.types.filter((type) => type.typeId === id);
      if (result.length > 0) {
        return result[0];
      }
      return null;
    },
  },
  created() {
    this.fetchConversations();
  },
};
</script>
<style>
.text-color {
  color: #0022d5;
  font-size: 18px;
}
.chat.v-text-field.v-text-field--solo .v-input__control {
  min-height: 25px !important;
  padding: 0;
}
.chat .theme--light.v-label {
  color: #98a6ad !important;
  font-family: 'Nunito', sans-serif !important;
}
.chat .theme--light.v-icon {
  color: #98a6ad !important;
}
.v-application p {
  margin-bottom: 0 !important;
}
</style>
