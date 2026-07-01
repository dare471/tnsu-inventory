import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getEmbedOptions, type EmbedMode } from './options';

const listRoutes: RouteRecordRaw[] = [
  { path: '', redirect: { name: 'defect-acts' } },
  { path: 'defect-acts', name: 'defect-acts', component: () => import('@/views/DefectActsView.vue') },
  { path: 'defect-acts/new', name: 'defect-act-new', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'defect-acts/:id', name: 'defect-act-detail', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'purchase-requests', name: 'purchase-requests', component: () => import('@/views/PurchaseRequestsView.vue') },
  { path: 'purchase-requests/:id', name: 'purchase-request-detail', component: () => import('@/views/PurchaseRequestDetailView.vue') },
  { path: 'inbox', name: 'inbox', component: () => import('@/views/InboxView.vue') }
];

function routesForMode(mode: EmbedMode, documentId?: string): RouteRecordRaw[] {
  const shell = () => import('@/views/MainLayout.vue');

  switch (mode) {
    case 'lists':
      return [{ path: '/', component: shell, children: listRoutes }];
    case 'defect-act-form':
      return [{
        path: '/',
        component: shell,
        children: [{
          path: '',
          redirect: documentId ? `/defect-acts/${documentId}` : '/defect-acts/new'
        }, ...listRoutes.filter((r) => r.path?.toString().startsWith('defect-acts'))]
      }];
    case 'purchase-request-form':
      return [{
        path: '/',
        component: shell,
        children: [{
          path: '',
          redirect: documentId ? `/purchase-requests/${documentId}` : '/purchase-requests'
        }, ...listRoutes.filter((r) => r.path?.toString().startsWith('purchase-requests'))]
      }];
  }
}

export function createEmbedRouter() {
  const embed = getEmbedOptions();
  if (!embed) throw new Error('Embed options not configured');

  const router = createRouter({
    history: createWebHistory('/'),
    routes: routesForMode(embed.mode, embed.documentId)
  });

  if (embed.initialList && embed.mode === 'lists') {
    void router.isReady().then(() => router.replace({ name: embed.initialList! }));
  }

  return router;
}
