<template>
  <v-row class="mx-0">
    <v-col
      cols="12"
      class="cursor ma-0 mt-2 px-5 d-flex justify-center align-center py-7"
      style="border: 2px dashed #dee2e6; border-radius: 6px; background-size: cover"
      @click="openImageUploadDialog"
      v-bind:style="{ 'background-image': 'url(' + images[0].resourceUrl + ')' }"
      v-if="images[0]"
    >
      <v-icon color="#98a6ad" size="25">mdi-file-image-outline</v-icon>
    </v-col>
    <v-col
      cols="12"
      class="cursor ma-0 mt-2 px-5 d-flex justify-center align-center"
      style="border: 2px dashed #dee2e6; border-radius: 6px"
      @click="openImageUploadDialog"
      v-else
    >
      <v-icon color="#98a6ad" size="25">mdi-file-image-outline</v-icon>
    </v-col>
    <!-- <v-col cols="12" class="ma-0 pa-0 d-flex justify-center">
      <v-img
        :src="images[0].resourceUrl"
        :lazy-src="images[0].resourceUrl"
        aspect-ratio="1"
        v-if="images[0]"
        max-width="200"
        min-width="200"
        contain
      ></v-img>
    </v-col> -->
    <v-dialog v-model="dialog.show" width="350">
      <v-card height="350" :loading="isFileUploading">
        <div class="d-flex flex-column align-center justify-center">
          <input
            type="file"
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
          <v-btn color="primary" v-if="this.upload.imageUrls.length > 0" @click="uploadImages">
            <v-icon>cloud_upload</v-icon> Tải lên
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import snackBarMixin from '@/components/mixins/snackBar';
import fileMixins from '@/components//mixins/file';

export default {
  name: 'RegulationManagement',
  mixins: [fileMixins, snackBarMixin],
  data: () => ({
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
    allRules() {
      console.log(this.$store.state.renter.common.rules.data);
      return this.$store.state.renter.common.rules.data;
    },
    newGroup() {
      return this.$store.state.vendor.group.newGroup;
    },
  },
  methods: {
    ...mapActions({
      getAllRules: 'renter/common/getAllRules',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
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
          this.newGroup.avatar = this.images[0].resourceUrl;
          this.setNewGroupValue(this.newGroup);
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
  },
  created() {},
};
</script>

<style>
.dropzone {
  border: 2px dashed #dee2e6;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}
</style>
