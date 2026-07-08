import { createRouter, createMemoryHistory, type RouteRecordRaw, type RouteLocationRaw } from 'vue-router';
import { getEmbedOptions, type EmbedOptions } from './options';
import { readEmbedViewFromUrl } from './urlParams';

const namedRoutes: RouteRecordRaw[] = [
  { path: 'defect-acts', name: 'defect-acts', component: () => import('@/views/DefectActsView.vue') },
  { path: 'defect-acts/new', name: 'defect-act-new', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'defect-acts/:id', name: 'defect-act-detail', component: () => import('@/views/DefectActFormView.vue') },
  { path: 'purchase-requests', name: 'purchase-requests', component: () => import('@/views/PurchaseRequestsView.vue') },
  { path: 'purchase-requests/new', name: 'purchase-request-new', component: () => import('@/views/PurchaseRequestFormView.vue') },
  { path: 'purchase-requests/:id', name: 'purchase-request-detail', component: () => import('@/views/PurchaseRequestDetailView.vue') },
  { path: 'inbox', name: 'inbox', component: () => import('@/views/InboxView.vue') },
  { path: 'admin/users', name: 'admin-users', component: () => import('@/views/AdminUsersView.vue') }
];

function resolveDocumentType(embed: EmbedOptions): 'defect_act' | 'purchase_request' | undefined {
  if (embed.documentType) return embed.documentType;
  if (embed.mode === 'defect-act-form') return 'defect_act';
  if (embed.mode === 'purchase-request-form') return 'purchase_request';
  return undefined;
}

function initialTarget(embed: EmbedOptions): RouteLocationRaw {
  if (readEmbedViewFromUrl() === 'admin-users') return { name: 'admin-users' };

  const type = resolveDocumentType(embed);
  if (embed.documentId && type === 'defect_act')
    return { name: 'defect-act-detail', params: { id: embed.documentId } };
  if (embed.documentId && type === 'purchase_request')
    return { name: 'purchase-request-detail', params: { id: embed.documentId } };

  if (embed.mode === 'defect-act-form') return { name: 'defect-act-new' };
  if (embed.mode === 'purchase-request-form') return { name: 'purchase-request-new' };
  return { name: embed.initialList ?? 'defect-acts' };
}

export function createEmbedRouter() {
  const embed = getEmbedOptions();
  if (!embed) throw new Error('Embed options not configured');

  // Memory history: SharePoint page URL must not affect in-app routing.
  // The initial "/" redirect points straight at the target so there is no
  // navigation race (previously a fire-and-forget replace could lose to it).
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: () => import('@/views/MainLayout.vue'),
        children: [
          { path: '', redirect: initialTarget(embed) },
          ...namedRoutes
        ]
      }
    ]
  });
}
