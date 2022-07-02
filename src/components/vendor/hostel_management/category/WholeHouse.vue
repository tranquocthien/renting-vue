<template>
  <v-row>
    <v-col cols="9">
      <v-row class="ma-0">
        <v-col cols="4" class="d-flex py-0">
          <v-row class="ma-0">
            <span class="d-flex flex-column font-nunito text-primary size9rem font-weight-bold">
              <span>Diện tích</span>
              <span>nhà nguyên căn<span class="red--text ml-1 font-weight-medium">(*)</span>:</span>
            </span>
            <v-col cols="6" class="d-flex flex-column pa-0 ml-auto">
              <v-text-field
                class="size-sub form font-nunito"
                type="number"
                color="#727cf5"
                solo
                dense
                light
                v-model="newTypeValue.superficiality"
                suffix="m2"
                step="5"
                min="0"
                :rules="[
                  rules.min(newTypeValue.superficiality),
                  rules.maxSuperficiality(newTypeValue.superficiality),
                ]"
                @input="setCreateTypeValue(newTypeValue)"
              />
              <span class="font-nunito red--text size-caption" v-show="showMessage.superficiality"
                >Diện tích phải lớn hơn 0!</span
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="d-flex py-0">
          <v-row class="ma-0">
            <span class="field-name font-weight-medium mt-4 ml-auto"
              >Giá thuê<span class="red--text ml-1">(*)</span>:</span
            >
            <v-col cols="7" class="d-flex flex-column pa-0 ml-auto">
              <v-text-field
                class="size-sub form font-nunito"
                type="number"
                color="#727cf5"
                solo
                dense
                light
                v-model="newTypeValue.price"
                :suffix="newTypeValue.priceUnit"
                step="0.1"
                min="0"
                :rules="[rules.minPrice(newTypeValue.price)]"
                @input="setCreateTypeValue(newTypeValue)"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="d-flex py-0">
          <v-row class="ma-0">
            <span class="field-name font-weight-medium mt-4 ml-auto"
              >Cọc thế chân<span class="red--text ml-1">(*)</span>:</span
            >
            <v-col cols="6" class="d-flex flex-column pa-0 ml-auto">
              <v-text-field
                class="size-sub form font-nunito"
                type="number"
                color="#727cf5"
                solo
                dense
                light
                v-model="newTypeValue.deposit"
                suffix="tháng"
                step="1"
                min="0"
                :rules="[
                  rules.minPrice(newTypeValue.deposit),
                  rules.maxDeposit(newTypeValue.deposit),
                ]"
                @input="setCreateTypeValue(newTypeValue)"
              />
              <span class="font-nunito red--text size-caption" v-show="showMessage.capacity"
                >Số lượng người phải lớn hơn 0!</span
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="pt-5">
          <div class="d-flex align-start">
            <span class="field-name font-weight-medium mt-2">Tiện ích</span>
            <v-col cols="5" class="ml-3 pa-0 d-flex flex-column justify-start">
              <v-text-field
                label="Tên tiện ích"
                v-model="searchFacilitiesQuery"
                solo
                hide-details
                prepend-inner-icon="search"
                class="text-muted size-sub-2 light-text-field font-nunito"
                clearable
                rounded
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="3" class="pa-0 d-flex flex-column justify-start">
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
            </v-col>
            <v-btn
              class="btn-success btn-sm font-nunito white--text"
              @click="addNewFacility()"
              style="
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
              "
              >Bổ sung</v-btn
            >
          </div>
          <v-card
            class="overflow-y-auto mt-4 d-flex flex-wrap py-1"
            max-height="150"
            min-height="120"
            outlined
          >
            <v-col
              cols="3"
              v-for="item in newFacilitiesDisplay"
              :key="item"
              class="pa-0 ma-0 d-flex align-center"
            >
              <v-checkbox
                v-model="newFacilitiesSelectes"
                v-bind:key="item"
                :label="item"
                :value="item"
                hide-details
                class="filter mt-2 ml-3 checkbox"
                color="#727cf5"
                @click="setCreateTypeValue(newTypeValue)"
              ></v-checkbox>
            </v-col>
            <v-col
              cols="3"
              v-for="item in facilities"
              :key="item.facilityId"
              class="pa-0 ma-0 d-flex align-center"
            >
              <v-checkbox
                v-model="newTypeValue.facilityIds"
                v-bind:key="item.facilityId"
                :label="item.facilityName"
                :value="item.facilityId"
                hide-details
                class="filter mt-2 ml-3 checkbox"
                color="#727cf5"
                @click="setCreateTypeValue(newTypeValue)"
              ></v-checkbox>
            </v-col>
            <span
              v-if="facilities.length === 0 && newFacilitiesDisplay.length === 0"
              class="d-flex flex-column align-center ma-auto font-nunito text-primary"
            >
              <span>Nếu phòng trọ của bạn có tiện ích không có sẵn trong danh sách gợi ý.</span>
              <span
                >Hãy điền tiện ích khác và ấn nút
                <span style="color: #0acf97 !important">"Bổ sung"</span> để thêm tiện ích mới</span
              >
            </span>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="3" class="d-flex flex-column">
      <v-card outlined min-height="260" max-height="260">
        <v-col cols="12" class="d-flex flex-column px-5">
          <span class="field-name font-weight-medium">Hình ảnh</span>
          <span class="font-nunito red--text size-caption" v-show="showMessage.image"
            >Tải ít nhất một hình ảnh về phòng trọ của bạn!</span
          >
          <v-row
            class="cursor ma-0 py-2"
            style="border: 2px dashed #dee2e6; border-radius: 6px"
            @click="openImageUploadDialog"
          >
            <v-icon color="#98a6ad" large class="ma-auto">mdi-file-image-outline</v-icon>
          </v-row>
          <v-row class="px-3 pt-2">
            <v-carousel
              cycle
              height="140"
              delimiter-icon="mdi-circle-medium"
              hide-delimiter-background
              show-arrows-on-hover
              v-if="newTypeValue.image.length !== 0"
              style="border: 1px solid #f1f3fa; border-radius: 6px"
            >
              <v-carousel-item
                v-for="(image, i) in newTypeValue.image"
                :key="i"
                :src="image.resourceUrl"
              >
                <v-hover v-slot="{ hover }">
                  <div style="height: 100%; width: 100%">
                    <v-expand-transition>
                      <v-icon
                        size="25"
                        color="#fff"
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out cursor"
                        style="
                          height: 100%;
                          width: 100%;
                          position: absolute;
                          top: 0;
                          background-color: rgba(0, 0, 0, 0.45);
                          border-radius: 6px;
                        "
                        @click="removeImage(i)"
                      >
                        mdi-delete-forever
                      </v-icon>
                    </v-expand-transition>
                  </div>
                </v-hover>
              </v-carousel-item>
            </v-carousel>
          </v-row>
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
                <v-btn
                  color="primary"
                  v-if="this.upload.imageUrls.length > 0"
                  @click="uploadImages"
                >
                  <v-icon>cloud_upload</v-icon> Tải lên
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-card>
    </v-col>
    <v-col cols="12" class="pa-0"> </v-col>
    <v-col cols="12" class="pa-0">
      <v-row class="d-flex flex-wrap ma-0">
        <v-col cols="4" :key="index" v-for="(item, index) in newGroupValue.types">
          <v-row class="ma-0">
            <v-col cols="12" class="d-flex pb-0">
              <v-row class="ma-0">
                <span class="font-nunito text-primary size9rem font-weight-bold mt-auto"
                  >Loại phòng<span class="red--text ml-1 font-weight-medium">(*)</span>:</span
                >
                <v-col cols="8" class="d-flex flex-column pa-0 ml-auto">
                  <v-select
                    v-model="newGroupValue.types[index].title"
                    @change="setNewGroupValue(newGroupValue)"
                    :items="typeNames"
                    label="Chọn loại phòng"
                    dense
                    hide-details
                    solo
                    class="size-sub-2 font-nunito form"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="d-flex">
              <v-row class="ma-0">
                <span class="field-name mt-4"
                  >Số lượng<span class="red--text ml-1 font-weight-medium">(*)</span>:</span
                >
                <v-col cols="8" class="d-flex pa-0 ml-auto">
                  <v-text-field
                    class="size-sub form font-nunito"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                    v-model="newGroupValue.types[index].roomsNumber"
                    step="1"
                    min="0"
                    :rules="[rules.min(newGroupValue.types[index].roomsNumber)]"
                    @input="setNewGroupValue(newGroupValue)"
                  />
                  <v-btn
                    class="btn btn-outline-primary elevation-0 font-nunito ml-2"
                    @click="removeType(index)"
                    >Xóa phòng</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-btn
      class="mx-2 hidden-sm-and-down"
      fab
      dark
      large
      color="purple"
      style="position: fixed; right: 20px; bottom: 80px; z-index: 1031"
      @click="addNewType()"
    >
      <span class="font-weight-bold">+</span><v-icon dark>mdi-door-closed</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import snackBarMixin from '../../../mixins/snackBar';
import fileMixins from '../../../mixins/file';

export default {
  name: 'WholeHouse',
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
        return value <= 200 || 'Diện tích nên ít hơn 200 m2';
      },
      maxCapacity(value) {
        return value <= 20 || 'Sức chứa nên ít hơn 20 người';
      },
      maxDeposit(value) {
        return value <= 24 || 'Cọc thế chân nên ít hơn 2 năm';
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
    searchFacilitiesQuery: '',
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
    typeNames: [
      'Phòng ngủ',
      'Phòng bếp',
      'Phòng khách',
      'Nhà vệ sinh',
      'Tầng trệt',
      'Loại phòng khác',
    ],
    types: [],
  }),
  computed: {
    newGroupValue() {
      const newGroupData = this.$store.state.vendor.group.newGroup;
      console.log(newGroupData.types.length);
      if (newGroupData.types.length === 0) {
        newGroupData.types.push({
          title: 'Phòng ngủ',
          roomsNumber: 0,
        });
        newGroupData.types.push({
          title: 'Nhà vệ sinh',
          roomsNumber: 0,
        });
      }
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
    facilities() {
      if (this.searchFacilitiesQuery && this.searchFacilitiesQuery.trim() !== '') {
        return this.allFacilities.filter((item2) => {
          const res =
            item2.facilityName
              .toLowerCase()
              .indexOf(this.searchFacilitiesQuery.trim().toLowerCase()) !== -1;
          return res;
        });
      }
      return this.allFacilities;
    },
    newTypeValue() {
      const newType = this.$store.state.vendor.group.createType.data;
      newType.priceUnit = 'triệu';
      return newType;
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
    addNewFacility() {
      if (this.newFacilities && !this.isDuplicate) {
        console.log(this.newFacilitiesSelectes);
        this.newFacilities.unshift(this.newFacility);
        this.newFacilitiesSelectes.push(this.newFacility);
        this.newFacility = '';
        this.newTypeValue = [];
        this.newTypeValue = this.newFacilitiesSelectes;
        this.setCreateTypeValue(this.newTypeValue);
      }
    },
    // upload
    openImageUploadDialog() {
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
          this.newTypeValue.image = this.images;
          this.setCreateTypeValue(this.newTypeValue);
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
    suggestType() {
      const type = this.types.find((item) => item.typeId === this.typeSelected);
      const typeFacilityIds = [];
      type.facilities.forEach((item) => typeFacilityIds.push(item.facilityId));
      if (type) {
        this.newTypeValue.capacity = type.capacity;
        this.newTypeValue.deposit = type.deposit;
        this.newTypeValue.facilityIds = typeFacilityIds;
        this.newTypeValue.price = type.price;
        this.newTypeValue.priceUnit = type.priceUnit;
        this.newTypeValue.rooms = [];
        this.newTypeValue.superficiality = type.superficiality;
        this.newTypeValue.title = type.title;
        this.newTypeValue.image = type.imageUrls.map((image) => ({
          resourceUrl: image.resourceUrl,
        }));
        this.setCreateTypeValue(this.newTypeValue);
      }
    },
    removeImage(index) {
      this.newTypeValue.image = this.newTypeValue.image.filter(
        (item) => item !== this.newTypeValue.image[index],
      );
      this.setCreateTypeValue(this.newTypeValue);
    },
    addNewType() {
      this.newGroupValue.types.push({
        title: '',
        roomsNumber: 0,
      });
    },
    removeType(index) {
      this.newGroupValue.types = this.newGroupValue.types.filter((_, i) => i !== index);
    },
  },
};
</script>

<style>
</style>
