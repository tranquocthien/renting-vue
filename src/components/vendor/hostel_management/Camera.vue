<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <div style="height: 100%;">
          <v-dialog
            v-model="show"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            class="hidden-md-and-up"
          >
            <v-card>
              <div id="download" v-if="photo" class="">
                <img :src="photo.toDataURL('image/jpeg')" alt="Photo" width="100%" />

                <v-btn @click="downloadPhoto">
                  <v-icon>backup</v-icon>
                </v-btn>
                <v-btn
                  @click="
                    photo = null;
                    show = false;
                  "
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
          <video ref="video" class="full" autoplay muted playsinline>
            Trình duyệt của bạn không hỗ trợ tính năng này
          </video>
          <v-btn fab dark right fixed bottom @click="capturePhoto" :disabled="!ready" x-large>
            <v-icon>camera</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import loadImage from 'blueimp-load-image';

export default {
  name: 'Camera',
  data() {
    return {
      stream: null,
      ready: false,
      photo: null,
      show: false,
    };
  },
  mounted() {
    this.startCamera();
  },
  methods: {
    async startCamera() {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
        },
      });

      this.$refs.video.srcObject = this.stream;

      this.$refs.video.onloadedmetadata = () => {
        this.ready = true;
      };

      this.$refs.video.onended = () => {
        this.ready = false;
        this.stream = null;
      };
    },
    capturePhoto() {
      const { video } = this.$refs;

      const videoCanvas = document.createElement('canvas');
      videoCanvas.height = video.videoHeight;
      videoCanvas.width = video.videoWidth;
      const videoContext = videoCanvas.getContext('2d');

      videoContext.drawImage(video, 0, 0);

      this.photo = loadImage.scale(videoCanvas, {
        maxHeight: 1080,
        maxWidth: 1080,
        cover: true,
        crop: true,
        canvas: true,
      });
      this.show = true;
    },
    downloadPhoto() {
      this.photo.toBlob((blob) => {
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = data;
        link.download = 'photo.jpg';
        link.click();
      }, 'image/jpeg');
      this.show = false;
    },
  },
};
</script>
<style>
.full {
  height: 100% !important;
  width: 100% !important;
}
</style>
