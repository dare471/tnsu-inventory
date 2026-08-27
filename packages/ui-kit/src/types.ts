export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SidebarItem {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}
