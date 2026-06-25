import type { GlobalThemeOverrides } from 'naive-ui';

export const brand = {
  orange: '#F4A627',
  orangeDark: '#D99120',
  orangeLight: '#FFF0D4',
  navy: '#25275F',
  navySoft: '#323568',
  navyDark: '#1A1C48',
  navyHover: '#323568',
  navyLight: '#3A3D78',
  text: '#1F2937',
  textMuted: '#64748B',
  border: '#E8EBF2',
  bg: '#F4F5F8',
  surfaceMuted: '#E8EBF2'
};

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: brand.orange,
    primaryColorHover: brand.orangeDark,
    primaryColorPressed: brand.orangeDark,
    primaryColorSuppl: brand.orangeDark,
    fontWeightStrong: '700',
    borderRadius: '8px',
    bodyColor: brand.bg
  },
  Card: {
    borderRadius: '12px',
    paddingMedium: '20px',
    paddingLarge: '24px'
  },
  Button: {
    fontWeight: '600',
    borderRadiusMedium: '8px'
  },
  DatePicker: {
    borderRadius: '8px'
  },
  Menu: {
    itemHeight: '48px',
    borderRadius: '8px'
  },
  Layout: {
    siderColor: brand.navy,
    headerColor: '#FFFFFF',
    color: brand.bg
  }
};
