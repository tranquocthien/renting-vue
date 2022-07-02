<template>
  <v-row justify="center">
    <v-dialog
      v-model="showCreateTypeDialog"
      scrollable
      max-width="1000"
      transition="dialog-bottom-transition"
      persistent
      hide-overlay
    >
      <v-card class="d-flex flex-column">
        <v-row class="d-flex px-4 py-3 align-center ma-0 justify-space-between bg-primary">
          <v-icon class="mr-1" color="rgb(255, 255, 255, 0.8)">room_preferences</v-icon>
          <span
            class="font-nunito white--text font-weight-bold"
            style="font-size: 1.125rem !important"
            >Thông tin loại phòng
          </span>
          <v-btn icon @click="closeCreateTypeDialog()" class="mr-4"
            ><v-icon size="20" color="rgb(255, 255, 255, 0.75)">close</v-icon></v-btn
          >
        </v-row>
        <v-divider></v-divider>
        <v-card-text class="py-0 d-flex" style="height: 500px">
          <v-row>
            <v-col cols="8">
              <v-row class="ma-0">
                <v-col cols="7" class="d-flex flex-column pb-0">
                  <span class="field-name font-weight-medium"
                    >Tên loại phòng<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field class="size-sub-2 font-nunito form" solo dense light hide-details />
                </v-col>
                <v-col cols="5" class="d-flex flex-column pb-0">
                  <span class="field-name font-weight-medium"
                    >Giá thuê<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub form font-nunito"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                    suffix="VNĐ"
                    step="100000"
                    min="0"
                  />
                </v-col>
                <v-col cols="4" class="d-flex flex-column pb-0">
                  <span class="field-name font-weight-medium"
                    >Diện tích<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub form font-nunito"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                    suffix="m2"
                    step="5"
                    min="0"
                  />
                  <span
                    class="font-nunito red--text size-caption"
                    v-show="showMessage.superficiality"
                    >Diện tích phải lớn hơn 0!</span
                  >
                </v-col>
                <v-col cols="4" class="d-flex flex-column pb-0">
                  <span class="field-name font-weight-medium"
                    >Sức chứa<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub form font-nunito"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                  />
                </v-col>
                <v-col cols="4" class="d-flex flex-column pb-0">
                  <span class="field-name font-weight-medium"
                    >Cọc thế chân<span class="text-danger ml-1">(*)</span></span
                  >
                  <v-text-field
                    class="size-sub form font-nunito"
                    type="number"
                    color="#727cf5"
                    solo
                    dense
                    light
                  />
                </v-col>
                <v-col cols="12" class="pt-1">
                  <div class="d-flex align-center">
                    <span class="field-name font-weight-medium">Tiện ích</span>
                    <v-col cols="6" class="ml-3 pa-0">
                      <v-text-field
                        label="Tìm nhanh theo tên tiện ích"
                        solo
                        hide-details
                        class="text-muted py-1 size-sub-2 light-text-field-small font-nunito"
                        clearable
                        rounded
                      ></v-text-field>
                    </v-col>
                  </div>
                  <div class="d-flex flex-wrap mt-3">
                    <FacilityItem
                      v-for="facility in newTypeValue.newFacilities"
                      v-bind:key="facility.index"
                      :facility="facility"
                    />
                  </div>
                  <v-card
                    class="overflow-y-auto mt-4 d-flex flex-wrap py-1"
                    max-height="150"
                    min-height="120"
                    outlined
                  >
                    <v-checkbox
                      v-model="newTypeValue.facilityIds"
                      v-for="item in facilities"
                      v-bind:key="item.facilityId"
                      :label="item.facilityName"
                      :value="item.facilityId"
                      hide-details
                      class="filter mt-2 ml-3 checkbox"
                      color="#727cf5"
                      @click="setCreateTypeValue(newTypeValue)"
                    ></v-checkbox>
                    <span
                      v-if="facilities.length === 0"
                      class="d-flex flex-column align-center ma-auto font-nunito text-primary"
                    >
                      <span
                        >Nếu phòng trọ của bạn có tiện ích không có sẵn trong danh sách gợi ý.</span
                      >
                      <span
                        >Hãy ấn nút <span style="color: #0acf97 !important">"Bổ sung"</span> để thêm
                        tiện ích mới</span
                      >
                    </span>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" class="d-flex flex-column pl-10">
              <v-card outlined min-height="390" max-height="400">
                <v-col cols="12" class="d-flex flex-column px-5">
                  <span class="field-name font-weight-medium">Hình ảnh</span>
                  <span class="font-nunito red--text size-caption" v-show="showMessage.image"
                    >Tải ít nhất một hình ảnh về phòng trọ của bạn!</span
                  >
                  <v-row
                    class="cursor ma-0 pa-5"
                    style="border: 2px dashed #dee2e6; border-radius: 6px"
                    @click="openImageUploadDialog"
                  >
                    <v-icon color="#98a6ad" large class="ma-auto">mdi-file-image-outline</v-icon>
                  </v-row>
                  <v-row>
                    <div class="d-flex flex-wrap align-center pa-2">
                      <div v-for="image in newTypeValue.image" :key="image.resourceUrl">
                        <v-img
                          :src="image.resourceUrl"
                          :lazy-src="image.resourceUrl"
                          aspect-ratio="1"
                          class="ma-2 white type-image d-flex justify-center align-center"
                          min-width="6rem"
                          max-width="6rem"
                          max-height="4rem"
                          min-height="4rem"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                          <div class="d-flex justify-center align-center">
                            <v-icon color="rbg(0,0,0,0.8)" class="cursor"
                              >mdi-delete-forever</v-icon
                            >
                          </div>
                        </v-img>
                      </div>
                    </div>
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
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end pa-4">
          <v-btn class="btn btn-light elevation-0 font-nunito" @click="closeCreateTypeDialog()">
            <span v-if="!showCreateTypeDialog">Quay lại</span>
            <span v-if="showCreateTypeDialog">Hủy</span>
          </v-btn>
          <v-btn class="btn btn-primary font-nunito" @click="insertNewType()">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import RoomItem from './RoomItem.vue';
import FacilityItem from './FacilityItem.vue';
import alert from '../../../core_layout/alert.vue';
import snackBarMixin from '../../../mixins/snackBar';
import fileMixins from '../../../mixins/file';

export default {
  name: 'TypeDetail',
  mixins: [fileMixins, snackBarMixin],
  data: () => ({
    typeIdNull: false,
    roomNameNull: false,
    searchFacilitiesQuery: '',
    rules: {
      minPrice(value) {
        return (value || 'Giá không hợp lệ') > 0 || 'Không hợp lệ';
      },
      min(value) {
        return (value || 'Giá không hợp lệ') >= 0 || 'Không hợp lệ';
      },
    },
    dialog: {
      show: false,
      files: null,
    },
    upload: {
      imageUrls: [],
    },
    images: [],
    alert: {
      type: '',
      showAlert: false,
      action: '',
    },
    showMessage: {
      typeName: false,
      superficiality: false,
      capacity: false,
      image: false,
    },
    isNotValidate: false,
    openCreateType: false,
  }),
  props: { show: Boolean, group: Object, showCreateType: Boolean },
  components: { FacilityItem },
  computed: {
    showCreateTypeDialog() {
      if (this.show === null) {
        return this.show === null && this.showCreateType;
      }
      return this.openCreateType;
    },
  },
  methods: {
    ...mapActions({}),
    closeCreateTypeDialog() {
      if (this.show === null) {
        this.$emit('close');
      } else {
        this.openCreateType = false;
      }
      this.resetType();
    },
    getPriceUnit(price) {
      let typePriceUnit = null;
      let typePrice = 0;
      if (String(price).length <= 6) {
        typePrice = price / 1000;
        typePriceUnit = 'nghìn';
      } else if (String(price).length < 10) {
        typePrice = price / 1000000;
        typePriceUnit = 'triệu';
      } else {
        typePriceUnit = 'tỉ';
        typePrice = price / 1000000000;
      }
      return { typePrice, typePriceUnit };
    },
    openCreateTypeDialog() {
      this.openCreateType = true;
    },
  },
  created() {},
};
</script>

<style>
/* .light-select.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #e9ecef !important;
} */
.light-select .v-application .primary--text {
  color: #727cf5 !important;
  caret-color: #727cf5 !important;
}
.light-text-field-small .v-input__slot {
  border: 0px solid #dee2e6 !important;
  background-color: #f1f3fa !important;
}
.light-text-field-small .theme--light.v-icon {
  color: #6c757d !important;
}
.light-text-field-small.v-text-field.v-text-field--solo .v-input__control {
  min-height: 30px;
}
.light-text-field-small .v-icon.v-icon {
  font-size: 20px !important;
}
.light-text-field-small .theme--light.v-label {
  color: #98a6ad !important;
  font-family: 'Nunito', sans-serif !important;
}
.type-image {
  height: 4rem !important;
  width: 6rem !important;
  border-radius: 0.25rem !important;
  border: 1px thin #727cf5 !important;
}
</style>
