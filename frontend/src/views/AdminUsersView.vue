<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue';
import {
  NAlert, NButton, NButtonGroup, NCard, NDataTable, NForm, NFormItem, NInput, NSelect, NSpace, NSwitch, NTag,
  type DataTableColumns, type PaginationProps
} from 'naive-ui';
import {
  inventoryApi,
  type AdminUserDto,
  type ApprovalRouteAssignmentDto,
  type AdminUserOptionDto,
  type ZupEmployeeDto,
  type ProjectDto
} from '@/api/inventory';
import { toApiError } from '@/api/client';
import { MECHANIZATION_ROLES } from '@/config/roles';
import { EMPLOYER_COMPANY_OPTIONS } from '@/config/zup';

const activeTab = ref<'users' | 'routes'>('users');
const usersLoading = ref(true);
const routesLoading = ref(true);
const savingRoute = ref(false);
const error = ref('');
const success = ref('');
const users = ref<AdminUserDto[]>([]);
const userTotal = ref(0);
const userPage = ref(1);
const userPageSize = ref(50);
const userSearch = ref('');
const userRoleFilter = ref('');
const userActiveFilter = ref<'all' | 'active' | 'inactive'>('all');
const routeAssignments = ref<ApprovalRouteAssignmentDto[]>([]);
const routeUsers = ref<AdminUserOptionDto[]>([]);
const projects = ref<ProjectDto[]>([]);
const selectedProjectId = ref<string | null>(null);
const projectRouteAssignments = ref<ApprovalRouteAssignmentDto[]>([]);
const projectRouteDraft = reactive<Record<string, string>>({});
const savingProjectRoute = ref(false);
const docSettings = ref<{
  assignments: ApprovalRouteAssignmentDto[];
  users: AdminUserOptionDto[];
} | null>(null);
const docType = ref<'defect_act' | 'purchase_request'>('purchase_request');
const docId = ref('');
const docDraft = reactive<Record<string, string>>({});
const savingDocApprovers = ref(false);

const createForm = reactive({
  employerCompany: null as string | null,
  zupEmployeeId: null as string | null,
  email: '',
  fullName: '',
  position: '',
  role: 'site_mechanic',
  isActive: true
});
const creating = ref(false);
const zupEmployees = ref<ZupEmployeeDto[]>([]);
const zupLoading = ref(false);

const roleOptions = MECHANIZATION_ROLES.map((r) => ({ label: r.label, value: r.value }));
const activeFilterOptions = [
  { label: 'Все', value: 'all' as const },
  { label: 'Активные', value: 'active' as const },
  { label: 'Неактивные', value: 'inactive' as const }
];

const zupOptions = computed(() =>
  zupEmployees.value.map((e) => ({
    label: `${e.fullName} · ${e.position}${e.email ? ` · ${e.email}` : ''}`,
    value: e.externalId
  }))
);

watch(() => createForm.employerCompany, async (company) => {
  createForm.zupEmployeeId = null;
  createForm.email = '';
  createForm.fullName = '';
  createForm.position = '';
  zupEmployees.value = [];
  if (!company) return;

  zupLoading.value = true;
  error.value = '';
  try {
    zupEmployees.value = await inventoryApi.listZupEmployees(company);
    if (!zupEmployees.value.length)
      error.value = 'Справочник ЗУП пуст или недоступен. Проверьте настройки Dictionary1C / ZUP.';
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    zupLoading.value = false;
  }
});

watch(() => createForm.zupEmployeeId, (id) => {
  if (!id) {
    createForm.email = '';
    createForm.fullName = '';
    createForm.position = '';
    return;
  }
  const row = zupEmployees.value.find((e) => e.externalId === id);
  if (!row) return;
  createForm.fullName = row.fullName;
  createForm.position = row.position;
  createForm.email = row.email;
});

watch(selectedProjectId, () => {
  if (selectedProjectId.value) void loadProjectRoute();
});

watch([userPage, userPageSize], () => {
  void loadUsers();
});

const routeDraft = reactive<Record<string, string>>({});

const userOptions = computed(() =>
  routeUsers.value.map((u) => ({
    label: `${u.fullName} (${u.email})`,
    value: u.id
  }))
);
const projectOptions = computed(() =>
  projects.value.map((p) => ({ label: `${p.code} — ${p.projectName}`, value: p.id }))
);
const documentUserOptions = computed(() =>
  (docSettings.value?.users ?? []).map((u) => ({
    label: `${u.fullName} (${u.email})`,
    value: u.id
  }))
);

function hydrateRouteDraft() {
  Object.keys(routeDraft).forEach((k) => delete routeDraft[k]);
  routeAssignments.value.forEach((a) => {
    routeDraft[a.role] = a.userId ?? '';
  });
}

const userPagination = computed<PaginationProps>(() => ({
  page: userPage.value,
  pageSize: userPageSize.value,
  itemCount: userTotal.value,
  showSizePicker: true,
  pageSizes: [25, 50, 100]
}));

async function loadUsers() {
  usersLoading.value = true;
  error.value = '';
  try {
    const data = await inventoryApi.listAdminUsers({
      search: userSearch.value.trim() || undefined,
      role: userRoleFilter.value || undefined,
      isActive: userActiveFilter.value === 'all'
        ? undefined
        : userActiveFilter.value === 'active',
      page: userPage.value,
      pageSize: userPageSize.value
    });
    users.value = data.items ?? [];
    userTotal.value = data.total ?? users.value.length;
  } catch (e) {
    users.value = [];
    userTotal.value = 0;
    error.value = toApiError(e).detail;
  } finally {
    usersLoading.value = false;
  }
}

async function loadRoutes() {
  routesLoading.value = true;
  error.value = '';
  try {
    const [route, projectList] = await Promise.all([
      inventoryApi.getApprovalRoute(),
      inventoryApi.getProjects()
    ]);
    routeAssignments.value = route.assignments;
    routeUsers.value = route.users;
    projects.value = projectList;
    hydrateRouteDraft();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    routesLoading.value = false;
  }
}

function applyUserFilters() {
  userPage.value = 1;
  void loadUsers();
}

function resetUserFilters() {
  userSearch.value = '';
  userRoleFilter.value = '';
  userActiveFilter.value = 'all';
  userPage.value = 1;
  void loadUsers();
}

async function loadProjectRoute() {
  if (!selectedProjectId.value) return;
  const route = await inventoryApi.getProjectApprovalRoute(selectedProjectId.value);
  projectRouteAssignments.value = route.assignments;
  Object.keys(projectRouteDraft).forEach((k) => delete projectRouteDraft[k]);
  route.assignments.forEach((a) => {
    projectRouteDraft[a.role] = a.userId ?? '';
  });
}

async function createUser() {
  if (!createForm.employerCompany || !createForm.zupEmployeeId) {
    error.value = 'Выберите компанию и сотрудника из ЗУП.';
    return;
  }

  creating.value = true;
  error.value = '';
  success.value = '';
  try {
    await inventoryApi.createAdminUser({
      employerCompany: createForm.employerCompany,
      zupEmployeeId: createForm.zupEmployeeId,
      role: createForm.role,
      isActive: createForm.isActive
    });
    createForm.employerCompany = null;
    createForm.zupEmployeeId = null;
    createForm.email = '';
    createForm.fullName = '';
    createForm.position = '';
    createForm.role = 'site_mechanic';
    createForm.isActive = true;
    zupEmployees.value = [];
    success.value = 'Пользователь добавлен.';
    await loadUsers();
    await loadRoutes();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    creating.value = false;
  }
}

async function saveUser(user: AdminUserDto) {
  error.value = '';
  success.value = '';
  try {
    await inventoryApi.updateAdminUser(user.id, {
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    });
    success.value = `Пользователь ${user.fullName} обновлен.`;
    await loadUsers();
    await loadRoutes();
  } catch (e) {
    error.value = toApiError(e).detail;
  }
}

async function saveRoute() {
  savingRoute.value = true;
  error.value = '';
  success.value = '';
  try {
    const assignments = routeAssignments.value.map((a) => ({
      role: a.role,
      userId: routeDraft[a.role]
    }));
    if (assignments.some((a) => !a.userId)) {
      throw new Error('Назначьте пользователя на каждый шаг маршрута.');
    }
    await inventoryApi.updateApprovalRoute({
      assignments: assignments as Array<{ role: string; userId: string }>
    });
    success.value = 'Маршрут согласования сохранен.';
    await loadRoutes();
  } catch (e) {
    error.value = toApiError(e).detail || (e as Error).message;
  } finally {
    savingRoute.value = false;
  }
}

async function saveProjectRoute() {
  if (!selectedProjectId.value) return;
  savingProjectRoute.value = true;
  error.value = '';
  success.value = '';
  try {
    const assignments = projectRouteAssignments.value.map((a) => ({
      role: a.role,
      userId: projectRouteDraft[a.role]
    }));
    if (assignments.some((a) => !a.userId))
      throw new Error('Назначьте пользователя на каждую проектную роль.');
    await inventoryApi.updateProjectApprovalRoute(selectedProjectId.value, {
      assignments: assignments as Array<{ role: string; userId: string }>
    });
    success.value = 'Проектный маршрут сохранен.';
  } catch (e) {
    error.value = toApiError(e).detail || (e as Error).message;
  } finally {
    savingProjectRoute.value = false;
  }
}

async function loadDocumentApprovers() {
  if (!docId.value.trim()) {
    error.value = 'Введите ID документа.';
    return;
  }
  error.value = '';
  success.value = '';
  const data = await inventoryApi.getDocumentApprovers(docType.value, docId.value.trim());
  docSettings.value = { assignments: data.assignments, users: data.users };
  Object.keys(docDraft).forEach((k) => delete docDraft[k]);
  data.assignments.forEach((a) => {
    docDraft[a.role] = a.userId ?? '';
  });
}

async function saveDocumentApprovers() {
  if (!docSettings.value) return;
  savingDocApprovers.value = true;
  error.value = '';
  success.value = '';
  try {
    const assignments = docSettings.value.assignments.map((a) => ({
      role: a.role,
      userId: docDraft[a.role]
    }));
    if (assignments.some((a) => !a.userId))
      throw new Error('Назначьте пользователя на каждый шаг.');
    await inventoryApi.updateDocumentApprovers(docType.value, docId.value.trim(), {
      assignments: assignments as Array<{ role: string; userId: string }>
    });
    success.value = 'Согласующие документа обновлены.';
  } catch (e) {
    error.value = toApiError(e).detail || (e as Error).message;
  } finally {
    savingDocApprovers.value = false;
  }
}

const columns: DataTableColumns<AdminUserDto> = [
  { title: 'Email', key: 'email', ellipsis: { tooltip: true } },
  {
    title: 'ФИО',
    key: 'fullName',
    render: (row) =>
      h(NInput, {
        value: row.fullName,
        onUpdateValue: (v: string) => { row.fullName = v; }
      })
  },
  {
    title: 'Роль',
    key: 'role',
    render: (row) =>
      h(NSelect, {
        value: row.role,
        options: roleOptions,
        style: 'min-width:220px',
        onUpdateValue: (v: string) => { row.role = v; }
      })
  },
  {
    title: 'Активен',
    key: 'isActive',
    width: 100,
    render: (row) =>
      h(NSwitch, {
        value: row.isActive,
        onUpdateValue: (v: boolean) => { row.isActive = v; }
      })
  },
  {
    title: 'Действие',
    key: 'actions',
    width: 120,
    render: (row) =>
      h(NButton, { size: 'small', type: 'primary', onClick: () => void saveUser(row) }, { default: () => 'Сохранить' })
  }
];

onMounted(() => {
  void loadUsers();
  void loadRoutes();
});
</script>

<template>
  <NCard title="Администрирование">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="success" type="success">{{ success }}</NAlert>

      <NButtonGroup>
        <NButton
          :type="activeTab === 'users' ? 'primary' : 'default'"
          :secondary="activeTab !== 'users'"
          @click="activeTab = 'users'"
        >
          Пользователи
        </NButton>
        <NButton
          :type="activeTab === 'routes' ? 'primary' : 'default'"
          :secondary="activeTab !== 'routes'"
          @click="activeTab = 'routes'"
        >
          Маршруты согласования
        </NButton>
      </NButtonGroup>

      <div v-show="activeTab === 'users'">
        <NSpace vertical :size="16" style="margin-top:8px">
            <NCard title="Добавить пользователя" size="small">
              <NForm label-placement="left" :label-width="130">
                <NFormItem label="Компания">
                  <NSelect
                    v-model:value="createForm.employerCompany"
                    :options="EMPLOYER_COMPANY_OPTIONS"
                    placeholder="Выберите компанию"
                    clearable
                  />
                </NFormItem>
                <NFormItem label="Сотрудник ЗУП">
                  <NSelect
                    v-model:value="createForm.zupEmployeeId"
                    :options="zupOptions"
                    :loading="zupLoading"
                    :disabled="!createForm.employerCompany"
                    filterable
                    clearable
                    placeholder="Выберите сотрудника"
                  />
                </NFormItem>
                <NFormItem label="ФИО">
                  <NInput :value="createForm.fullName" readonly placeholder="Из ЗУП" />
                </NFormItem>
                <NFormItem label="Должность">
                  <NInput :value="createForm.position" readonly placeholder="Из ЗУП" />
                </NFormItem>
                <NFormItem label="Email">
                  <NInput :value="createForm.email" readonly placeholder="Из ЗУП" />
                </NFormItem>
                <NFormItem label="Роль">
                  <NSelect v-model:value="createForm.role" :options="roleOptions" />
                </NFormItem>
                <NFormItem label="Активен">
                  <NSwitch v-model:value="createForm.isActive" />
                </NFormItem>
                <NButton
                  type="primary"
                  :loading="creating"
                  :disabled="!createForm.zupEmployeeId"
                  @click="createUser"
                >
                  Добавить
                </NButton>
              </NForm>
            </NCard>

            <NCard title="Список пользователей" size="small">
              <NSpace vertical :size="12">
                <div class="t-admin-filters">
                  <NInput
                    v-model:value="userSearch"
                    clearable
                    placeholder="Поиск по ФИО или email"
                    @keyup.enter="applyUserFilters"
                  />
                  <NSelect
                    v-model:value="userRoleFilter"
                    :options="[{ label: 'Все роли', value: '' }, ...roleOptions]"
                    clearable
                    placeholder="Роль"
                  />
                  <NSelect
                    v-model:value="userActiveFilter"
                    :options="activeFilterOptions"
                    placeholder="Статус"
                  />
                  <NButton type="primary" @click="applyUserFilters">Найти</NButton>
                  <NButton secondary @click="resetUserFilters">Сбросить</NButton>
                </div>

                <div class="t-table-wrap">
                  <NDataTable
                    :loading="usersLoading"
                    class="t-data-table"
                    :columns="columns"
                    :data="users"
                    :bordered="false"
                    size="small"
                    :row-key="(r: AdminUserDto) => r.id"
                    remote
                    :pagination="userPagination"
                    @update:page="(p: number) => { userPage = p; }"
                    @update:page-size="(s: number) => { userPageSize = s; userPage = 1; }"
                  />
                </div>
              </NSpace>
            </NCard>
          </NSpace>
      </div>

      <div v-show="activeTab === 'routes'">
          <NSpace vertical :size="16" style="margin-top:8px">
            <NCard title="Маршрут согласования (закупка/дефектный акт)" size="small" :loading="routesLoading">
              <NSpace vertical :size="10">
                <div
                  v-for="step in routeAssignments"
                  :key="step.role"
                  class="t-route-row"
                >
                  <NTag type="info">{{ step.roleLabel }}</NTag>
                  <NSelect
                    v-model:value="routeDraft[step.role]"
                    filterable
                    clearable
                    :options="userOptions"
                    placeholder="Выберите пользователя"
                  />
                </div>
              </NSpace>
              <NSpace style="margin-top:14px">
                <NButton type="primary" :loading="savingRoute" @click="saveRoute">Сохранить маршрут</NButton>
              </NSpace>
            </NCard>

            <NCard title="Проектные согласующие (РП/СБ)" size="small">
              <NSpace vertical :size="12">
                <NFormItem label="Проект">
                  <NSelect
                    v-model:value="selectedProjectId"
                    filterable
                    clearable
                    :options="projectOptions"
                    placeholder="Выберите проект"
                  />
                </NFormItem>
                <template v-if="selectedProjectId && projectRouteAssignments.length">
                  <div
                    v-for="step in projectRouteAssignments"
                    :key="`project-${step.role}`"
                    class="t-route-row"
                  >
                    <NTag type="warning">{{ step.roleLabel }}</NTag>
                    <NSelect
                      v-model:value="projectRouteDraft[step.role]"
                      filterable
                      clearable
                      :options="userOptions"
                      placeholder="Выберите пользователя"
                    />
                  </div>
                  <NSpace>
                    <NButton type="primary" :loading="savingProjectRoute" @click="saveProjectRoute">
                      Сохранить проектные назначения
                    </NButton>
                  </NSpace>
                </template>
              </NSpace>
            </NCard>

            <NCard title="Смена согласующего по документу" size="small">
              <NSpace vertical :size="12">
                <div class="t-doc-approver-filters">
                  <NFormItem label="Тип документа">
                    <NSelect
                      v-model:value="docType"
                      :options="[
                        { label: 'Дефектный акт', value: 'defect_act' },
                        { label: 'Заявка', value: 'purchase_request' }
                      ]"
                    />
                  </NFormItem>
                  <NFormItem label="ID документа">
                    <NInput v-model:value="docId" placeholder="GUID документа" />
                  </NFormItem>
                  <NButton type="primary" @click="loadDocumentApprovers">Загрузить</NButton>
                </div>

                <template v-if="docSettings">
                  <div
                    v-for="step in docSettings.assignments"
                    :key="`doc-${step.role}`"
                    class="t-route-row"
                  >
                    <NTag type="info">{{ step.roleLabel }}</NTag>
                    <NSelect
                      v-model:value="docDraft[step.role]"
                      filterable
                      clearable
                      :options="documentUserOptions"
                      placeholder="Выберите пользователя"
                    />
                  </div>
                  <NSpace>
                    <NButton type="primary" :loading="savingDocApprovers" @click="saveDocumentApprovers">
                      Сохранить согласующих документа
                    </NButton>
                  </NSpace>
                </template>
              </NSpace>
            </NCard>
          </NSpace>
      </div>
    </NSpace>
  </NCard>
</template>

<style scoped>
.t-admin-filters {
  display: grid;
  grid-template-columns: minmax(220px, 2fr) minmax(180px, 1fr) minmax(160px, 1fr) auto auto;
  gap: 12px;
  align-items: center;
}

.t-route-row {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 12px;
  align-items: center;
}

.t-doc-approver-filters {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 12px;
  align-items: end;
}

@media (max-width: 900px) {
  .t-admin-filters,
  .t-route-row,
  .t-doc-approver-filters {
    grid-template-columns: 1fr;
  }
}
</style>
