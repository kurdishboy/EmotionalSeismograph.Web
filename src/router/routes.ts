import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'application',
    redirect: { name: 'index' },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          authentication: 'allow-anonymous',
        },
      },
      {
        path: 'space/:id',
        name: 'space-index',
        component: () => import('pages/space/SpaceIndexPage.vue'),
        meta: {
          authentication: 'authenticated-users',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    name: 'auth',
    children: [
      {
        path: 'result',
        name: 'auth-result',
        component: () => import('src/pages/auth/AuthResult.vue'),
        meta: {
          authentication: 'allow-anonymous',
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
