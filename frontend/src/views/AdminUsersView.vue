<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue';
import {
  NAlert, NButton, NCard, NDataTable, NForm, NFormItem, NInput, NSelect, NSpace, NSwitch, NTag, type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type AdminUserDto, type ApprovalRouteAssignmentDto, type AdminUserOptionDto, type ZupEmployeeDto } from '@/api/inventory';
import { toApiError } from '@/api/client';
import { MECHANIZATION_ROLES } from '@/config/roles';
import { EMPLOYER_COMPANY_OPTIONS } from '@/config/zup';

const loading = ref(true);
const savingRoute = ref(false);
const error = ref('');
const success = ref('');
const users = ref<AdminUserDto[]>([]);
const routeAssignments = ref<ApprovalRouteAssignmentDto[]>([]);
const routeUsers = ref<AdminUserOptionDto[]>([]);

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

const routeDraft = reactive<Record<string, string>>({});

const userOptions = computed(() =>
  routeUsers.value.map((u) => ({
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

async function loadAll() {
  loading.value = true;
  error.value = '';
  try {
    const [userList, route] = await Promise.all([
      inventoryApi.listAdminUsers(),
      inventoryApi.getApprovalRoute()
    ]);
    users.value = userList;
    routeAssignments.value = route.assignments;
    routeUsers.value = route.users;
    hydrateRouteDraft();
  } catch (e) {
    error.value = toApiError(e).detail;
  } finally {
    loading.value = false;
  }
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
    await loadAll();
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
    await loadAll();
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
    await loadAll();
  } catch (e) {
    error.value = toApiError(e).detail || (e as Error).message;
  } finally {
    savingRoute.value = false;
  }
}

const columns: DataTableColumns<AdminUserDto> = [
  { title: 'Email', key: 'email' },
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
    render: (row) =>
      h(NSwitch, {
        value: row.isActive,
        onUpdateValue: (v: boolean) => { row.isActive = v; }
      })
  },
  {
    title: 'Действие',
    key: 'actions',
    render: (row) =>
      h(NButton, { size: 'small', type: 'primary', onClick: () => void saveUser(row) }, { default: () => 'Сохранить' })
  }
];

onMounted(() => {
  void loadAll();
});
</script>

<template>
  <NCard title="Администрирование пользователей и маршрута">
    <NSpace vertical :size="16">
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
      <NAlert v-if="success" type="success">{{ success }}</NAlert>

      <NCard title="Добавить пользователя" size="small">
        <p style="margin:0 0 12px;color:var(--brand-text-muted)">
          Данные подтягиваются из ЗУП: выберите компанию и сотрудника.
        </p>
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

      <NCard title="Пользователи" size="small">
        <NDataTable
          :loading="loading"
          class="t-data-table"
          :columns="columns"
          :data="users"
          :bordered="false"
          size="small"
          :row-key="(r: AdminUserDto) => r.id"
        />
      </NCard>

      <NCard title="Маршрут согласования (закупка/дефектный акт)" size="small">
        <p style="margin:0 0 12px;color:var(--brand-text-muted)">
          Для каждого шага выберите ровно одного активного пользователя.
        </p>
        <NSpace vertical :size="10">
          <div
            v-for="step in routeAssignments"
            :key="step.role"
            style="display:grid;grid-template-columns:240px 1fr;gap:12px;align-items:center"
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
    </NSpace>
  </NCard>
</template>
