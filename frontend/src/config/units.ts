export const MEASUREMENT_UNITS = [
  'шт.',
  'кг',
  'л',
  'м³',
  'м²',
  'пог. м',
  'комплект',
  'тн',
  'пара',
  'упаковка'
] as const;

export const unitOptions = MEASUREMENT_UNITS.map((value) => ({ label: value, value }));

export const repairTypeOptions = [
  { label: 'Плановый ремонт', value: 'planned' },
  { label: 'Аварийный ремонт', value: 'emergency' }
];

export const repairCategoryOptions = [
  { label: 'Капитальный ремонт', value: 'capital' },
  { label: 'Текущий ремонт', value: 'current' }
];
