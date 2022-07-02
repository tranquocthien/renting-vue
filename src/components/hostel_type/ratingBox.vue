<template>
  <div>
    <!-- eslint-disable max-len -->
    <div v-if="list.length > 0">
      <div class="d-flex" style="border: 1px solid #ccc !important; background: #eeeeee !important">
        <v-col cols="6" md="3" class="flex justify-center">
          <span class="text-h5 font-nunito font-weight-bold" :style="{ color: '#F9A825' }">
            {{ rating.average }}
            <span class="text-subtitle-1 font-weight-regular">trên 5</span>
          </span>
          <v-rating
            v-model="rating.average"
            color="yellow darken-3"
            background-color="grey darken-1"
            _empty-icon="$ratingFull"
            half-increments
            small
            readonly
            class="px-0 rating"
          ></v-rating>
          <span class="text-body-2 font-nunito gray--text">({{ rating.total }} đánh giá)</span>
        </v-col>
        <v-col cols="9" class="d-flexd-flex flex-wrap feedback">
          <v-chip-group v-model="typeFeedback" column>
            <v-chip value="all">Tất cả</v-chip>
            <v-chip value="booking">Đã xem phòng ({{ counter.booking }})</v-chip>
            <v-chip value="contract">Đã ở ({{ counter.contract }})</v-chip>
            <v-chip value="fiveStar">5 sao ({{ counter.fiveStar }})</v-chip>
            <v-chip value="fourStar">4 sao ({{ counter.fourStar }})</v-chip>
            <v-chip value="threeStar">3 sao ({{ counter.threeStar }})</v-chip>
            <v-chip value="twoStar">2 sao ({{ counter.twoStar }})</v-chip>
            <v-chip value="oneStart">1 sao ({{ counter.oneStar }})</v-chip>
            <v-chip value="image">Có hình ảnh ({{ counter.image }})</v-chip>
            <v-chip value="commnet">Có bình luận ({{ counter.comment }})</v-chip>
          </v-chip-group>
        </v-col>
      </div>
      <ratingItem
        class="py-2"
        v-for="i in display.length"
        :key="i"
        :index="i"
        :feedback="display[i - 1]"
      />
      <v-row>
        <v-pagination
          class="ml-auto elevation-0"
          v-model="page"
          :length="pageLength"
          circle
          color="#727cf5"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-row>
    </div>
    <div
      v-else
      class="d-flex pa-4"
      style="border: 1px solid #ccc !important; background: #eeeeee !important"
    >
      <span class="font-nunito text-gray size9rem">Chưa có đánh giá nào</span>
    </div>
  </div>
</template>
<script>
import ratingItem from './ratingItem.vue';

export default {
  name: 'RatingBox',
  components: { ratingItem },
  data: () => ({
    page: 1,
    typeFeedback: 'all',
    pageRange: 5,
  }),
  props: {
    rating: Object,
  },
  computed: {
    list() {
      return this.$store.state.renter.hostelType.feedback.data;
    },
    listFilter() {
      switch (this.typeFeedback) {
        case 'all':
          return this.list;
        case 'booking':
          return this.list.filter((feedback) => feedback.bookingId);
        case 'contract':
          return this.list.filter((feedback) => feedback.contractId);
        case 'fiveStar':
          return this.list.filter((feedback) => feedback.rating === 5);
        case 'fourStar':
          return this.list.filter((feedback) => feedback.rating === 4);
        case 'threeStar':
          return this.list.filter((feedback) => feedback.rating === 3);
        case 'twoStar':
          return this.list.filter((feedback) => feedback.rating === 2);
        case 'oneStart':
          return this.list.filter((feedback) => feedback.rating === 1);
        case 'image':
          return this.list.filter((feedback) => feedback.feedbackImages);
        case 'commnet':
          return this.list.filter((feedback) => feedback.comment);
        default:
          break;
      }
      return this.list;
    },
    display() {
      return this.listFilter.slice(this.pageRange * (this.page - 1), this.pageRange * this.page);
    },
    counter() {
      const all = this.list.length;
      let booking = 0;
      let contract = 0;
      let fiveStar = 0;
      let fourStar = 0;
      let threeStar = 0;
      let twoStar = 0;
      let oneStar = 0;
      let image = 0;
      let comment = 0;
      this.list.forEach((feedback) => {
        if (feedback.bookingId) {
          booking += 1;
        }
        if (feedback.contractId) {
          contract += 1;
        }
        if (feedback.contractId) {
          contract += 1;
        }
        if (feedback.comment) {
          comment += 1;
        }
        if (feedback.feedbackImages) {
          image += 1;
        }
        switch (feedback.rating) {
          case 5:
            fiveStar += 1;
            break;
          case 4:
            fourStar += 1;
            break;
          case 3:
            threeStar += 1;
            break;
          case 2:
            twoStar += 1;
            break;
          case 1:
            oneStar += 1;
            break;
          default:
        }
      });
      return {
        all,
        booking,
        contract,
        fiveStar,
        fourStar,
        threeStar,
        twoStar,
        oneStar,
        image,
        comment,
      };
    },
    pageLength() {
      return Math.ceil(this.list.length / this.pageRange);
    },
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
<style>
.v-application--is-ltr .v-rating .v-icon {
  transform: scaleX(1);
  padding: 0;
}
.feedback .v-chip-group .v-chip--active {
  background: #4250f2 !important;
  color: #fff !important;
  font-family: 'Nunito', sans-serif !important;
  font-size: 0.8rem !important;
}
.feedback .v-chip-group .v-chip {
  font-family: 'Nunito', sans-serif !important;
  font-size: 0.8rem !important;
}
</style>
