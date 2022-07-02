import AdminView from '../../main-view/Admin.vue';
import ModerateHostel from '../../views/admin/ModerateHostel.vue';
import UserInformation from '../../views/admin/UserInformation.vue';
import Report from '../../views/admin/Report.vue';

const routes = [
  {
    path: '/admin',
    name: 'AdminMainView',
    component: AdminView,
    children: [
      {
        path: 'hostel',
        name: 'ModerateHostel',
        component: ModerateHostel,
        meta: { requiresAuth: false, vi: 'Phòng trọ' },
        alias: '',
      },
      {
        path: 'user-information',
        name: 'UserInformation',
        component: UserInformation,
        meta: { requiresAuth: false, vi: 'Thông tin người dùng' },
      },
      {
        path: 'report',
        name: 'Report',
        component: Report,
        meta: { requiresAuth: false, vi: 'Phản hồi' },
      },
    ],
    meta: {
      requiresAuth: false,
      is_admin: true,
    },
  },
];

export default routes;
