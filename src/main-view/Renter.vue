<template>
  <v-app>
    <myAppBar style="box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06) !import" />
    <v-main
      :style="{
        width: '100%',
        backgroundColor: '#F3F5F8',
        _backgroundImage: 'linear-gradient(#fff, #F3F5F8)',
      }"
    >
      <router-view></router-view>
    </v-main>
    <v-footer app></v-footer>
    <backToTopButton />
  </v-app>
</template>
<script>
import myAppBar from '../components/core_layout/navigationBar.vue';
import backToTopButton from '../components/core_layout/backToTopButton.vue';

export default {
  name: 'RenterView',
  components: {
    myAppBar,
    backToTopButton,
  },
  data: () => ({}),
};
</script>
<style>
.bg-main {
  background-color: #fafbfe !important;
}
.bg-primary {
  background-color: #727cf5 !important;
  /* box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  border-radius: 0.15rem !important; */
}
.bg-danger {
  background-color: #fa5c7c !important;
}
.bg-danger-lighten {
  background-color: rgba(250, 92, 124, 0.25) !important;
}
.bg-info-lighten {
  background-color: rgba(57, 175, 209, 0.25) !important;
}
.bg-warning-lighten {
  background-color: rgba(255, 188, 0, 0.25) !important;
}
.bg-light {
  background-color: #eef2f7 !important;
}
.bt-primary-hover:hover {
  color: #fff;
  background-color: #4250f2 !important;
  border-color: #3645f1 !important;
}
.primary-hover:hover {
  color: #fff !important;
  background-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
  cursor: pointer;
}
.btn {
  letter-spacing: 0.01rem !important;
  border: 1px solid transparent !important;
  border-radius: 0.15rem !important;
  font-size: 0.9rem !important;
  line-height: 1.5 !important;
  padding: 0.45rem 0.9rem !important;
}
.btn-primary {
  color: #fff !important;
  background-color: #727cf5 !important;
  border-color: #727cf5 !important;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5) !important;
}
.btn-primary:hover {
  background-color: #4e5bf2 !important;
}
.btn-success {
  color: #fff !important;
  background-color: #0acf97 !important;
  border-color: #0acf97 !important;
  box-shadow: 0 2px 6px 0 rgba(10, 207, 151, 0.5) !important;
}
.btn-success:hover {
  color: #fff !important;
  background-color: #08ab7c !important;
  border-color: #089e74 !important;
}
.btn-warning {
  color: #313a46 !important;
  background-color: #ffbc00 !important;
  border-color: #ffbc00 !important;
  box-shadow: 0 2px 6px 0 rgba(255, 188, 0, 0.5) !important;
  letter-spacing: 0.01rem !important;
}
.btn-light {
  color: #313a46 !important;
  background-color: #eef2f7 !important;
  border-color: #eef2f7 !important;
}
.btn-danger {
  color: #fff !important;
  background-color: #fa5c7c !important;
  border-color: #fa5c7c !important;
  box-shadow: 0 2px 6px 0 rgba(250, 92, 124, 0.5) !important;
}
.btn-danger:hover {
  background-color: #f9375e !important;
}
.btn-outline-danger {
  color: #fa5c7c !important;
  border-color: #fa5c7c !important;
  background-color: white !important;
}
.btn-outline-primary {
  color: #727cf5 !important;
  border-color: #727cf5 !important;
  background-color: white !important;
}
.btn-outline-primary {
  color: #727cf5 !important;
  border: 1px solid #727cf5 !important;
  background-color: #fff !important;
}
.btn-sm {
  padding: 0.2rem 0.8rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.15rem !important;
  letter-spacing: 0.01rem !important;
}
.text-primary {
  color: #727cf5 !important;
}
.text-primary-dark {
  color: #727cf5 !important;
}
.text-primary-hover {
  color: #727cf5 !important;
}
.text-primary-danger-hover {
  color: #727cf5 !important;
}
.text-primary-sucess-hover {
  color: #727cf5 !important;
}
.text-primary-hover:hover {
  color: #4250f2 !important;
}
.text-primary-danger-hover:hover {
  color: red !important;
}
.text-primary-sucess-hover:hover {
  color: #08ab7c !important;
}
.text-primary-dark {
  color: #4250f2 !important;
}
.text-gray {
  color: #6c757d !important;
}
.text-warning {
  color: #ffbc00 !important;
}
.text-muted {
  color: #98a6ad !important;
}
.text-gray-dark {
  color: #343a40;
}
.text-gray-black {
  color: #495057;
}
.text-danger {
  color: #fa5c7c !important;
}
.text-brown {
  color: #adb5bd !important;
}
.text-black {
  color: #212121;
}
.text-price {
  color: #fd7e14;
}
.text-info {
  color: #39afd1 !important;
}
.bg-secondary {
  color: #727cf5 !important;
  background-color: rgba(114, 124, 245, 0.18) !important;
  font-weight: 700 !important;
}
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}
.line-blue {
  width: 150px;
  background-color: #727cf5;
  height: 2px;
}
.content {
  background-color: #fafbfe;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  -webkit-box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15) !important;
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15) !important;
}
.cursor:hover {
  cursor: pointer;
}
/* type */
.type-name {
  border-bottom: 1px solid #e2e6ed;
  padding-bottom: 10px;
  color: #727cf5;
  font-size: 1.05rem !important;
  width: 100%;
}
.item-text {
  color: #000;
  font-size: 0.875rem !important;
}
.size-h4 {
  font-size: 1.125rem !important;
}
.size-1rem {
  font-size: 1rem !important;
}
.size-h3 {
  font-size: 1.5rem !important;
}
.size9rem {
  font-size: 0.9rem !important;
}
.size-sub-2 {
  font-size: 0.875rem !important;
}
.size-sub-3 {
  font-size: 0.8rem !important;
}
.size-caption {
  font-size: 0.75rem !important;
}
.size-sub-caption {
  font-size: 0.6rem !important;
}
.font-14 {
  font-size: 14px !important;
}
.font-weight-600 {
  font-weight: 600 !important;
}
.font-weight-500 {
  font-weight: 500 !important;
}
.font-weight-300 {
  font-weight: 300 !important;
}
</style>
