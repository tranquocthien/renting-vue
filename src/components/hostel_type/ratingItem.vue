<template>
  <!-- eslint-disable max-len -->
  <div class="d-flex align-center" style="border-bottom: 1px dashed rgba(0, 0, 0, 0.1)">
    <v-dialog v-model="imageDialog" max-width="80%" v-if="feedback.feedbackImages">
      <v-card>
        <v-carousel
          :continuous="false"
          hide-delimiter-background
          delimiter-icon="mdi-minus"
          cycle
          height="500"
        >
          <v-carousel-item
            v-for="(slide, i) in feedback.feedbackImages"
            :key="i"
            :src="slide.resourceUrl"
            reverse-transition="fade-transition"
            transition="fade-transition"
            aspect-ratio="1.7"
            contain
          >
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
    <v-dialog v-model="warningDialog" max-width="400">
      <v-card class="py-4">
        <v-card-title class="d-flex flex-column justify-center">
          <v-icon large class="material-icons-outlined" color="#ffbc00">report_problem</v-icon>
          <span
            class="text-gray font-nunito mt-3"
            style="
              font-size: 1.125rem !important;
              text-align: center !important;
              font-weight: 700 !important;
            "
            >Bạn chắc chắn muốn xóa đánh giá này?</span
          >
        </v-card-title>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn class="btn-warning px-5 font-nunito" @click="removeFeedback(feedback.feedbackId)">
            Xóa
          </v-btn>
          <v-btn color="#ffbc00" class="px-4 font-nunito" outlined @click="warningDialog = false">
            Hủy
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
      max-width="500"
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card>
        <v-row class="d-flex px-4 py-3 align-center justify-space-between ma-0">
          <span class="font-nunito text-gray dialog-title" style="font-size: 1.125rem !important"
            >Chỉnh sửa đánh giá
          </span>
          <v-btn icon @click="feedbackDialog = false"
            ><v-icon small color="#6c757d">close</v-icon></v-btn
          >
        </v-row>

        <v-divider></v-divider>
        <v-card-text style="height: 400px" class="py-0">
          <v-row class="ma-0 d-flex justify-space-between">
            <v-col cols="12" class="pb-0">
              <v-row>
                <v-col cols="12" class="d-flex flex-column align-center">
                  <span class="text-primary font-weight-bold size9rem font-nunito">ĐÁNH GIÁ</span>
                </v-col>
                <v-col cols="12" class="d-flex flex-column align-center pt-0">
                  <v-rating
                    v-model="feedbackValue.rating"
                    background-color="#ced4da"
                    color="#fd7e14"
                    large
                    hover
                  ></v-rating>
                </v-col>
                <v-col cols="12" class="d-flex flex-column pb-0 justify-center">
                  <v-textarea
                    solo
                    label="Viết nhận xét của bạn ở đây"
                    v-model="feedbackValue.comment"
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
            @click="editFeedback()"
            :loading="isCreateFeedback"
          >
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-avatar max-height="30" max-width="30" min-width="30" min-height="30" color="#727cf5">
      <v-img
        max-height="30"
        max-width="30"
        min-width="30"
        min-height="30"
        :src="feedback.renter.avatar"
        v-if="feedback.renter.avatar"
      />
      <span v-else class="text-overline white--text">{{ getAvatarTitle(user.username) }}</span>
    </v-avatar>
    <v-row class="ml-5 d-flex flex-column ma-0">
      <div class="d-flex">
        <v-rating
          color="yellow darken-3"
          background-color="grey darken-1"
          small
          readonly
          class="pa-0 rating"
          :value="feedback.rating"
        ></v-rating>
        <v-spacer></v-spacer>
        <v-menu bottom left v-if="renter && renter.userId === feedback.renter.userId">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon color="#adb5bd" small>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              style="min-height: 20px !important"
              class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
              @click="feedbackDialog = true"
            >
              <v-icon color="#6c757d" class="mr-2 item-hover" size="15">mdi mdi-pencil</v-icon>
              <v-list-item-title class="item-hover">Chỉnh sửa</v-list-item-title>
            </v-list-item>
            <v-list-item
              style="min-height: 20px !important"
              class="py-2 pl-3 pr-10 item-hover d-flex align-center cursor item-menu"
              @click="warningDialog = true"
            >
              <v-icon color="#6c757d" class="mr-2 item-hover" size="15">mdi mdi-delete</v-icon>
              <v-list-item-title class="item-hover">Xóa</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <span>
        <span class="font-nunito font-weight-bold size-sub-2 text-primary"
          >{{ feedback.renter.username }}<span v-if="feedback.comment">:</span></span
        >
        <span class="font-nunito size-sub-2 ml-1">{{ feedback.comment }}</span>
      </span>
      <div class="d-flex flex-wrap align-center">
        <div v-for="image in feedback.feedbackImages" :key="image.resourceUrl">
          <v-img
            :src="image.resourceUrl"
            :lazy-src="image.resourceUrl"
            aspect-ratio="1"
            class="ma-2 white image-feedback cursor"
            @click="imageDialog = true"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </div>
      </div>
      <span class="text-caption font-nunito text-gray"
        >{{ getDateFormat(feedback.createdAt)
        }}<span class="text-muted">
          - Đã xem phòng vào: {{ getDateFormat(feedback.bookingTimestamp) }}</span
        ></span
      >
    </v-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import fileMixins from '../mixins/file';
import snackBarMixin from '../mixins/snackBar';

export default {
  name: 'RatingItem',
  mixins: [fileMixins, snackBarMixin],
  data: () => ({
    rate: 4,
    imageDialog: false,
    warningDialog: false,
    feedbackDialog: false,
    feedbackValue: {
      rating: 0,
      comment: '',
    },
    dialog: {
      show: false,
      files: null,
    },
    upload: {
      imageUrls: [],
    },
    images: [],
  }),
  props: { feedback: Object },
  methods: {
    ...mapActions({
      deleteFeedback: 'user/deleteFeedback',
      updateFeedback: 'user/updateFeedback',
      setFeedbacks: 'renter/hostelType/setFeedbacks',
    }),
    getAvatarTitle(name) {
      return name.substring(name.lastIndexOf(' ') + 1).substring(0, 1);
    },
    getDateFormat(createdTime) {
      const date = new Date(createdTime).toLocaleDateString('vi-vn');
      const time = new Date(createdTime).toLocaleTimeString('vi-vn').substr(0, 5);
      return `${date}, ${time}`;
    },
    removeFeedback(id) {
      this.deleteFeedback(id).then(() => {
        if (this.deleteStatus) {
          this.setFeedbacks(this.resetFeedbacks(id));
        } else {
          console.log(this.$store.state.user.feedback.console.error);
        }
        this.warningDialog = false;
      });
    },
    editFeedback() {
      const feedbackObj = {
        feedbackId: this.feedback.feedbackId,
        rating: this.feedbackValue.rating,
        comment: this.feedbackValue.comment,
        images: this.images,
      };
      console.log(feedbackObj);
      this.updateFeedback(feedbackObj).then(() => {
        this.feedbackDialog = false;
      });
    },
    resetFeedbacks(id) {
      console.log(this.allFeedbacks.filter((feedback) => feedback.feedbackId !== id));
      return this.allFeedbacks.filter((feedback) => feedback.feedbackId !== id);
    },
    initFeedbackValue() {
      this.feedbackValue.rating = this.feedback.rating;
      this.feedbackValue.comment = this.feedback.comment;
      this.feedback.feedbackImages.forEach((image) => {
        this.upload.imageUrls.push(image.resourceUrl);
        this.images.push({ resourceUrl: image.resourceUrl });
      });
    },
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
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
  },
  computed: {
    renter() {
      return this.$store.state.user.user.data;
    },
    allFeedbacks() {
      return this.$store.state.renter.hostelType.feedback.data;
    },
    deleteStatus() {
      return this.$store.state.user.feedback.success;
    },
    isCreateFeedback() {
      return this.$store.state.user.feedback.isLoading;
    },
    updateValue() {
      console.log(this.feedback);
      const rating = Number(`${this.feedback.rating}`);
      const comment = `${this.feedback.comment}`;
      return { rating, comment };
    },
  },
  created() {
    this.initFeedbackValue();
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.item-hover:hover {
  color: #727cf5 !important;
}
.item-menu:hover {
  background-color: #f8f9fa;
}
.v-list-item__title {
  color: #6c757d;
  font-family: 'Nunito', sans-serif !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
}
</style>
