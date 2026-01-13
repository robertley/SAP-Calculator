export const PACK_NAMES = [
  'Turtle',
  'Puppy',
  'Star',
  'Golden',
  'Unicorn',
  'Danger',
  'Custom',
] as const;

export type PackName = typeof PACK_NAMES[number];

export type BasePackName = Exclude<PackName, 'Custom'>;

export const BASE_PACK_NAMES: BasePackName[] = PACK_NAMES.filter(
  (pack): pack is BasePackName => pack !== 'Custom',
);
