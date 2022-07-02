<template>
  <v-row no-gutters class="d-flex justify-center ma-0 pa-0">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-container v-if="!isLoading" class="pa-0">
      <v-row justify="center" class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" lg="12" xl="11">
          <v-row class="d-flex align-center ma-0">
            <span class="page-title">Quản lý phòng trọ của</span>
            <v-col cols="5" class="d-flex mx-5 flex-column justify-center">
              <v-autocomplete
                v-model="groupSelected"
                :items="groups"
                label="Nhà trọ"
                item-text="groupName"
                item-value="groupId"
                class="size9rem font-nunito light-autocomplete"
                solo
                dense
                color="#727cf5"
                hide-details
                background-color="#f1f3fa"
                no-data-text="Không có kết quả phù hợp"
                @change="resetSelectTypes()"
              >
                <template slot="selection" slot-scope="{ item }">
                  <span class="font-nunito text-primary font-weight-600">{{ item.groupName }}</span>
                </template>
                <template slot="item" slot-scope="{ item }">
                  <span class="d-flex flex-column mb-3">
                    <span class="font-nunito size9rem text-primary-dark">{{ item.groupName }}</span>
                    <span class="font-nunito size-sub-3 text-gray"
                      >{{ item.buildingNo }}, {{ item.address.streetName }},
                      {{ item.address.districtName }} , {{ item.address.provinceName }}</span
                    >
                  </span>
                </template></v-autocomplete
              >
            </v-col>
            <v-btn class="mx-5 px-10 btn-success btn-sm font-nunito" to="groups"
              >Quản lý các khu trọ</v-btn
            >
          </v-row>
        </v-col>
        <v-col cols="6" md="4" xl="4">
          <v-card>
            <v-row class="ma-0 px-2 py-3">
              <v-col cols="8">
                <v-text-field
                  label="Loại phòng..."
                  v-model="search.type"
                  append-icon="search"
                  solo
                  hide-details
                  class="text-muted pa-0 size-sub-2 slide-booking icon-gray"
                ></v-text-field>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <v-btn
                  class="btn-warning btn-sm font-nunito white--text"
                  @click="(showTypeManagementdialog = true), (showCreateRoomDialog = null)"
                  ><v-icon small class="mr-1">mdi mdi-plus</v-icon>Thêm loại</v-btn
                >
              </v-col>
              <v-col cols="12" md="12" class="pt-2 pb-0" v-if="types && types.length < 6">
                <v-row class="ma-0 px-1" style="background-color: #f1f3fa; border-color: #eef2f7">
                  <v-col cols="2">
                    <v-checkbox
                      v-model="checkbox.allTypes"
                      color="#727cf5"
                      hide-details
                      class="filter my-0 py-0 px-2 checkbox-small"
                      @click="selectAllTypes()"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="7" class="pa-0 d-flex align-center">
                    <span class="font-nunito text-gray size9rem font-weight-600">Loại phòng</span>
                  </v-col>
                  <v-col cols="3" class="pa-0 d-flex align-center justify-center">
                    <span class="font-nunito text-gray size9rem font-weight-600">Giá</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" class="pt-2 pb-0" v-if="types && types.length >= 6">
                <v-row
                  class="ma-0 py-2 pl-1 pr-4"
                  style="background-color: #f1f3fa; border-color: #eef2f7"
                >
                  <v-col cols="2">
                    <v-checkbox
                      v-model="checkbox.allTypes"
                      color="#727cf5"
                      hide-details
                      class="filter my-0 py-0 checkbox-small"
                      @click="selectAllTypes()"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="7" class="pa-0 d-flex align-center">
                    <span class="font-nunito text-gray size9rem font-weight-600">Tên</span>
                  </v-col>
                  <v-col cols="3" class="py-0 d-flex align-center justify-center px-2">
                    <span class="font-nunito text-gray size9rem font-weight-600">Giá</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" class="pt-0">
                <v-card
                  class="overflow-y-auto d-flex flex-column py-1"
                  max-height="250"
                  min-height="250"
                  outlined
                  v-if="types && types.length > 0"
                  style="
                    border: 0px !important;
                    border-top-left-radius: 0 !important;
                    border-top-right-radius: 0 !important;
                  "
                >
                  <div
                    class="ma-0 d-flex flex-column"
                    v-for="item in types"
                    v-bind:key="item.typeId"
                  >
                    <v-menu open-on-hover top offset-y nudge-width="100px">
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          class="d-flex px-1 service-item cursor"
                          style="border: 1px solid #eef2f7; border-top: 0px !important"
                        >
                          <v-col cols="2">
                            <v-checkbox
                              v-model="checkbox.types"
                              color="#727cf5"
                              :value="item.typeId"
                              hide-details
                              class="filter my-0 py-0 px-2 checkbox-small"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="7" class="d-flex align-center" v-bind="attrs" v-on="on">
                            <span class="font-nunito size9rem">{{ item.title }}</span>
                          </v-col>
                          <v-col
                            cols="3"
                            class="pa-0 d-flex flex-column align-center justify-center px-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <span class="font-nunito badge badge-info-lighten"
                              >{{ item.price }} {{ item.priceUnit }}</span
                            >
                          </v-col>
                        </div>
                      </template>
                      <v-list>
                        <v-list-item
                          style="min-height: 20px !important"
                          class="py-2 pl-3 pr-10 d-flex align-center cursor item-menu"
                        >
                          <v-icon color="#6c757d" class="mr-2 item-hover" size="15"
                            >mdi-door-open</v-icon
                          >
                          <v-list-item-title class="text-primary-hover"
                            >Thông tin loại phòng</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          style="min-height: 20px !important"
                          class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
                        >
                          <v-icon color="#6c757d" class="mr-2 item-hover" size="15"
                            >mdi mdi-pencil</v-icon
                          >
                          <v-list-item-title class="text-primary-sucess-hover"
                            >Chỉnh sửa</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          style="min-height: 20px !important"
                          class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor text-primary-danger-hover"
                        >
                          <v-icon color="#6c757d" class="mr-2 item-hover" size="15"
                            >mdi mdi-delete</v-icon
                          >
                          <v-list-item-title class="text-primary-danger-hover"
                            >Xóa</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="7" md="8" xl="8">
          <v-card>
            <v-row class="ma-0 px-2 py-3">
              <v-col cols="4">
                <v-text-field
                  label="Phòng trọ..."
                  v-model="search.room"
                  append-icon="search"
                  solo
                  hide-details
                  class="text-muted pa-0 size-sub-2 slide-booking icon-gray"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <v-select
                  v-model="roomStatus.selected"
                  :items="roomStatus.items"
                  dense
                  color="#727cf5"
                  hide-details
                  solo
                  class="size-sub-2 font-nunito slide-booking"
                ></v-select>
              </v-col>
              <v-col cols="5" class="d-flex justify-end">
                <v-btn
                  class="btn-danger btn-sm font-nunito white--text"
                  @click="(showTypeManagementdialog = false), (showCreateRoomDialog = true)"
                  ><v-icon small class="mr-1">mdi mdi-plus</v-icon>Thêm phòng</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
          <v-row class="d-flex flex-wrap">
            <roomItem
              v-for="item in rooms"
              v-bind:key="item.roomId"
              :room="item"
              :type="getTypeById(item.typeObj)"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <TypeManagementDialog
      :show="showCreateRoomDialog"
      :showCreateType="showTypeManagementdialog"
      @close="closeTypeManagementDialog()"
      :group="group"
    />
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import roomItem from '../../components/vendor/hostel_management/room_management/roomItem.vue';
import TypeManagementDialog from '../../components/vendor/hostel_management/type_management/TypesManagement.vue';

export default {
  name: 'RoomManagement',
  components: { roomItem, TypeManagementDialog },
  data: () => ({
    groupSelected: '',
    search: {
      type: '',
      room: '',
    },
    checkbox: {
      allTypes: true,
      types: [],
    },
    roomStatus: {
      items: ['Phòng trống', 'Đang thuê', 'Tất cả'],
      selected: 'Tất cả',
    },
    showTypeManagementdialog: false,
    showCreateRoomDialog: false,
  }),
  computed: {
    groups() {
      return this.$store.state.vendor.group.groups.data;
    },
    groupIdInput() {
      return Number(this.$route.query.hostel);
    },
    group() {
      return this.groups.find((item) => item.groupId === this.groupSelected);
    },
    types() {
      const allTypes = this.groups.find((item) => item.groupId === this.groupSelected);
      if (allTypes) {
        if (this.search.type.trim() !== '' && allTypes.types.length > 0) {
          return allTypes.types.filter((item2) => {
            const res =
              item2.title.toLowerCase().indexOf(this.search.type.trim().toLowerCase()) !== -1;
            return res;
          });
        }
        return allTypes.types;
      }
      return null;
    },
    rooms() {
      let allRooms = [];
      this.checkbox.types.forEach((typeId) => {
        allRooms = allRooms.concat(
          this.types
            .find((type) => type.typeId === typeId)
            .rooms.map((room) => ({ roomObj: room, typeObj: typeId })),
        );
      });
      switch (this.roomStatus.selected) {
        case 'Tất cả':
          break;
        case 'Đang thuê':
          allRooms = allRooms.filter((item) => !item.roomObj.available);
          break;
        case 'Phòng trống':
          allRooms = allRooms.filter((item) => item.roomObj.available);
          break;
        default:
          break;
      }
      if (this.search.room.trim() !== '' && allRooms.length > 0) {
        return allRooms.filter((item2) => {
          const res =
            item2.roomObj.roomName.toLowerCase().indexOf(this.search.room.trim().toLowerCase()) !==
            -1;
          return res;
        });
      }
      return allRooms;
    },
    allTypes() {
      return this.$store.state.vendor.group.types.data;
    },
    isLoading() {
      const groups = this.$store.state.vendor.group.groups.isLoading;
      const types = this.$store.state.vendor.group.types.isLoading;
      const rooms = this.$store.state.vendor.group.rooms.isLoading;
      return groups || types || rooms;
    },
  },
  methods: {
    ...mapActions({
      getGroups: 'vendor/group/getGroups',
      getTypes: 'vendor/group/getTypes',
      getRooms: 'vendor/group/getRooms',
    }),
    closeDialog() {
      this.$emit('close');
    },
    closeTypeManagementDialog() {
      this.showTypeManagementdialog = false;
      this.showCreateRoomDialog = false;
    },
    getTypeById(typeId) {
      return this.types.find((type) => type.typeId === typeId);
    },
    selectAllTypes() {
      const typeIds = [];
      if (this.checkbox.allTypes) {
        this.types.forEach((item) => typeIds.push(item.typeId));
      }
      this.checkbox.types = typeIds;
    },
    resetSelectTypes() {
      this.checkbox.allTypes = false;
      this.checkbox.types = [];
      if (this.types.length > 0) {
        this.checkbox.allTypes = true;
        this.selectAllTypes();
      }
    },
  },
  async created() {
    if (this.groups.length === 0) {
      this.getGroups().then(() => {
        this.getTypes().then(() => {
          this.getRooms().then(() => {
            if (this.groups.length > 0) {
              if (this.groupIdInput) {
                this.groupSelected = this.groupIdInput;
              } else {
                this.groupSelected = this.groups[0].groupId;
              }
              this.selectAllTypes();
            }
          });
        });
      });
    } else if (this.groupIdInput) {
      this.groupSelected = this.groupIdInput;
    } else {
      this.groupSelected = this.groups[0].groupId;
    }
  },
};
</script>

<style>
.light-select.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #e9ecef !important;
}
.light-select .v-application .primary--text {
  color: #727cf5 !important;
  caret-color: #727cf5 !important;
}
.light-autocomplete .v-input__slot {
  border: 1px solid #fff !important;
}
.light-autocomplete.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: #e9ecef;
}
.checkbox-small .v-icon.v-icon {
  font-size: 1.25rem !important;
  border-radius: 0.25rem !important;
}
.icon-gray .v-icon.v-icon {
  font-size: 18px !important;
  color: #98a6ad !important;
}
</style>
<style scoped>
.v-application a:hover {
  color: #fff !important;
}
</style>
