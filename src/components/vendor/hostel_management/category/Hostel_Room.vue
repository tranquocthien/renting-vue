<template>
  <v-row class="ma-0">
    <span
      class="font-nunito text-primary font-weight-bold size9rem mx-auto mt-3"
      style="width: 100%; text-align: center"
      >Phân loại nhóm các phòng có đặc điểm giống nhau</span
    >
    <v-row class="white my-5" :key="index" v-for="(item, index) in newGroupValue.types">
      <div
        class="d-flex align-center font-nunito text-primary font-weight-bold size9rem mx-6 mt-2"
        style="width: 100%"
      >
        Nhóm phòng thứ: {{ index + 1 }}
        <span class="font-nunito text-muted font-italic ml-2" v-if="groups.length > 0">
          (Bạn có thể lấy gợi ý các thông tin từ các nhóm phòng của các khu trọ mà bạn đã tạo từ
          trước)
        </span>
        <v-btn icon class="ml-auto"
          ><v-icon color="red" @click="(selectedDeleteTypeIndex = index), (warningDialog = true)"
            >mdi-delete-circle</v-icon
          ></v-btn
        >
      </div>
      <v-col cols="6" class="d-flex flex-column justify-center pl-5" v-if="groups.length > 0">
        <v-autocomplete
          v-model="newGroupValue.types[index].groupSelected"
          :items="groups"
          label="Chọn khu trọ"
          item-text="groupName"
          item-value="groupId"
          class="size9rem font-nunito light-autocomplete"
          dense
          outlined
          clearable
          color="#727cf5"
          hide-details
          background-color="#f1f3fa"
          no-data-text="Không có kết quả phù hợp"
          hide-selected
        >
          <template slot="selection" slot-scope="{ item }">
            <span class="font-nunito text-primary">{{ item.groupName }}</span>
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
      <v-col cols="6" class="d-flex flex-column justify-center pr-5" v-if="groups.length > 0">
        <v-autocomplete
          v-model="newGroupValue.types[index].typeSelected"
          :items="getTypesSuggess(newGroupValue.types[index].groupSelected)"
          label="Chọn nhóm phòng"
          item-text="title"
          item-value="typeId"
          class="text-gray size9rem font-weight-regular font-nunito light-autocomplete"
          outlined
          dense
          clearable
          color="#727cf5"
          hide-details
          background-color="#f1f3fa"
          no-data-text="Không có kết quả phù hợp"
          @change="suggestType(index)"
          :disabled="newGroupValue.types[index].groupSelected === -1"
        >
          <template slot="selection" slot-scope="{ item }">
            <span class="font-nunito text-gray">{{ item.title }}</span>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="9" class="py-0">
        <v-row class="ma-0">
          <v-col cols="4" class="d-flex flex-column pb-0">
            <span class="field-name font-weight-medium"
              >Tên nhóm phòng<span class="red--text ml-1">(*)</span></span
            >
            <v-text-field
              class="size-sub-2 font-nunito form"
              solo
              dense
              light
              hide-details
              v-model="newGroupValue.types[index].title"
              @input="setNewGroupValue(newGroupValue)"
            />
            <span class="font-nunito red--text size-caption" v-show="showMessage.typeName"
              >Vui lòng điền tên nhóm phòng!</span
            >
          </v-col>
          <v-col cols="2" class="d-flex flex-column pb-0">
            <span class="field-name font-weight-medium"
              >Giá thuê<span class="red--text ml-1">(*)</span></span
            >
            <v-text-field
              class="size-sub form font-nunito"
              type="number"
              color="#727cf5"
              solo
              dense
              light
              v-model="newGroupValue.types[index].price"
              :suffix="newGroupValue.types[index].priceUnit"
              step="0.1"
              min="0"
              :rules="[rules.minPrice(newGroupValue.types[index].price)]"
              @input="setNewGroupValue(newGroupValue)"
            />
          </v-col>
          <v-col cols="2" class="d-flex flex-column pb-0">
            <span class="field-name font-weight-medium"
              >Diện tích<span class="red--text ml-1">(*)</span></span
            >
            <v-text-field
              class="size-sub form font-nunito"
              type="number"
              color="#727cf5"
              solo
              dense
              light
              v-model="newGroupValue.types[index].superficiality"
              suffix="m2"
              step="5"
              min="0"
              :rules="[
                rules.min(newGroupValue.types[index].superficiality),
                rules.maxSuperficiality(newGroupValue.types[index].superficiality),
              ]"
              @input="setNewGroupValue(newGroupValue)"
            />
            <span class="font-nunito red--text size-caption" v-show="showMessage.superficiality"
              >Diện tích phải lớn hơn 0!</span
            >
          </v-col>
          <v-col cols="2" class="d-flex flex-column pb-0">
            <span class="field-name font-weight-medium"
              >Sức chứa<span class="red--text ml-1">(*)</span></span
            >
            <v-text-field
              class="size-sub form font-nunito"
              type="number"
              color="#727cf5"
              solo
              dense
              light
              v-model="newGroupValue.types[index].capacity"
              suffix="người"
              step="1"
              min="0"
              :rules="[
                rules.min(newGroupValue.types[index].capacity),
                rules.maxCapacity(newGroupValue.types[index].capacity),
              ]"
              @input="setNewGroupValue(newGroupValue)"
            />
            <span class="font-nunito red--text size-caption" v-show="showMessage.capacity"
              >Sức chứa phải lớn hơn 0!</span
            >
          </v-col>
          <v-col cols="2" class="d-flex flex-column pb-0">
            <span class="field-name font-weight-medium"
              >Cọc thế chân<span class="red--text ml-1">(*)</span></span
            >
            <v-text-field
              class="size-sub form font-nunito"
              type="number"
              color="#727cf5"
              solo
              dense
              light
              v-model="newGroupValue.types[index].deposit"
              suffix="tháng"
              step="1"
              min="0"
              :rules="[
                rules.minPrice(newGroupValue.types[index].deposit),
                rules.maxDeposit(newGroupValue.types[index].deposit),
              ]"
              @input="setNewGroupValue(newGroupValue)"
            />
          </v-col>
          <v-col cols="8" class="pt-0">
            <v-autocomplete
              v-model="newGroupValue.types[index].facilities"
              :items="facilities"
              item-text="facilityName"
              item-value="facilityName"
              dense
              chips
              small-chips
              label="Tiện ích"
              multiple
              outlined
              hide-details
              class="size9rem font-nunito light-autocomplete"
              @change="setNewGroupValue(newGroupValue)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="4" class="pt-0 d-flex">
            <div class="pa-0 d-flex flex-column justify-start">
              <v-text-field
                label="Tiện ích khác"
                v-model="newFacility"
                solo
                hide-details
                class="text-muted size-sub-2 light-text-field font-nunito"
                style="border-top-right-radius: 0px; border-bottom-right-radius: 0px"
              ></v-text-field>
              <span class="size-caption red--text font-nunito" v-show="isDuplicate"
                >Tiện ích đã tồn tại</span
              >
            </div>
            <v-btn
              class="btn-success btn-sm font-nunito white--text"
              @click="addNewFacility(index)"
              style="
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
              "
              >Bổ sung</v-btn
            >
          </v-col>
          <v-col cols="2" class="pr-0">
            <v-text-field
              class="size-sub light-autocomplete font-nunito"
              type="number"
              color="#727cf5"
              outlined
              label="Tổng phòng"
              dense
              light
              v-model="newGroupValue.types[index].totalRooms"
              step="1"
              :rules="[rules.min(newGroupValue.types[index].totalRooms)]"
              @input="
                (newGroupValue.types[index].emptyRooms = newGroupValue.types[index].totalRooms),
                  setNewGroupValue(newGroupValue)
              "
              style="
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
              "
            />
          </v-col>
          <v-col cols="2" class="px-0">
            <v-text-field
              class="size-sub light-autocomplete font-nunito"
              type="number"
              color="#727cf5"
              outlined
              label="Phòng trống"
              dense
              light
              v-model="newGroupValue.types[index].emptyRooms"
              step="1"
              :rules="[
                rules.min(newGroupValue.types[index].emptyRooms),
                rules.maxEmptyRooms(
                  newGroupValue.types[index].emptyRooms,
                  Number(newGroupValue.types[index].totalRooms),
                ),
              ]"
              @input="setNewGroupValue(newGroupValue)"
              style="border-radius: 0px !important"
            />
          </v-col>
          <v-col cols="3" class="px-0">
            <v-btn
              class="btn-success btn-sm font-nunito white--text"
              @click="initRooms(index)"
              style="
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
              "
              height="39"
              >Khởi tạo danh sách phòng</v-btn
            >
          </v-col>
          <v-col
            cols="5"
            class="mt-5"
            v-if="
              newGroupValue.types[index].totalRooms !== '' &&
              newGroupValue.types[index].emptyRooms !== '' &&
              newGroupValue.types[index].totalRooms > 0 &&
              newGroupValue.types[index].emptyRooms > 0 &&
              newGroupValue.types[index].emptyRooms <= newGroupValue.types[index].totalRooms &&
              newGroupValue.types[index].rooms.length === 0
            "
          >
            <span class="font-nunito red--text size-caption">
              Vui lòng khởi tạo danh sách phòng
            </span>
          </v-col>
          <v-col cols="1" class="pb-0" v-if="newGroupValue.types[index].rooms.length > 0"> </v-col>
          <v-col cols="3" class="pb-0" v-if="newGroupValue.types[index].rooms.length > 0">
            <v-select
              v-model="newGroupValue.types[index].displayRoomStatus"
              :items="displayRooms"
              label="Hiển thị"
              dense
              hide-details
              outlined
              class="size-sub-2 font-nunito light-autocomplete"
              @change="filterRoomStatus(index)"
              background-color="#f1f3fa"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="d-flex flex-column pb-0">
        <v-card outlined min-height="220" max-height="220">
          <v-col cols="12" class="d-flex flex-column px-5">
            <span class="field-name font-weight-medium">Hình ảnh</span>
            <v-row
              class="cursor ma-0 py-1"
              style="border: 2px dashed #dee2e6; border-radius: 6px"
              @click="openImageUploadDialog(index)"
            >
              <v-icon color="#98a6ad" class="ma-auto">mdi-file-image-outline</v-icon>
            </v-row>
            <v-row class="px-3 pt-2">
              <v-carousel
                cycle
                height="115"
                delimiter-icon="mdi-circle-medium"
                hide-delimiter-background
                show-arrows-on-hover
                v-if="newGroupValue.types[index].image.length !== 0"
                style="border: 1px solid #f1f3fa; border-radius: 6px; max-width: 220px !important"
              >
                <v-carousel-item
                  v-for="(image, i) in newGroupValue.types[index].image"
                  :key="i"
                  :src="image.resourceUrl"
                >
                </v-carousel-item>
              </v-carousel>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="newGroupValue.types[index].rooms.length > 0" class="pt-0 pb-10">
        <v-card
          class="overflow-y-auto px-2"
          min-height="100"
          max-height="270"
          style="box-shadow: none !important; border: thin solid rgba(0, 0, 0, 0.12)"
        >
          <v-row class="ma-0">
            <v-col cols="3" :key="i" v-for="(item, i) in newGroupValue.types[index].roomsDisplay">
              <v-card
                class="pt-4 pb-1 pl-2 pr-0 d-flex flex-column justify-center"
                style="border: 1px solid #e1e1e1"
                min-height="115"
              >
                <v-row class="d-flex align-start ma-0 pr-0">
                  <v-icon class="mr-2 mt-2">{{
                    item.available === 0 ? 'mdi-door-closed' : 'mdi-door-closed-lock'
                  }}</v-icon>
                  <div class="d-flex flex-column ml-2">
                    <v-text-field
                      class="size-sub-2 font-nunito form"
                      solo
                      label="Tên phòng"
                      dense
                      light
                      hide-details
                      v-model="newGroupValue.types[index].roomsDisplay[i].roomName"
                      @input="
                        (newGroupValue.types[index].rooms[getRoomIndex(index, i)].roomName =
                          newGroupValue.types[index].roomsDisplay[i].roomName),
                          setNewGroupValue(newGroupValue)
                      "
                    />
                    <span
                      class="red--text font-nunito size-caption"
                      v-if="isError(index) && isError(index).roomNullError.includes(i)"
                      >Tên phòng không nên để trống</span
                    >
                    <span
                      class="red--text font-nunito size-caption"
                      v-else-if="isError(index) && isError(index).roomDupplicateError.includes(i)"
                      >Tên phòng bị trùng</span
                    >
                  </div>
                </v-row>
                <v-row class="ma-0">
                  <v-radio-group
                    v-model="newGroupValue.types[index].roomsDisplay[i].available"
                    row
                    class="filter mt-0"
                    hide-details
                    @change="
                      (newGroupValue.types[index].rooms[getRoomIndex(index, i)].available =
                        newGroupValue.types[index].roomsDisplay[i].available),
                        setNewGroupValue(newGroupValue)
                    "
                  >
                    <v-radio label="Trống" class="radioGroup font-nunito" color="#727cf5"></v-radio>
                    <v-radio
                      label="Đang thuê"
                      class="radioGroup font-nunito"
                      color="#727cf5"
                    ></v-radio>
                  </v-radio-group>
                  <v-btn icon @click="removeItem(index, item.index)"
                    ><v-icon color="rgba(250, 92, 124, 0.5)"
                      >mdi-delete-circle-outline</v-icon
                    ></v-btn
                  >
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      class="mx-2"
      fab
      dark
      x-large
      color="purple"
      style="position: fixed; right: 20px; bottom: 80px; z-index: 1031"
      @click="addNewType()"
    >
      <span class="d-flex flex-column font-nunito size-sub-3">
        <span>Thêm</span>
        <span>nhóm</span>
        <span>phòng</span>
      </span>
    </v-btn>
    <v-dialog v-model="dialog.show" width="350">
      <v-card height="350" :loading="isFileUploading">
        <div class="d-flex flex-column align-center justify-center">
          <input
            type="file"
            multiple
            @change="onFileChange"
            ref="fileSelect"
            lang="vi"
            accept="image/*"
            class="ma-2"
          />
          <div class="d-flex flex-wrap" style="height: 250px; overflow-y: auto">
            <v-img
              v-for="url in upload.imageUrls"
              :key="url"
              :src="url"
              height="100"
              width="100"
              class="ma-1 elevation-2"
            ></v-img>
          </div>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" v-if="this.upload.imageUrls.length > 0" @click="uploadImages()">
            <v-icon>cloud_upload</v-icon> Tải lên
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="warningDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex flex-column justify-center px-8">
          <v-icon large class="material-icons-outlined" color="#ffbc00">report_problem</v-icon>
          <span
            class="text-gray font-nunito mt-1"
            v-if="newGroupValue.types.length > 1"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
            "
            >Bạn có chắc chắn muốn xóa nhóm này!</span
          >
          <span
            class="text-gray font-nunito mt-1"
            v-if="newGroupValue.types.length === 1"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
            "
            >Bạn nên phân loại ít nhất 1 nhóm phòng để quản lý các phòng trọ của khu mình!</span
          >
        </v-card-title>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            class="btn-warning mx-2"
            @click="removeType()"
            v-if="newGroupValue.types.length > 1"
          >
            Xóa
          </v-btn>
          <v-btn
            v-if="newGroupValue.types.length > 1"
            outlined
            class="mx-2"
            color="#ffbc00"
            @click="(selectedDeleteTypeIndex = -1), (warningDialog = false)"
          >
            Hủy
          </v-btn>
          <v-btn
            v-if="newGroupValue.types.length === 1"
            outlined
            class="mx-2"
            color="#ffbc00"
            @click="warningDialog = false"
          >
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import snackBarMixin from '../../../mixins/snackBar';
import fileMixins from '../../../mixins/file';

export default {
  name: 'Hostel_Room',
  mixins: [fileMixins, snackBarMixin],
  data: () => ({
    rules: {
      min(value) {
        return (value || 'Giá không hợp lệ') > 0 || 'Không hợp lệ';
      },
      minPrice(value) {
        return value >= 0 || 'Không hợp lệ';
      },
      maxSuperficiality(value) {
        return value <= 50 || 'Diện tích nên ít hơn 50 m2';
      },
      maxCapacity(value) {
        return value <= 20 || 'Sức chứa nên ít hơn 20 người';
      },
      maxDeposit(value) {
        return value <= 12 || 'Cọc thế chân nên ít hơn 1 năm';
      },
      maxEmptyRooms(value, maxValue) {
        return value <= maxValue || 'Không hợp lệ';
      },
    },
    showMessage: {
      typeName: false,
      superficiality: false,
      capacity: false,
      image: false,
    },
    searchFacilitiesQuery: [],
    newFacility: '',
    newFacilities: [],
    newFacilitiesSelectes: [],
    upload: {
      imageUrls: [],
    },
    images: [],
    dialog: {
      show: false,
      files: null,
    },
    warningDialog: false,
    facilities: [],
    selectedTypeIndex: -1,
    selectedTypeRoomIndex: -1,
    selectedDeleteTypeIndex: -1,
    displayRooms: ['Tất cả', 'Phòng trống', 'Đang thuê'],
  }),
  computed: {
    newGroupValue() {
      const newGroupData = this.$store.state.vendor.group.newGroup;
      if (newGroupData.types.length === 0) {
        newGroupData.types.push({
          groupSelected: -1,
          typeSelected: -1,
          title: '',
          price: 0,
          priceUnit: 'triệu',
          superficiality: '',
          deposit: 1,
          capacity: '',
          totalRooms: 0,
          emptyRooms: 0,
          rooms: [],
          image: [],
          facilities: [],
          displayRoomStatus: 'Tất cả',
          roomsDisplay: [],
        });
      }
      const error = [];
      newGroupData.types.forEach((type, i) => {
        const typeError = {
          index: i,
          capacity: false,
          deposit: false,
          price: false,
          rooms: false,
          roomNullError: [],
          roomDupplicateError: [],
          superficiality: false,
          title: false,
        };
        let flat = 0;
        if (type.title.trim() === '') {
          typeError.title = true;
          flat += 1;
        }
        if (type.capacity === 0 || type.capacity <= 0) {
          typeError.capacity = true;
          flat += 1;
        }
        if (type.deposit === '' || type.deposit < 0) {
          typeError.deposit = true;
          flat += 1;
        }
        if (type.superficiality === '' || type.superficiality <= 0) {
          typeError.superficiality = true;
          flat += 1;
        }
        if (type.price === '' || type.price < 0) {
          typeError.price = true;
          flat += 1;
        }
        if (type.rooms.length === 0) {
          typeError.rooms = true;
          flat += 1;
        } else {
          type.rooms.forEach((room, index) => {
            if (room.roomName.trim() === '') {
              flat += 1;
              typeError.roomNullError.push(index);
            } else if (
              type.rooms.filter(
                (r) => r.roomName.toLowerCase().trim() === room.roomName.toLowerCase(),
              ).length >= 2
            ) {
              flat += 1;
              typeError.roomDupplicateError.push(index);
            }
          });
        }
        if (flat > 0) {
          error.push(typeError);
        }
      });
      newGroupData.errorHostelRoom = error;
      return newGroupData;
    },
    isDuplicate() {
      let dupplicateExistRules = false;
      let dupplicateNewFacilities = false;
      if (this.facilities.length > 0) {
        dupplicateExistRules =
          this.facilities.filter(
            (f) => f.facilityName.trim().toLowerCase() === this.newFacility.trim().toLowerCase(), // eslint-disable-line
          ).length > 0;
      }
      if (this.newFacilities.length > 0) {
        dupplicateNewFacilities =
          this.newFacilities.filter(
            (n) => n.trim().toLowerCase() === this.newFacility.trim().toLowerCase(),
          ).length > 0;
      }
      return dupplicateExistRules || dupplicateNewFacilities;
    },
    newFacilitiesDisplay() {
      let facilities = this.newFacilities;
      if (this.searchFacilitiesQuery && this.searchFacilitiesQuery.trim() !== '') {
        facilities = facilities.filter((item2) => {
          const res =
            item2.toLowerCase().indexOf(this.searchFacilitiesQuery.trim().toLowerCase()) !== -1;
          return res;
        });
      }
      return [...facilities];
    },
    allFacilities() {
      return this.$store.state.renter.common.facilities.data;
    },
    newTypeValue() {
      return this.$store.state.vendor.group.createType.data;
    },
    groups() {
      const groupsData = this.$store.state.vendor.group.groups.data;
      return groupsData.filter((item) => item.types.length > 0);
    },
  },
  methods: {
    ...mapActions({
      getAllFacilities: 'renter/common/getAllFacilities1',
      setNewRoom: 'vendor/group/setNewRoom',
      setCreatRooms: 'vendor/group/setCreatRooms',
      setCreateTypeValue: 'vendor/group/setCreateTypeValue',
      insertListRooms: 'vendor/group/createRooms',
      createHostelType: 'vendor/group/createHostelType',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    getRoomIndex(typeIndex, roomIndex) {
      return this.newGroupValue.types[typeIndex].rooms.findIndex(
        (item) => this.newGroupValue.types[typeIndex].roomsDisplay[roomIndex].index === item.index,
      );
    },
    isError(typeIndex) {
      return this.newGroupValue.errorHostelRoom.find((item) => item.index === typeIndex);
    },
    addNewFacility(index) {
      if (!this.isDuplicate) {
        this.facilities.push({ facilityName: this.newFacility });
        this.newGroupValue.types[index].facilities.push(this.newFacility);
        this.newFacility = '';
        this.setNewGroupValue(this.newGroupValue);
      }
    },
    // upload
    openImageUploadDialog(index) {
      this.selectedTypeIndex = index;
      this.dialog.show = true;
      this.$nextTick(() => this.$refs.fileSelect.click());
    },
    onFileChange(e) {
      const { files } = e.target;
      this.files = files;
      this.upload.imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    },
    uploadImages() {
      const fd = new FormData();
      Array.from(this.files).forEach((file) => {
        fd.append('files', file, file.data);
      });
      this.uploadFile(fd)
        .then(() => {
          this.upload.imageUrls = this.listUploadedFiles;
          this.dialog.show = false;
          this.showSnackBar('Tải ảnh lên thành công', { color: 'green' });
          this.images = this.upload.imageUrls.map((image) => ({ resourceUrl: image }));
          this.newGroupValue.types[this.selectedTypeIndex].image = this.images;
          this.setNewGroupValue(this.newGroupValue);
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
    resetNewTypeValue() {
      return {
        capacity: '',
        deposit: '',
        displayRoomStatus: 'Tất cả',
        emptyRooms: 0,
        facilities: [],
        groupSelected: -1,
        image: [],
        price: '',
        priceUnit: 'triệu',
        rooms: [],
        roomsDisplay: [],
        superficiality: '',
        title: '',
        totalRooms: 0,
        typeSelected: -1,
      };
    },
    suggestType(index) {
      this.newGroupValue.types[index].facilities = [];
      this.newGroupValue.types[index].image = [];
      if (this.newGroupValue.types[index].typeSelected !== -1) {
        const type = this.getTypesSuggess(this.newGroupValue.types[index].groupSelected).find(
          (item) => item.typeId === this.newGroupValue.types[index].typeSelected,
        );
        console.log(type);
        this.newGroupValue.types[index].title = type.title;
        this.newGroupValue.types[index].price = type.price;
        this.newGroupValue.types[index].priceUnit = type.priceUnit;
        this.newGroupValue.types[index].superficiality = type.superficiality;
        this.newGroupValue.types[index].capacity = type.capacity;
        this.newGroupValue.types[index].deposit = type.deposit;
        this.newGroupValue.types[index].facilities = type.facilities.map((item) => ({
          facilityName: item.facilityName,
        }));
        this.newGroupValue.types[index].image = type.imageUrls;
      }
    },
    initRooms(index) {
      if (this.newGroupValue.types[index].totalRooms > 0) {
        this.newGroupValue.types[index].rooms = [];
        this.newGroupValue.types[index].roomsDisplay = [];
        for (let i = 0; i < this.newGroupValue.types[index].totalRooms; i += 1) {
          this.newGroupValue.types[index].rooms.push({
            index: this.newGroupValue.types[index].rooms[0]
              ? this.newGroupValue.types[index].rooms[ // eslint-disable-line
                  this.newGroupValue.types[index].rooms.length - 1 // eslint-disable-line
                ].index + 1 // eslint-disable-line
              : 0, // eslint-disable-line
            roomName: `${index + 1}-${i + 1}`,
            available: i < this.newGroupValue.types[index].emptyRooms ? 0 : 1,
          });
        }
        this.newGroupValue.types[index].roomsDisplay = this.newGroupValue.types[index].rooms;
        this.setNewGroupValue(this.newGroupValue);
      }
    },
    removeItem(typeIndex, roomIndex) {
      this.newGroupValue.types[typeIndex].roomsDisplay = this.newGroupValue.types[
        typeIndex
      ].roomsDisplay.filter((item) => item.index !== roomIndex);
      this.newGroupValue.types[typeIndex].rooms = this.newGroupValue.types[typeIndex].rooms.filter(
        (item) => item.index !== roomIndex,
      );
      this.setNewGroupValue(this.newGroupValue);
    },
    filterRoomStatus(index) {
      switch (this.newGroupValue.types[index].displayRoomStatus) {
        case 'Tất cả':
          this.newGroupValue.types[index].roomsDisplay = this.newGroupValue.types[index].rooms;
          break;
        case 'Phòng trống':
          this.newGroupValue.types[index].roomsDisplay = this.newGroupValue.types[
            index
          ].rooms.filter((item) => item.available === 0);
          break;
        case 'Đang thuê':
          this.newGroupValue.types[index].roomsDisplay = this.newGroupValue.types[
            index
          ].rooms.filter((item) => item.available === 1);
          break;
        default:
          break;
      }
    },
    addNewType() {
      this.newGroupValue.types.push({
        groupSelected: -1,
        typeSelected: -1,
        title: '',
        price: 0,
        priceUnit: 'triệu',
        superficiality: '',
        deposit: 1,
        capacity: '',
        totalRooms: 0,
        emptyRooms: 0,
        rooms: [],
        image: [],
        facilities: [],
        displayRoomStatus: 'Tất cả',
        roomsDisplay: [],
      });
    },
    getTypesSuggess(groupSelected) {
      if (groupSelected === -1) {
        return [];
      }
      const allTypes = this.groups.find((item) => item.groupId === groupSelected).types;
      return allTypes;
    },
    removeType() {
      this.newGroupValue.types = this.newGroupValue.types.filter(
        (_, index) => index !== this.selectedDeleteTypeIndex,
      );
      this.selectedDeleteTypeIndex = -1;
      this.setNewGroupValue(this.newGroupValue);
      this.warningDialog = false;
    },
  },
  created() {
    if (this.allFacilities.length === 0) {
      this.getAllFacilities().then(() => {
        this.facilities = this.allFacilities;
      });
    } else {
      this.facilities = this.allFacilities;
    }
  },
};
</script>

<style>
</style>
