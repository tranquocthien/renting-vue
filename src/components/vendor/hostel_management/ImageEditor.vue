<template>
  <div>
    <v-dialog v-model="dialog.showCurrImg">
      <v-card max-height="500px">
        <v-img :src="dialog.currImg"></v-img>
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
          <v-btn color="#727CF5" v-if="this.upload.imageUrls.length > 0" @click="uploadImages" dark>
            <v-icon left>cloud_upload</v-icon> Tải lên
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col v-if="mode === 'edit'" cols="12" :class="check === 1 ? 'd-flex justify-center' : ''">
        <v-btn class="ml-2" @click="openImageUploadDialog" depressed>
          <v-icon left>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
        >
      </v-col>
      <v-col cols="12">
        <div style="max-height: 300px; overflow-y: auto">
          <!-- display input images -->
          <!-- if mode === view -->
          <div class="d-flex flex-row flex-wrap align-start justify-start">
            <v-img
              v-for="image in mergeImages"
              :key="image.imageId"
              :src="image.resourceUrl"
              :lazy-src="image.resourceUrl"
              aspect-ratio="1"
              class="grey lighten-2 ma-2"
              height="120"
              width="120"
              @click="showCurrImg(image.resourceUrl)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
              <v-row v-if="mode === 'edit'" class="fill-height ma-0" align="center" justify="center">
                <v-btn icon depressed color="blue-grey" @click="removeImage(image.resourceUrl)">
                  <v-icon color="red">delete_forever</v-icon>
                </v-btn>
              </v-row>
            </v-img>
          </div>
          <!-- display uploaded images -->
        </div>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackBarMixin.show"
      :multi-line="snackBarMixin.multiLine"
      :timeout="snackBarMixin.timeout"
      :absolute="snackBarMixin.absolute"
      :color="snackBarMixin.color"
    >
      {{ snackBarMixin.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import fileMixins from '../../mixins/file';
import snackBarMixins from '../../mixins/snackBar';

export default {
  name: 'ImageEditor',
  props: {
    oldImages: {},
    mode: {
      default: 'edit',
      validator: (value) => ['edit', 'view'].includes(value.toLowerCase()),
    },
    check: {},
  },
  mixins: [fileMixins, snackBarMixins],
  data: () => ({
    dialog: {
      show: false,
      files: null,
      currImg: null,
      showCurrImg: false,
    },
    upload: {
      imageUrls: [],
      locals: [],
    },
    mergeImages: [],
  }),
  methods: {
    showCurrImg(url) {
      this.dialog.currImg = url;
      this.dialog.showCurrImg = true;
    },
    removeImage(url) {
      const index = this.mergeImages.findIndex((img) => img.resourceUrl === url);
      if (index > -1) {
        this.mergeImages = [
          ...this.mergeImages.slice(0, index),
          ...this.mergeImages.slice(index + 1),
        ];
        this.$emit('newValues', this.mergeImages);
      }
    },
    openImageUploadDialog() {
      this.dialog.show = true;
      this.$nextTick(() => this.$refs.fileSelect.click());
    },
    onFileChange(e) {
      console.log(e.target.files);
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
          this.upload.imageUrls = this.listUploadedFiles.map((url) => ({ resourceUrl: url }));
          this.mergeImages = [...this.mergeImages, ...this.upload.imageUrls];
          this.$emit('newValues', this.mergeImages);
          this.dialog.show = false;
          this.showSnackBar('Tải ảnh lên thành công', { color: 'green' });
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
  },
  watch: {
    upload: {
      handler() {
        // this.$emit('newValues', this.mergeImages);
      },
      deep: true,
    },
  },
  created() {
    this.mergeImages = this.oldImages;
  },
};
</script>
