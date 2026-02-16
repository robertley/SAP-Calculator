import { Pet } from 'app/domain/entities/pet.class';

export function formatPetScopedRandomLabel(
  owner: Pet | null | undefined,
  baseLabel: string,
  occurrence?: number,
): string {
  const normalizedLabel = `${baseLabel ?? ''}`.trim() || 'Random event';
  const suffix =
    Number.isFinite(occurrence) && Number(occurrence) > 0
      ? ` ${Math.trunc(Number(occurrence))}`
      : '';
  if (!owner) {
    return `${normalizedLabel}${suffix}`;
  }

  const side = owner.parent?.isOpponent ? 'O' : 'P';
  const positionValue =
    owner.savedPosition ?? owner.position ?? Number.NaN;
  const position = Number.isFinite(positionValue)
    ? Math.trunc(positionValue) + 1
    : 0;
  return `(${side}${position}) ${normalizedLabel}${suffix}`;
}

export function formatEquipmentScopedRandomLabel(
  owner: Pet | null | undefined,
  equipmentName: string,
  actionLabel: string,
  occurrence?: number,
): string {
  const normalizedEquipment = `${equipmentName ?? ''}`.trim() || 'Equipment';
  const normalizedAction = `${actionLabel ?? ''}`.trim() || 'random event';
  const suffix =
    Number.isFinite(occurrence) && Number(occurrence) > 0
      ? ` ${Math.trunc(Number(occurrence))}`
      : '';
  if (!owner) {
    return `${normalizedEquipment} ${normalizedAction}${suffix}`;
  }

  const side = owner.parent?.isOpponent ? 'O' : 'P';
  const positionValue = owner.savedPosition ?? owner.position ?? Number.NaN;
  const position = Number.isFinite(positionValue)
    ? Math.trunc(positionValue) + 1
    : 0;
  const ownerName = `${owner.name ?? ''}`.trim() || 'Unknown';

  return `(${side}${position}) ${normalizedEquipment} (${ownerName}) ${normalizedAction}${suffix}`;
}
