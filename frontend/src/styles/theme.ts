import type { GlobalThemeOverrides } from 'naive-ui';

/** Synced with @tnsu/ui-kit-vue tokens (navy/gold V5) */
export const brand = {
  orange: '#D4A01E',
  orangeDark: '#B8881A',
  orangeLight: '#FDF5E0',
  navy: '#0F2440',
  navySoft: '#1B3A5C',
  navyDark: '#0A1B30',
  navyHover: '#244B73',
  navyLight: '#2D5C8A',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  bg: '#F3F4F6',
  surfaceMuted: '#E5E7EB'
};

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: brand.orange,
    primaryColorHover: brand.orangeDark,
    primaryColorPressed: brand.orangeDark,
    primaryColorSuppl: brand.orangeDark,
    fontFamily: "var(--tnsu-font-sans, 'Inter', -apple-system, 'Segoe UI', sans-serif)",
    fontFamilyMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
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
