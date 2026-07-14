export const MECHANIZATION_ROLES = [
  { value: 'site_mechanic', label: 'Механик участка' },
  { value: 'project_storekeeper', label: 'Кладовщик проекта' },
  { value: 'security', label: 'СБ' },
  { value: 'project_manager', label: 'РП / Начальник участка' },
  { value: 'warehouse_coordinator', label: 'Координатор складского хозяйства' },
  { value: 'chief_mechanic', label: 'Главный механик' },
  { value: 'commercial_director', label: 'Коммерческий директор' },
  { value: 'executor', label: 'Исполнитель' },
  { value: 'omts_head', label: 'Руководитель ОМТС' },
  { value: 'omts_specialist', label: 'Специалист ОМТС' }
] as const;

export const ADMIN_ROLES = new Set(['chief_mechanic', 'omts_head', 'commercial_director']);
