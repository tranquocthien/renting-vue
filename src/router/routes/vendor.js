import VendorView from '../../main-view/Vendor.vue';
import Overview from '../../views/vendor/Overview.vue';
import HostelManagement from '../../views/vendor/HostelManagement.vue';
import RoomManagement from '../../views/vendor/RoomManagement.vue';
import QRGeneration from '../../components/vendor/overview/QRGeneration.vue';
import VendorBooking from '../../views/vendor/Booking.vue';
import VendorSchedule from '../../views/vendor/Schedule.vue';
import VendorMobileMessage from '../../views/vendor/MessageMobile.vue';
import CreateContract from '../../views/vendor/CreateContract.vue';
import ViewContractVendor from '../../views/vendor/ViewContractVendor.vue';

const routes = [
  {
    path: '/vendor',
    component: VendorView,
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Tổng quan' },
        alias: '',
      },
      {
        path: 'groups',
        name: 'HostelManagement',
        component: HostelManagement,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Quản lí nhà trọ' },
      },
      {
        path: 'rooms',
        name: 'RoomManagement',
        component: RoomManagement,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Quản lí phòng' },
        props: true,
      },
      {
        path: 'qrgeneration',
        name: 'QRGeneration',
        component: QRGeneration,
        meta: { requiresAuth: true },
      },
      {
        path: 'booking',
        name: 'VendorBooking',
        component: VendorBooking,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Lịch hẹn' },
      },
      {
        path: 'schedule',
        name: 'VendorSchedule',
        component: VendorSchedule,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Lịch rảnh' },
      },
      {
        path: 'mobile-message',
        name: 'VendorMobileMessage',
        component: VendorMobileMessage,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Tin nhắn' },
      },
      {
        path: 'contract',
        name: 'contract',
        component: CreateContract,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Tạo hợp đồng' },
        props: true, // Pass route.params to props
      },
      {
        path: 'view-contract',
        name: 'ViewContractVendor',
        component: ViewContractVendor,
        meta: { requiresAuth: true, is_vendor: true, vi: 'Quản lý hợp đồng' },
      },
    ],
  },
];

export default routes;
