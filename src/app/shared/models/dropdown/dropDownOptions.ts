export enum DropdownIcon {
  Eye = 'eye',
  Trash = 'trash'
}

export type DropdownOption = {
  label: string;
  icon?: DropdownIcon;
  class?: string;
  action: () => void;
};
