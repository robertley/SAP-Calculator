import { FormArray } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { getPetIconPath, getToyIconPath } from 'app/runtime/asset-catalog';
import { TOY_ART_BASE } from './app.ui.constants';
import { AppUiContext, getEquipmentNamesForPack } from './app.component.ui-common';

export function randomizePlayerPets(ctx: AppUiContext, player: Player): void {
  for (let i = 0; i < 5; i++) {
    const pet = ctx.petService.getRandomPet(player);
    pet.equipment = getRandomEquipment(ctx, player);
    player.setPet(i, pet, true);
  }
}

export function randomizePlayerToy(ctx: AppUiContext, player: Player): void {
  const toyName = getRandomToyName(ctx);
  const isPlayer = player === ctx.player;
  const controlName = isPlayer ? 'playerToy' : 'opponentToy';
  if (!toyName) {
    ctx.formGroup.get(controlName).setValue(null);
    player.toy = null;
    player.originalToy = null;
    setToyImage(ctx, player, null);
    return;
  }
  ctx.formGroup.get(controlName).setValue(toyName);
  updatePlayerToy(ctx, player, toyName);
}

export function updatePlayerPack(
  ctx: AppUiContext,
  player: Player,
  pack: string,
  randomize: boolean = true,
): void {
  player.pack = pack as Player['pack'];
  const allPetsSelected = ctx.formGroup.get('allPets').value;
  if (randomize && !allPetsSelected) {
    clearPlayerToy(ctx, player);
  }
  let petPool;
  switch (pack) {
    case 'Turtle':
      petPool = ctx.petService.turtlePackPets;
      break;
    case 'Puppy':
      petPool = ctx.petService.puppyPackPets;
      break;
    case 'Star':
      petPool = ctx.petService.starPackPets;
      break;
    case 'Golden':
      petPool = ctx.petService.goldenPackPets;
      break;
    case 'Unicorn':
      petPool = ctx.petService.unicornPackPets;
      break;
    case 'Danger':
      petPool = ctx.petService.dangerPackPets;
      break;
    default:
      petPool = ctx.petService.playerCustomPackPets.get(pack);
      if (!petPool) {
        ctx.formGroup.get('allPets').setValue(true, { emitEvent: false });
        petPool = ctx.petService.allPets;
      }
      break;
  }
  if (player == ctx.player) {
    ctx.gameService.setTierGroupPets(petPool, null);
  } else {
    ctx.gameService.setTierGroupPets(null, petPool);
  }
  if (ctx.formGroup.get('allPets').value) {
    return;
  }
  if (randomize) {
    // this.randomize(player);
  }
}

export function updatePlayerToy(
  ctx: AppUiContext,
  player: Player,
  toy: string | null,
): void {
  if (!toy) {
    player.toy = null;
    player.originalToy = null;
    setToyImage(ctx, player, null);
    return;
  }
  let levelControlName;
  if (player == ctx.player) {
    levelControlName = 'playerToyLevel';
  }
  if (player == ctx.opponent) {
    levelControlName = 'opponentToyLevel';
  }
  const level = Number(ctx.formGroup.get(levelControlName).value);
  player.toy = ctx.toyService.createToy(toy, player, level);
  player.originalToy = player.toy;
  setToyImage(ctx, player, toy);
}

export function clearPlayerToy(ctx: AppUiContext, player: Player): void {
  const isPlayer = player === ctx.player;
  const controlName = isPlayer ? 'playerToy' : 'opponentToy';
  ctx.formGroup.get(controlName).setValue(null);
  player.toy = null;
  player.originalToy = null;
  setToyImage(ctx, player, null);
}

export function setToyImage(
  ctx: AppUiContext,
  player: Player,
  toyName: string | null,
): void {
  const nameId = ctx.toyService.getToyNameId(toyName);
  const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
  if (player == ctx.player) {
    ctx.playerToyImageUrl = imageUrl;
  } else if (player == ctx.opponent) {
    ctx.opponentToyImageUrl = imageUrl;
  }
}

export function setHardToyImage(
  ctx: AppUiContext,
  player: Player,
  toyName: string | null,
): void {
  const nameId = ctx.toyService.getToyNameId(toyName);
  const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
  if (player == ctx.player) {
    ctx.playerHardToyImageUrl = imageUrl;
  } else if (player == ctx.opponent) {
    ctx.opponentHardToyImageUrl = imageUrl;
  }
}

export function updatePreviousShopTier(ctx: AppUiContext, turn: number): void {
  let tier = 1;
  if (turn > 2) {
    tier = 2;
  }
  if (turn > 4) {
    tier = 3;
  }
  if (turn > 6) {
    tier = 4;
  }
  if (turn > 8) {
    tier = 5;
  }
  if (turn > 10) {
    tier = 6;
  }
  ctx.gameService.setPreviousShopTier(tier);
  ctx.gameService.setTurnNumber(turn);
}

export function updateGoldSpent(
  ctx: AppUiContext,
  player: number | null,
  opponent: number | null,
): void {
  ctx.gameService.setGoldSpent(player, opponent);
}

export function updateToyLevel(
  ctx: AppUiContext,
  player: Player,
  level: number,
): void {
  if (player.toy) {
    player.toy.level = level;
  }
}

export function getRandomEquipment(
  ctx: AppUiContext,
  player?: Player,
) {
  const equipment = Array.from(
    ctx.equipmentService.getInstanceOfAllEquipment().values(),
  ).filter((equip) => equip?.name !== 'Corncob');
  const allPetsSelected = ctx.formGroup?.get('allPets')?.value;
  let filteredEquipment = equipment;
  if (!allPetsSelected) {
    const packName = player?.pack ?? ctx.player?.pack ?? null;
    const equipmentNames = getEquipmentNamesForPack(packName);
    if (equipmentNames && equipmentNames.size > 0) {
      filteredEquipment = equipment.filter((equip) =>
        equipmentNames.has(equip?.name),
      );
    }
  }
  const allowAilments = ctx.formGroup?.get('ailmentEquipment')?.value;
  const ailments = allowAilments
    ? Array.from(ctx.equipmentService.getInstanceOfAllAilments().values())
    : [];
  const options = filteredEquipment.concat(ailments);
  if (options.length === 0) {
    return null;
  }
  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
}

export function getRandomToyName(ctx: AppUiContext): string | null {
  const toyMap = ctx.toyService.getToysByType(0);
  const options: Array<string | null> = [];
  toyMap.forEach((toyNames) => {
    toyNames.forEach((name) => {
      if (name) {
        options.push(name);
      }
    });
  });
  options.push(null);
  if (!options.length) {
    return null;
  }
  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
}

export function getValidCustomPacks(ctx: AppUiContext) {
  const formArray = ctx.formGroup.get('customPacks') as FormArray;
  const validFormGroups = [];
  for (const formGroup of formArray.controls) {
    if (formGroup.valid) {
      validFormGroups.push(formGroup);
    }
  }
  return validFormGroups;
}

export function getToyIcon(toy: string): string {
  return getToyIconPath(toy) ?? '';
}

export function getSelectedTeam(ctx: AppUiContext) {
  return ctx.savedTeams.find((team) => team.id === ctx.selectedTeamId);
}

export function getSelectedTeamName(ctx: AppUiContext): string {
  return getSelectedTeam(ctx)?.name || 'Saved teams';
}

export function getSelectedTeamPreviewIcons(ctx: AppUiContext): string[] {
  const pets = getSelectedTeam(ctx)?.pets || [];
  return pets
    .slice(0, 5)
    .map((pet) => getPetIconPath(pet?.name))
    .filter(Boolean);
}

export function getToyOptionStyle(toy: string | null) {
  if (!toy) {
    return {};
  }
  const icon = getToyIconPath(toy);
  return {
    'background-image': `url(${icon})`,
    'background-repeat': 'no-repeat',
    'background-size': '20px 20px',
    'background-position': 'left center',
    'padding-left': '2rem',
  };
}

