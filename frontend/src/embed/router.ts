import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { getEmbedOptions, type EmbedMode } from './options';
import { readEmbedViewFromUrl } from './urlParams';

const adminRoute: RouteRecordRaw = {
  path: 'admin/users',
  name: 'admin-users',
  component: () => import('@/views/AdminUsersView.vue')
};

const listRoutes: RouteRecordRaw[] = [
  { path: '', redirect: { name: 'defect-acts' } },
  { path: 'defect-acts', name: 'defect-acts', component: () => import('@/views/DefectActsView.vue') },
  { path: 'defect-acts/new', name: 'defect-act-new', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'defect-acts/:id', name: 'defect-act-detail', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'purchase-requests', name: 'purchase-requests', component: () => import('@/views/PurchaseRequestsView.vue') },
  { path: 'purchase-requests/:id', name: 'purchase-request-detail', component: () => import('@/views/PurchaseRequestDetailView.vue') },
  { path: 'inbox', name: 'inbox', component: () => import('@/views/InboxView.vue') },
  adminRoute
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
          redirect: documentId
            ? { name: 'defect-act-detail', params: { id: documentId } }
            : { name: 'defect-act-new' }
        }, ...listRoutes.filter((r) => r.path?.toString().startsWith('defect-acts')), adminRoute]
      }];
    case 'purchase-request-form':
      return [{
        path: '/',
        component: shell,
        children: [{
          path: '',
          redirect: documentId
            ? { name: 'purchase-request-detail', params: { id: documentId } }
            : { name: 'purchase-requests' }
        }, ...listRoutes.filter((r) => r.path?.toString().startsWith('purchase-requests')), adminRoute]
      }];
  }
}

function initialRouteName(embed: NonNullable<ReturnType<typeof getEmbedOptions>>) {
  if (embed.mode === 'lists') {
    return embed.initialList ?? 'defect-acts';
  }
  if (embed.mode === 'defect-act-form') {
    return embed.documentId ? 'defect-act-detail' : 'defect-act-new';
  }
  return embed.documentId ? 'purchase-request-detail' : 'purchase-requests';
}

export function createEmbedRouter() {
  const embed = getEmbedOptions();
  if (!embed) throw new Error('Embed options not configured');

  const router = createRouter({
    // Memory history: SharePoint page URL must not affect in-app routing.
    history: createMemoryHistory(),
    routes: routesForMode(embed.mode, embed.documentId)
  });

  const viewFromUrl = readEmbedViewFromUrl();
  const initialName = viewFromUrl === 'admin-users' || (viewFromUrl && embed.mode === 'lists')
    ? viewFromUrl
    : initialRouteName(embed);
  const initialParams = embed.documentId && initialName.includes('detail')
    ? { id: embed.documentId }
    : undefined;

  void router.replace({ name: initialName, params: initialParams });

  return router;
}
