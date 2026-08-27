import type { DefineComponent, Component } from 'vue';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: Component;
}

type AnyComponent = DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;

export const Button: AnyComponent;
export const Alert: AnyComponent;
export const Badge: AnyComponent;
export const FormCard: AnyComponent;
export const FormGrid: AnyComponent;
export const FormField: AnyComponent;
export const FormActions: AnyComponent;
export const TextInput: AnyComponent;
export const TextArea: AnyComponent;
export const Select: AnyComponent;
export const Toggle: AnyComponent;
export const Sidebar: AnyComponent;
export const SidebarToggle: AnyComponent;
