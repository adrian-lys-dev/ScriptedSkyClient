export enum DropdownIcon {
  Eye = 'eye',
  Trash = 'trash',
  Check = 'check',
  Done = 'done'
}

export type DropdownOption = {
  label: string;
  icon?: DropdownIcon;
  class?: string;
  iconHover?: string;
  action: () => void;
};
