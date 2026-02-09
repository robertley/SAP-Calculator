export type SelectionType =
  | 'pet'
  | 'equipment'
  | 'swallowed-pet'
  | 'toy'
  | 'hard-toy'
  | 'pack'
  | 'team';

export type SelectionItemType =
  | 'pet'
  | 'equipment'
  | 'ailment'
  | 'toy'
  | 'hard-toy'
  | 'pack'
  | 'team';

export interface SelectionItem {
  id?: string | number;
  name: string;
  displayName?: string;
  tier?: number;
  pack?: string;
  icon?: string | null;
  icons?: string[];
  tooltip?: string | null;
  type: SelectionItemType;
  category?: string;
  item?: unknown;
}
