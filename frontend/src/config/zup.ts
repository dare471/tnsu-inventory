export const EMPLOYER_COMPANY_OPTIONS = [
  { label: 'ТОО TANSU Construction', value: 'tansu_construction' },
  { label: 'ТОО KazPromService', value: 'kazprom_service' }
];

export type ZupEmployee = {
  externalId: string;
  fullName: string;
  position: string;
  email: string;
  department?: string;
  mobile?: string;
};
