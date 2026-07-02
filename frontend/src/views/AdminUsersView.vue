<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue';
import {
  NAlert, NButton, NCard, NDataTable, NForm, NFormItem, NInput, NSelect, NSpace, NSwitch, NTag, type DataTableColumns
} from 'naive-ui';
import { inventoryApi, type AdminUserDto, type ApprovalRouteAssignmentDto, type AdminUserOptionDto } from '@/api/inventory';
import { toApiError } from '@/api/client';
import { MECHANIZATION_ROLES } from '@/config/roles';

const loading = ref(true);
const savingRoute = ref(false);
const error = ref('');
const success = ref('');
const users = ref<AdminUserDto[]>([]);
const routeAssignments = ref<ApprovalRouteAssignmentDto[]>([]);
const routeUsers = ref<AdminUserOptionDto[]>([]);

const createForm = reactive({
  email: '',
  fullName: '',
  role: 'site_mechanic',
  isActive: true
});
const creating = ref(false);

const roleOptions = MECHANIZATION_ROLES.map((r) => ({ label: r.label, value: r.value }));

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
  creating.value = true;
  error.value = '';
  success.value = '';
  try {
    await inventoryApi.createAdminUser({
      email: createForm.email,
      fullName: createForm.fullName,
      role: createForm.role,
      isActive: createForm.isActive
    });
    createForm.email = '';
    createForm.fullName = '';
    createForm.role = 'site_mechanic';
    createForm.isActive = true;
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
        <NForm label-placement="left" :label-width="130">
          <NFormItem label="Email">
            <NInput v-model:value="createForm.email" placeholder="user@tnsukz.onmicrosoft.com" />
          </NFormItem>
          <NFormItem label="ФИО">
            <NInput v-model:value="createForm.fullName" />
          </NFormItem>
          <NFormItem label="Роль">
            <NSelect v-model:value="createForm.role" :options="roleOptions" />
          </NFormItem>
          <NFormItem label="Активен">
            <NSwitch v-model:value="createForm.isActive" />
          </NFormItem>
          <NButton type="primary" :loading="creating" @click="createUser">Добавить</NButton>
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
