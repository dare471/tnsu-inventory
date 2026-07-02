import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ADMIN_ROLES } from '@/config/roles';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/views/MainLayout.vue'),
    children: [
      { path: '', redirect: { name: 'home' } },
      { path: 'home', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'defect-acts', name: 'defect-acts', component: () => import('@/views/DefectActsView.vue') },
      { path: 'defect-acts/new', name: 'defect-act-new', component: () => import('@/views/DefectActFormView.vue') },
      { path: 'defect-acts/:id', name: 'defect-act-detail', component: () => import('@/views/DefectActFormView.vue') },
      { path: 'purchase-requests', name: 'purchase-requests', component: () => import('@/views/PurchaseRequestsView.vue') },
      { path: 'purchase-requests/:id', name: 'purchase-request-detail', component: () => import('@/views/PurchaseRequestDetailView.vue') },
      { path: 'inbox', name: 'inbox', component: () => import('@/views/InboxView.vue') },
      { path: 'admin/users', name: 'admin-users', component: () => import('@/views/AdminUsersView.vue') }
    ]
  },
  {
    path: '/document/:type/:id',
    redirect: (to) => {
      if (to.params.type === 'defect_act') return `/defect-acts/${to.params.id}`;
      return `/purchase-requests/${to.params.id}`;
    }
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (to.meta.public) return true;

  if (!auth.token) return { name: 'login', query: { redirect: to.fullPath } };

  if (!auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
      return { name: 'login' };
    }
  }

  const currentUser = auth.user;
  if (!currentUser) return { name: 'login' };

  if (to.name === 'admin-users' && !ADMIN_ROLES.has(currentUser.role)) {
    return { name: 'home' };
  }

  return true;
});

export default router;
