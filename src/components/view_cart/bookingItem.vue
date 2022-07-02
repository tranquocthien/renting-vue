<template>
  <v-card class="mb-2">
    <v-row no-gutters justify="center">
      <v-dialog v-model="detailDialog" scrollable max-width="500">
        <v-card>
          <div class="d-flex py-3 align-center px-4">
            <div>
              <span
                class="font-nunito text-primary dialog-title d-flex"
                style="font-size: 1.125rem !important"
                >{{ mapDateCode(timestamp.getDay()) }}, {{ timestamp.getDate() }}-{{
                  timestamp.getMonth() + 1
                }}-{{ timestamp.getFullYear() }}
              </span>
              <span style="font-size: 0.9rem !important" class="d-flex align-center">
                <v-icon size="10" color="#8891f7" class="mr-2">fiber_manual_record</v-icon
                ><span style="color: #8891f7"
                  >{{ timestamp.getHours() }}:{{ padZero(timestamp.getMinutes())
                  }}{{ timestamp.getMinutes() }}</span
                >
              </span>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="detailDialog = false"><v-icon small>close</v-icon></v-btn>
          </div>

          <v-divider></v-divider>
          <v-card-text style="height: 300px">
            <v-row class="d-flex align-center px-4 ma-0">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Nhà trọ:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span
                  class="font-nunito title-content cursor text-primary-hover"
                  @click="getGroup()"
                  >{{ booking.group.groupName }}</span
                ></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Số điện thoại:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span class="font-nunito title-content"><a :href="`tel:${booking.vendor.phone}`">{{ booking.vendor.phone }}</a></span></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Địa chỉ:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span @click="mapDialog = true" class="font-nunito title-content address"
                  >{{ booking.group.buildingNo }} {{ booking.group.address.streetName }},
                  {{ booking.group.address.wardName }}, {{ booking.group.address.districtName }},
                  {{ booking.group.address.provinceName }}</span
                ></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0 pt-3">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Chủ trọ:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span class="font-nunito title-content text-primary-hover cursor">{{
                  booking.vendor.username
                }}</span></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Số điện thoại:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span class="font-nunito title-content"><a :href="`tel:${booking.vendor.phone}`">{{ booking.vendor.phone }}</a></span></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0 pt-3">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Loại phòng:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0"
                ><span
                  class="font-nunito title-content text-primary-hover cursor"
                  @click="getType()"
                  >{{ booking.type.title }}</span
                ></v-col
              >
            </v-row>
            <v-row class="d-flex align-center px-4 ma-0">
              <v-col md="3" class="px-0 pb-0"
                ><span class="text-muted font-nunito font-weight-bold title-content"
                  >Giá thuê:</span
                ></v-col
              >
              <v-col md="9" class="px-0 pb-0 d-flex align-center">
                <span
                  class="amber--text font-nunito title-content d-flex align-center"
                  v-if="booking.deal"
                >
                  <span class="text-decoration-line-through">
                    {{ booking.type.price }} {{ booking.type.priceUnit }}</span
                  >
                  <span class="ml-3"
                    >{{ booking.deal.offeredPrice }} {{ booking.type.priceUnit }}</span
                  >
                  <small class="font-italic black--text ml-3" v-if="booking.deal">
                    (đã trả giá)</small
                  >
                </span>
                <span class="amber--text font-nunito title-content" v-if="!booking.deal">
                  {{ booking.type.price }} {{ booking.type.priceUnit }}
                </span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-start pa-4">
            <v-btn class="btn btn-danger font-nunito"> Báo cáo </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="btn btn-light elevation-0 font-nunito" @click="detailDialog = false">
              Đóng
            </v-btn>
            <v-btn
              class="btn btn-primary font-nunito"
              v-if="booking.status === 'DONE'"
              @click="feedbackDialog = true"
            >
              Đánh giá phòng trọ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog.show" width="350">
        <v-card height="350" :loading="isFileUploading">
          <div class="d-flex flex-column align-center justify-center">
            <input
              type="file"
              @change="onFileChange"
              ref="fileSelect"
              multiple
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
            <v-btn color="primary" v-if="this.upload.imageUrls.length > 0" @click="uploadImages">
              <v-icon>cloud_upload</v-icon> Tải lên
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="feedbackDialog"
        max-width="80%"
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card>
          <v-row class="d-flex px-4 py-3 align-center justify-space-between ma-0">
            <span class="font-nunito text-gray dialog-title" style="font-size: 1.125rem !important"
              >Đánh giá phòng trọ
            </span>
            <v-btn icon @click="feedbackDialog = false"
              ><v-icon small color="#6c757d">close</v-icon></v-btn
            >
          </v-row>

          <v-divider></v-divider>
          <v-card-text style="height: 400px" class="py-0">
            <v-row class="ma-0 d-flex justify-space-between">
              <v-col cols="12" md="5" class="pb-0">
                <v-row>
                  <v-col cols="3" class="d-flex flex-column justify-start">
                    <span class="text-gray size9rem font-nunito">Nhà trọ:</span>
                  </v-col>
                  <v-col cols="9" class="d-flex flex-column justify-start">
                    <span class="size9rem font-nunito">{{ booking.group.groupName }}</span>
                    <span class="size9rem font-nunito text-muted size-caption"
                      >{{ booking.group.buildingNo }} {{ booking.group.address.streetName }},
                      {{ booking.group.address.wardName }},
                      {{ booking.group.address.districtName }},
                      {{ booking.group.address.provinceName }}</span
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" class="d-flex flex-column justify-start">
                    <span class="text-gray size9rem font-nunito">Phòng trọ:</span>
                  </v-col>
                  <v-col cols="9" class="d-flex flex-column justify-start">
                    <span
                      class="size9rem font-nunito text-primary-hover cursor"
                      @click="getType()"
                      >{{ booking.type.title }}</span
                    >
                    <span class="size9rem font-nunito text-price"
                      >{{ booking.deal ? booking.deal.offeredPrice : booking.type.price }}
                      {{ booking.type.priceUnit }}</span
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" class="d-flex flex-column justify-start">
                    <span class="text-gray size9rem font-nunito">Chủ trọ:</span>
                  </v-col>
                  <v-col cols="9" class="d-flex flex-column justify-start">
                    <span class="size9rem font-nunito">{{ booking.vendor.username }}</span>
                    <span class="size9rem font-nunito text-muted">{{ booking.vendor.phone }}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-row>
                  <v-col cols="12" class="d-flex flex-column align-center">
                    <span class="text-primary font-weight-bold size9rem font-nunito">ĐÁNH GIÁ</span>
                  </v-col>
                  <v-col cols="12" class="d-flex flex-column align-center pt-0">
                    <v-rating
                      v-model="rating"
                      background-color="#ced4da"
                      color="#fd7e14"
                      large
                      hover
                    ></v-rating>
                    <span class="size-caption font-nunito text-danger" v-if="mesage">{{
                      mesage
                    }}</span>
                  </v-col>
                  <v-col cols="12" class="d-flex flex-column pb-0 justify-center">
                    <v-textarea
                      solo
                      label="Viết nhận xét của bạn ở đây"
                      v-model="comment"
                      class="font-nunito size9rem text-muted feedback yellow"
                      height="120"
                      hide-details
                    ></v-textarea>
                    <div class="bg-light d-flex flex-wrap align-center pa-2">
                      <v-btn icon @click="openImageUploadDialog" depressed>
                        <v-icon>mdi-file-image</v-icon></v-btn
                      >
                      <v-spacer></v-spacer>
                      <div v-for="image in images" :key="image.resourceUrl">
                        <v-badge
                          bordered
                          color="rgba(250, 92, 124, 0.5)"
                          icon="mdi-close"
                          overlap
                          class="d-flex justify-center align-center"
                          offset-x="20"
                          offset-y="20"
                        >
                          <v-img
                            :src="image.resourceUrl"
                            :lazy-src="image.resourceUrl"
                            aspect-ratio="1"
                            class="ma-2 white image-feedback"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                                ></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                        </v-badge>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-start pa-4">
            <v-spacer></v-spacer>
            <v-btn class="btn btn-light elevation-0 font-nunito" @click="feedbackDialog = false">
              Đóng
            </v-btn>
            <v-btn
              class="btn btn-primary font-nunito"
              v-if="booking.status === 'DONE'"
              @click="sendFeedback()"
              :loading="isCreateFeedback"
            >
              Gửi
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="mapDialog" scrollable max-width="900" min-width="500">
        <v-card>
          <div class="d-flex py-3 align-center px-4">
            <div>
              <span
                class="font-nunito text-primary dialog-title d-flex"
                style="font-size: 1.125rem !important"
                ><v-icon size="20" color="#727cf5" class="mr-2">mdi-home-map-marker</v-icon
                >{{ booking.group.groupName }}
              </span>
              <span class="font-nunito text-gray d-flex" style="font-size: 0.9rem !important"
                ><v-icon size="20" color="green" class="mr-2">mdi-google-maps</v-icon
                >{{ booking.group.buildingNo }} {{ booking.group.address.streetName }},
                {{ booking.group.address.wardName }}, {{ booking.group.address.districtName }},
                {{ booking.group.address.provinceName }}
              </span>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="mapDialog = false"><v-icon>close</v-icon></v-btn>
          </div>
          <v-divider></v-divider>
          <v-row style="height: 400px" class="ma-0 white">
            <v-col cols="9" class="d-flex flex-column justify-center" style="border: 1px solid red">
              <GoogleMapsDirection
                :dest="{ lat: booking.group.latitude, lng: booking.group.longitude }"
              />
            </v-col>
            <v-col cols="3" class="d-flex flex-column">
              <span
                class="font-nunito text-muted d-flex align-center cursor mt-3"
                style="font-size: 0.875rem"
                @click="openStreetMap()"
                ><v-icon color="#33cc33" small class="mr-1">mdi-map</v-icon>Xem trên Google
                Map</span
              >
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row no-gutters class="d-flex justify-center cursor" @click="detailDialog = true">
      <v-col
        cols="7"
        sm="3"
        md="3"
        class="d-flex flex-column justify-center align-center py-4 px-2"
      >
        <span class="font-nunito group-name px-4 py-2">{{ booking.group.groupName }}</span>
        <span class="text-primary font-nunito mt-2"
          ><v-icon color="#727cf5" class="mr-2" small>mdi-phone-forward</v-icon
          >{{ booking.vendor.phone }}</span
        >
      </v-col>
      <v-col
        cols="4"
        sm="2"
        md="2"
        class="d-flex align-start align-sm-center align-md-center align-lg-center py-4 px-2"
      >
        <v-col cols="12" class="d-flex flex-column align-start justify-center px-0">
          <span class="text-danger font-nunito"
            >{{ timestamp.getDate() }}-{{ timestamp.getMonth() + 1 }}-{{
              timestamp.getFullYear()
            }}</span
          >
          <span class="text-muted font-nunito"
            >{{ timestamp.getHours() }}:{{ padZero(timestamp.getMinutes())
            }}{{ timestamp.getMinutes() }}</span
          >
        </v-col>
      </v-col>
      <v-col cols="12" sm="7" md="7" class="d-flex py-4 px-4">
        <v-col cols="12" class="d-flex flex-column align-start">
          <span class="text-primary-dark font-nunito type-name">{{ booking.type.title }}</span>
          <span class="my-2">
            <v-icon color="#727cf5">mdi-home-currency-usd</v-icon>
            <span class="amber--text text-decoration-line-through font-nunito" v-if="booking.deal">
              {{ booking.type.price }} {{ booking.type.priceUnit }}
            </span>
            <span class="amber--text font-nunito" v-if="!booking.deal">
              {{ booking.type.price }} {{ booking.type.priceUnit }}
            </span>
            <span class="amber--text font-nunito" v-if="booking.deal">
              {{ booking.deal.offeredPrice }} {{ booking.type.priceUnit }}
            </span>
            <small class="font-italic" v-if="booking.deal"> (đã trả giá)</small>
          </span>
          <small class="font-nunito"
            ><v-icon color="#727cf5">mdi-google-maps</v-icon>{{ booking.group.buildingNo }}
            {{ booking.group.address.streetName }}, {{ booking.group.address.wardName }},
            {{ booking.group.address.districtName }},
            {{ booking.group.address.provinceName }}</small
          >
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>
<style scoped></style>
<script>
import { mapActions } from 'vuex';
import GoogleMapsDirection from './GoogleMapsDirection.vue';
import fileMixins from '../mixins/file';
import snackBarMixin from '../mixins/snackBar';

export default {
  name: 'BookingItem',
  props: ['booking'],
  components: { GoogleMapsDirection },
  mixins: [fileMixins, snackBarMixin],
  data: () => ({
    detailDialog: false,
    feedbackDialog: false,
    feedbackTabs: {
      index: 1,
    },
    rating: 0,
    comment: null,
    mapDialog: false,
    dialog: {
      show: false,
      files: null,
    },
    upload: {
      imageUrls: [],
    },
    images: [],
  }),
  computed: {
    timestamp() {
      return new Date(this.booking.meetTime);
    },
    group() {
      return this.booking.group;
    },
    mesage() {
      if (this.rating > 0) {
        return null;
      }
      return 'Đừng quên đánh sao nhé!';
    },
    isCreateFeedback() {
      return this.$store.state.user.feedback.isLoading;
    },
    renter() {
      return this.$store.state.user.user.data;
    },
  },
  methods: {
    ...mapActions({
      getProvinces: 'renter/common/getProvinces',
      createFeedback: 'user/sendFeedback',
    }),
    padZero(int) {
      return int < 10 ? '0' : '';
    },
    getAvatarTitle() {
      return this.booking.group.groupName
        .substring(this.group.groupName.lastIndexOf(' ') + 1)
        .substring(0, 1);
    },
    mapDateCode(code) {
      let day;
      switch (code) {
        case 0:
          day = 'Chủ nhật';
          break;
        case 1:
          day = 'Thứ 2';
          break;
        case 2:
          day = 'Thứ 3';
          break;
        case 3:
          day = 'Thứ 4';
          break;
        case 4:
          day = 'Thứ 5';
          break;
        case 5:
          day = 'Thứ 6';
          break;
        default:
          day = 'Thứ 7';
          break;
      }
      return day;
    },
    getGroup() {
      this.$router.push(`/group/${this.booking.group.groupId}`);
    },
    getType() {
      this.$router.push(`/detail/${this.booking.type.typeId}`);
    },
    openStreetMap() {
      const lat = this.booking.group.latitude;
      const long = this.booking.group.longitude;
      const url = `https://www.google.com/maps/search/${lat},${long}/@${lat},${long},17z?hl=vi`;
      window.open(url, '_blank');
    },
    // image
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
          this.images = this.upload.imageUrls.map((image) => ({ resourceUrl: image }));
          this.dialog.show = false;
          this.showSnackBar('Tải ảnh lên thành công', { color: 'green' });
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
    removeImage(url) {
      if (url) {
        return this.upload.imageUrls.filter((imgUrl) => imgUrl !== url);
      }
      return this.upload.imageUrls;
    },
    sendFeedback() {
      if (this.rating > 0) {
        const feedbackObj = {
          renterId: this.renter.userId,
          typeId: this.booking.type.typeId,
          rating: this.rating,
          comment: this.comment,
          images: this.images,
        };
        this.createFeedback(feedbackObj).then(() => this.getType());
      }
    },
  },
  watch: {
    // upload: {
    //   handler() {
    //     this.$emit('newValues', this.upload.imageUrls);
    //   },
    //   deep: true,
    // },
    dialog(val) {
      return val || this.close();
    },
    dialogDelete(val) {
      return val || this.closeDelete();
    },
  },
  created() {},
};
</script>
<style scoped>
.group-name {
  color: #6c757d !important;
  font-weight: 600 !important;
  font-size: 0.9rem;
  text-align: center;
  background-color: #f0f4f9;
  border-radius: 2rem !important;
}
.group-name:hover {
  color: #fff !important;
  background-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  cursor: pointer;
}
.type-name {
  color: #727cf5 !important;
}
.type-name:hover {
  color: #4250f2 !important;
  cursor: pointer;
}
.address {
  color: #6c757d !important;
}
.address:hover {
  color: #33cc33 !important;
  cursor: pointer;
}
.v-list-item__title {
  color: #6c757d;
  font-family: 'Nunito', sans-serif !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
}
.v-menu__content {
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #e4eaf2 !important;
  border-radius: 0.25rem !important;
  color: #6c757d !important;
}
.item-menu:hover {
  background-color: #f8f9fa;
}
.item-hover:hover {
  color: #272e37 !important;
}
.dialog-title {
  font-weight: 700 !important;
}
.title-content {
  font-size: 0.9rem !important;
}
</style>
<style>
.feedback .v-tabs-bar {
  height: 40px;
  border-bottom: 2px solid rgba(152, 166, 173, 0.2);
}
.feedback .v-input__slot {
  margin-bottom: 0px !important;
}
.feedback .v-input__control {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.image-feedback {
  height: 3rem !important;
  width: 3rem !important;
  border-radius: 0.25rem !important;
}
</style>
