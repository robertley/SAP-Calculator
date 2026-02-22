import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { getEquipmentIconPath, getPetIconPath } from 'app/runtime/asset-catalog';

export function buildBoardStateMessage(
  player: Player,
  opponent: Player,
  getFrontIndex: (pet: Pet) => number | null,
  isAilmentName: (name: string) => boolean,
): string {
  let playerState = '';
  playerState += renderPetText(player.pet4, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet3, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet2, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet1, getFrontIndex, isAilmentName);
  playerState += renderPetText(player.pet0, getFrontIndex, isAilmentName);

  let opponentState = '';
  opponentState += renderPetText(opponent.pet0, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet1, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet2, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet3, getFrontIndex, isAilmentName);
  opponentState += renderPetText(opponent.pet4, getFrontIndex, isAilmentName);

  return `${playerState}| ${opponentState}`;
}

function renderPetText(
  pet: Pet | undefined,
  getFrontIndex: (pet: Pet) => number | null,
  isAilmentName: (name: string) => boolean,
): string {
  if (pet == null) {
    return '___ (-/-) ';
  }
  const index = getFrontIndex(pet);
  const label = index != null ? `${pet.parent?.isOpponent ? 'O' : 'P'}${index} ` : '';
  const iconPath = getPetIconPath(pet.name);
  const petDisplay = iconPath
    ? `<img src="${iconPath}" class="log-pet-icon" alt="${pet.name}">`
    : '';
  const equipmentName =
    typeof (pet.equipment as { name?: string })?.name === 'string'
      ? (pet.equipment as { name?: string }).name
      : null;
  const equipmentDisplay = equipmentName
    ? (() => {
        const isAilment = isAilmentName(equipmentName);
        const primary =
          getEquipmentIconPath(equipmentName, isAilment) ??
          getEquipmentIconPath(equipmentName, !isAilment);
        if (!primary) {
          return '';
        }
        const secondary = getEquipmentIconPath(equipmentName, !isAilment);
        const secondaryAttr = secondary
          ? `this.dataset.step='1';this.src='${secondary}';`
          : `this.dataset.step='1';`;
        return `<img src="${primary}" class="log-inline-icon" alt="${equipmentName}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove()">`;
      })()
    : '';
  const manaValue = Number.isFinite(pet.mana) ? Math.max(0, Math.trunc(pet.mana)) : 0;
  const manaSuffix = manaValue > 0 ? `/${manaValue}mana` : '';

  return `${label}${petDisplay}${equipmentDisplay}(${pet.attack}/${pet.health}/${pet.exp}xp${manaSuffix}) `;
}
