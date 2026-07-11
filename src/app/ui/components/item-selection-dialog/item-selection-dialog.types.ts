export type SelectionType =
  | 'pet'
  | 'equipment'
  | 'swallowed-pet'
  | 'toy'
  | 'hard-toy'
  | 'pack'
  | 'team'
  | 'ability';

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
  /** When true, item is shown greyed out (warns user it's a non-vanilla feature) */
  isDisabled?: boolean;
}

export function shouldShowNoneSelection(
  type: SelectionType,
  searchQuery: string,
): boolean {
  return (
    type !== 'swallowed-pet' &&
    type !== 'pack' &&
    type !== 'team' &&
    searchQuery.trim().length === 0
  );
}
