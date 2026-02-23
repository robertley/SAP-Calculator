import { FormArray, FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { PetService } from 'app/integrations/pet/pet.service';
import {
  TeamPreset,
  TeamPresetsService,
} from 'app/integrations/team-presets.service';
import { cloneEquipment } from 'app/runtime/equipment-clone';
import { PetForm } from 'app/integrations/pet/pet-factory.service';

export function saveTeamPreset(options: {
  side: 'player' | 'opponent';
  teamName: string;
  formGroup: FormGroup;
  savedTeams: TeamPreset[];
  selectedTeamId: string;
  teamPresetsService: TeamPresetsService;
}): { savedTeams: TeamPreset[]; selectedTeamId: string; teamName: string } {
  const name = options.teamName?.trim();
  if (!name) {
    return {
      savedTeams: options.savedTeams,
      selectedTeamId: options.selectedTeamId,
      teamName: options.teamName,
    };
  }

  const pets = buildTeamFromSide(options.formGroup, options.side);
  const playerToyName = options.formGroup.get('playerToy').value ?? null;
  const playerToyLevel = Number(options.formGroup.get('playerToyLevel').value);
  const opponentToyName = options.formGroup.get('opponentToy').value ?? null;
  const opponentToyLevel = Number(
    options.formGroup.get('opponentToyLevel').value,
  );
  const playerHardToy = options.formGroup.get('playerHardToy').value ?? null;
  const playerHardToyLevel = Number(
    options.formGroup.get('playerHardToyLevel').value,
  );
  const opponentHardToy =
    options.formGroup.get('opponentHardToy').value ?? null;
  const opponentHardToyLevel = Number(
    options.formGroup.get('opponentHardToyLevel').value,
  );
  const turn = Number(options.formGroup.get('turn').value);
  const playerGoldSpent = Number(
    options.formGroup.get('playerGoldSpent').value,
  );
  const opponentGoldSpent = Number(
    options.formGroup.get('opponentGoldSpent').value,
  );
  const allPets = Boolean(options.formGroup.get('allPets').value);
  const tokenPets = Boolean(options.formGroup.get('tokenPets').value);
  const komodoShuffle = Boolean(options.formGroup.get('komodoShuffle').value);
  const mana = Boolean(options.formGroup.get('mana').value);
  const seedValue = options.formGroup.get('seed')?.value;
  const seed =
    seedValue === '' || seedValue == null ? null : Number(seedValue);
  const triggersConsumed = Boolean(
    options.formGroup.get('triggersConsumed').value,
  );
  const changeEquipmentUses = Boolean(
    options.formGroup.get('changeEquipmentUses').value,
  );
  const playerRollAmount = Number(
    options.formGroup.get('playerRollAmount').value,
  );
  const opponentRollAmount = Number(
    options.formGroup.get('opponentRollAmount').value,
  );
  const playerLevel3Sold = Number(
    options.formGroup.get('playerLevel3Sold').value,
  );
  const opponentLevel3Sold = Number(
    options.formGroup.get('opponentLevel3Sold').value,
  );
  const playerSummonedAmount = Number(
    options.formGroup.get('playerSummonedAmount').value,
  );
  const opponentSummonedAmount = Number(
    options.formGroup.get('opponentSummonedAmount').value,
  );
  const playerTransformationAmount = Number(
    options.formGroup.get('playerTransformationAmount').value,
  );
  const opponentTransformationAmount = Number(
    options.formGroup.get('opponentTransformationAmount').value,
  );

  const existing = options.savedTeams.find(
    (team) => team.name.toLowerCase() === name.toLowerCase(),
  );
  if (existing) {
    existing.pets = pets;
    existing.name = name;
    existing.playerToyName = playerToyName;
    existing.playerToyLevel = playerToyLevel;
    existing.opponentToyName = opponentToyName;
    existing.opponentToyLevel = opponentToyLevel;
    existing.playerHardToy = playerHardToy;
    existing.playerHardToyLevel = playerHardToyLevel;
    existing.opponentHardToy = opponentHardToy;
    existing.opponentHardToyLevel = opponentHardToyLevel;
    existing.turn = turn;
    existing.playerGoldSpent = playerGoldSpent;
    existing.opponentGoldSpent = opponentGoldSpent;
    existing.allPets = allPets;
    existing.tokenPets = tokenPets;
    existing.komodoShuffle = komodoShuffle;
    existing.mana = mana;
    existing.seed = Number.isFinite(seed) ? Math.trunc(seed) : null;
    existing.triggersConsumed = triggersConsumed;
    existing.changeEquipmentUses = changeEquipmentUses;
    existing.playerRollAmount = playerRollAmount;
    existing.opponentRollAmount = opponentRollAmount;
    existing.playerLevel3Sold = playerLevel3Sold;
    existing.opponentLevel3Sold = opponentLevel3Sold;
    existing.playerSummonedAmount = playerSummonedAmount;
    existing.opponentSummonedAmount = opponentSummonedAmount;
    existing.playerTransformationAmount = playerTransformationAmount;
    existing.opponentTransformationAmount = opponentTransformationAmount;
  } else {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    options.savedTeams.push({
      id,
      name,
      pets,
      createdAt: Date.now(),
      playerToyName,
      playerToyLevel,
      opponentToyName,
      opponentToyLevel,
      playerHardToy,
      playerHardToyLevel,
      opponentHardToy,
      opponentHardToyLevel,
      turn,
      playerGoldSpent,
      opponentGoldSpent,
      allPets,
      tokenPets,
      komodoShuffle,
      mana,
      seed: Number.isFinite(seed) ? Math.trunc(seed) : null,
      triggersConsumed,
      changeEquipmentUses,
      playerRollAmount,
      opponentRollAmount,
      playerLevel3Sold,
      opponentLevel3Sold,
      playerSummonedAmount,
      opponentSummonedAmount,
      playerTransformationAmount,
      opponentTransformationAmount,
    });
    options.selectedTeamId = id;
  }

  options.teamPresetsService.persistTeams(options.savedTeams);

  return {
    savedTeams: options.savedTeams,
    selectedTeamId: options.selectedTeamId,
    teamName: '',
  };
}

export function loadTeamPreset(options: {
  side: 'player' | 'opponent';
  selectedTeamId: string;
  savedTeams: TeamPreset[];
  formGroup: FormGroup;
  player: Player;
  opponent: Player;
  petService: PetService;
  equipmentService: EquipmentService;
  initPetForms: () => void;
}): void {
  const team = options.savedTeams.find(
    (entry) => entry.id === options.selectedTeamId,
  );
  if (!team) {
    return;
  }
  if (team.turn != null) {
    options.formGroup.get('turn').setValue(team.turn);
  }
  if (team.playerGoldSpent != null) {
    options.formGroup.get('playerGoldSpent').setValue(team.playerGoldSpent);
  }
  if (team.opponentGoldSpent != null) {
    options.formGroup.get('opponentGoldSpent').setValue(team.opponentGoldSpent);
  }
  if (team.allPets != null) {
    options.formGroup.get('allPets').setValue(team.allPets);
  }
  options.formGroup.get('tokenPets').setValue(true);
  if (team.komodoShuffle != null) {
    options.formGroup.get('komodoShuffle').setValue(team.komodoShuffle);
  }
  if (team.mana != null) {
    options.formGroup.get('mana').setValue(team.mana);
  }
  if (team.seed != null || team.seed === null) {
    options.formGroup.get('seed')?.setValue(team.seed ?? null);
  }
  if (team.triggersConsumed != null) {
    options.formGroup.get('triggersConsumed').setValue(team.triggersConsumed);
  }
  if (team.changeEquipmentUses != null) {
    options.formGroup
      .get('changeEquipmentUses')
      .setValue(team.changeEquipmentUses);
  }
  if (team.playerRollAmount != null) {
    options.formGroup.get('playerRollAmount').setValue(team.playerRollAmount);
  } else if (team.rollAmount != null && options.side === 'player') {
    options.formGroup.get('playerRollAmount').setValue(team.rollAmount);
  }
  if (team.opponentRollAmount != null) {
    options.formGroup
      .get('opponentRollAmount')
      .setValue(team.opponentRollAmount);
  } else if (team.rollAmount != null && options.side === 'opponent') {
    options.formGroup.get('opponentRollAmount').setValue(team.rollAmount);
  }
  if (team.playerLevel3Sold != null) {
    options.formGroup.get('playerLevel3Sold').setValue(team.playerLevel3Sold);
  }
  if (team.opponentLevel3Sold != null) {
    options.formGroup
      .get('opponentLevel3Sold')
      .setValue(team.opponentLevel3Sold);
  }
  if (team.playerSummonedAmount != null) {
    options.formGroup
      .get('playerSummonedAmount')
      .setValue(team.playerSummonedAmount);
  }
  if (team.opponentSummonedAmount != null) {
    options.formGroup
      .get('opponentSummonedAmount')
      .setValue(team.opponentSummonedAmount);
  }
  if (team.playerTransformationAmount != null) {
    options.formGroup
      .get('playerTransformationAmount')
      .setValue(team.playerTransformationAmount);
  } else if (team.transformationAmount != null && options.side === 'player') {
    options.formGroup
      .get('playerTransformationAmount')
      .setValue(team.transformationAmount);
  }
  if (team.opponentTransformationAmount != null) {
    options.formGroup
      .get('opponentTransformationAmount')
      .setValue(team.opponentTransformationAmount);
  } else if (team.transformationAmount != null && options.side === 'opponent') {
    options.formGroup
      .get('opponentTransformationAmount')
      .setValue(team.transformationAmount);
  }
  if (team.transformationAmount != null) {
    const transformControl =
      options.side === 'player'
        ? 'playerTransformationAmount'
        : 'opponentTransformationAmount';
    options.formGroup.get(transformControl).setValue(team.transformationAmount);
  }
  const playerToy = resolvePresetToy(
    {
      name: team.playerToyName,
      level: team.playerToyLevel,
    },
    {
      name: team.toyName,
      level: team.toyLevel,
    },
    {
      name: team.opponentToyName,
      level: team.opponentToyLevel,
    },
  );
  const opponentToy = resolvePresetToy(
    {
      name: team.opponentToyName,
      level: team.opponentToyLevel,
    },
    {
      name: team.toyName,
      level: team.toyLevel,
    },
    {
      name: team.playerToyName,
      level: team.playerToyLevel,
    },
  );

  if (options.side === 'player') {
    options.formGroup.get('playerToy').setValue(playerToy.name);
    options.formGroup.get('playerToyLevel').setValue(playerToy.level);
  } else {
    options.formGroup.get('opponentToy').setValue(opponentToy.name);
    options.formGroup.get('opponentToyLevel').setValue(opponentToy.level);
  }

  if (team.playerHardToy != null) {
    options.formGroup.get('playerHardToy').setValue(team.playerHardToy);
  }
  if (team.playerHardToyLevel != null) {
    options.formGroup
      .get('playerHardToyLevel')
      .setValue(team.playerHardToyLevel);
  }
  if (team.opponentHardToy != null) {
    options.formGroup.get('opponentHardToy').setValue(team.opponentHardToy);
  }
  if (team.opponentHardToyLevel != null) {
    options.formGroup
      .get('opponentHardToyLevel')
      .setValue(team.opponentHardToyLevel);
  }

  const targetPlayer =
    options.side === 'player' ? options.player : options.opponent;
  const equipment = options.equipmentService.getInstanceOfAllEquipment();
  const ailments = options.equipmentService.getInstanceOfAllAilments();

  for (let i = 0; i < 5; i++) {
    const petData = team.pets?.[i];
    if (!petData?.name) {
      targetPlayer.setPet(i, null, true);
      continue;
    }
    const equipmentName =
      typeof petData.equipment === 'string'
        ? petData.equipment
        : petData.equipment?.name;
    const equipmentObj = equipmentName
      ? (equipment.get(equipmentName) ?? ailments.get(equipmentName))
      : null;
    const equipmentForPet = equipmentObj ? cloneEquipment(equipmentObj) : null;
    if (equipmentForPet) {
      const usesValue = petData.equipmentUses ?? equipmentForPet.uses;
      if (usesValue != null) {
        equipmentForPet.uses = usesValue;
        equipmentForPet.originalUses = usesValue;
      }
    }
    const pet = options.petService.createPet(
      {
        name: petData.name,
        attack: petData.attack ?? 0,
        health: petData.health ?? 0,
        exp: petData.exp ?? 0,
        equipment: equipmentForPet ?? null,
        belugaSwallowedPet: petData.belugaSwallowedPet ?? null,
        sarcasticFringeheadSwallowedPet:
          petData.sarcasticFringeheadSwallowedPet ?? null,
        mana: petData.mana ?? 0,
        triggersConsumed: petData.triggersConsumed ?? 0,
        foodsEaten: petData.foodsEaten ?? 0,
        abominationSwallowedPet1: petData.abominationSwallowedPet1 ?? null,
        abominationSwallowedPet2: petData.abominationSwallowedPet2 ?? null,
        abominationSwallowedPet3: petData.abominationSwallowedPet3 ?? null,
        abominationSwallowedPet1BelugaSwallowedPet:
          petData.abominationSwallowedPet1BelugaSwallowedPet ?? null,
        abominationSwallowedPet2BelugaSwallowedPet:
          petData.abominationSwallowedPet2BelugaSwallowedPet ?? null,
        abominationSwallowedPet3BelugaSwallowedPet:
          petData.abominationSwallowedPet3BelugaSwallowedPet ?? null,
        abominationSwallowedPet1SarcasticFringeheadSwallowedPet:
          petData.abominationSwallowedPet1SarcasticFringeheadSwallowedPet ??
          null,
        abominationSwallowedPet2SarcasticFringeheadSwallowedPet:
          petData.abominationSwallowedPet2SarcasticFringeheadSwallowedPet ??
          null,
        abominationSwallowedPet3SarcasticFringeheadSwallowedPet:
          petData.abominationSwallowedPet3SarcasticFringeheadSwallowedPet ??
          null,
        abominationSwallowedPet1Level:
          petData.abominationSwallowedPet1Level ?? 1,
        abominationSwallowedPet2Level:
          petData.abominationSwallowedPet2Level ?? 1,
        abominationSwallowedPet3Level:
          petData.abominationSwallowedPet3Level ?? 1,
        abominationSwallowedPet1TimesHurt:
          petData.abominationSwallowedPet1TimesHurt ?? 0,
        abominationSwallowedPet2TimesHurt:
          petData.abominationSwallowedPet2TimesHurt ?? 0,
        abominationSwallowedPet3TimesHurt:
          petData.abominationSwallowedPet3TimesHurt ?? 0,
        friendsDiedBeforeBattle: petData.friendsDiedBeforeBattle ?? 0,
        battlesFought: petData.battlesFought ?? 0,
        timesHurt: petData.timesHurt ?? 0,
      },
      targetPlayer,
    );
    targetPlayer.setPet(i, pet, true);
  }

  options.initPetForms();
  applyTeamEquipmentUses(options.formGroup, options.side, team.pets);
}

function buildTeamFromSide(
  formGroup: FormGroup,
  side: 'player' | 'opponent',
): PetForm[] {
  const key = side === 'player' ? 'playerPets' : 'opponentPets';
  const formArray = formGroup.get(key) as FormArray;
  return formArray.controls.map((control) =>
    sanitizePetFormValue(control.value),
  ).filter((pet): pet is PetForm => pet !== null);
}

function sanitizePetFormValue(petValue: unknown): PetForm | null {
  if (!petValue || typeof petValue !== 'object') {
    return null;
  }
  const petRecord = petValue as Record<string, unknown>;
  if (!petRecord.name) {
    return null;
  }
  const equipmentName =
    typeof petRecord.equipment === 'string'
      ? petRecord.equipment
      : typeof (petRecord.equipment as { name?: unknown })?.name === 'string'
        ? (petRecord.equipment as { name: string }).name
        : null;
  return {
    name: String(petRecord.name),
    attack: (petRecord.attack as number | null) ?? 0,
    health: (petRecord.health as number | null) ?? 0,
    exp: (petRecord.exp as number | null) ?? 0,
    equipment: equipmentName ? { name: equipmentName } : null,
    belugaSwallowedPet: (petRecord.belugaSwallowedPet as string | null) ?? null,
    sarcasticFringeheadSwallowedPet:
      (petRecord.sarcasticFringeheadSwallowedPet as string | null) ?? null,
    mana: (petRecord.mana as number | null) ?? 0,
    triggersConsumed: (petRecord.triggersConsumed as number | null) ?? 0,
    foodsEaten: (petRecord.foodsEaten as number | null) ?? 0,
    abominationSwallowedPet1:
      (petRecord.abominationSwallowedPet1 as string | null) ?? null,
    abominationSwallowedPet2:
      (petRecord.abominationSwallowedPet2 as string | null) ?? null,
    abominationSwallowedPet3:
      (petRecord.abominationSwallowedPet3 as string | null) ?? null,
    abominationSwallowedPet1BelugaSwallowedPet:
      (petRecord.abominationSwallowedPet1BelugaSwallowedPet as string | null) ??
      null,
    abominationSwallowedPet2BelugaSwallowedPet:
      (petRecord.abominationSwallowedPet2BelugaSwallowedPet as string | null) ??
      null,
    abominationSwallowedPet3BelugaSwallowedPet:
      (petRecord.abominationSwallowedPet3BelugaSwallowedPet as string | null) ??
      null,
    abominationSwallowedPet1SarcasticFringeheadSwallowedPet:
      (petRecord.abominationSwallowedPet1SarcasticFringeheadSwallowedPet as
        string | null) ?? null,
    abominationSwallowedPet2SarcasticFringeheadSwallowedPet:
      (petRecord.abominationSwallowedPet2SarcasticFringeheadSwallowedPet as
        string | null) ?? null,
    abominationSwallowedPet3SarcasticFringeheadSwallowedPet:
      (petRecord.abominationSwallowedPet3SarcasticFringeheadSwallowedPet as
        string | null) ?? null,
    abominationSwallowedPet1Level:
      (petRecord.abominationSwallowedPet1Level as number | null) ?? 1,
    abominationSwallowedPet2Level:
      (petRecord.abominationSwallowedPet2Level as number | null) ?? 1,
    abominationSwallowedPet3Level:
      (petRecord.abominationSwallowedPet3Level as number | null) ?? 1,
    abominationSwallowedPet1TimesHurt:
      (petRecord.abominationSwallowedPet1TimesHurt as number | null) ?? 0,
    abominationSwallowedPet2TimesHurt:
      (petRecord.abominationSwallowedPet2TimesHurt as number | null) ?? 0,
    abominationSwallowedPet3TimesHurt:
      (petRecord.abominationSwallowedPet3TimesHurt as number | null) ?? 0,
    friendsDiedBeforeBattle:
      (petRecord.friendsDiedBeforeBattle as number | null) ?? 0,
    battlesFought: (petRecord.battlesFought as number | null) ?? 0,
    timesHurt: (petRecord.timesHurt as number | null) ?? 0,
    equipmentUses: (petRecord.equipmentUses as number | null) ?? null,
  };
}

function applyTeamEquipmentUses(
  formGroup: FormGroup,
  side: 'player' | 'opponent',
  pets?: PetForm[],
) {
  const key = side === 'player' ? 'playerPets' : 'opponentPets';
  const formArray = formGroup.get(key) as FormArray;
  if (!formArray) {
    return;
  }
  for (let i = 0; i < formArray.length; i++) {
    const control = formArray.at(i) as FormGroup;
    const petData = pets?.[i];
    control
      .get('equipmentUses')
      ?.setValue(petData?.equipmentUses ?? null, { emitEvent: false });
  }
}

function resolvePresetToy(
  ...candidates: Array<{ name?: string | null; level?: unknown }>
): { name: string | null; level: number } {
  for (const candidate of candidates) {
    const name = resolvePresetToyName(candidate.name);
    if (!name) {
      continue;
    }
    return {
      name,
      level: resolvePresetToyLevel(candidate.level),
    };
  }
  return {
    name: null,
    level: 1,
  };
}

function resolvePresetToyName(candidate: string | null | undefined): string | null {
  if (typeof candidate !== 'string') {
    return null;
  }
  return candidate.trim().length > 0 ? candidate : null;
}

function resolvePresetToyLevel(candidate: unknown): number {
  const parsedLevel = Number(candidate);
  if (!Number.isFinite(parsedLevel)) {
    return 1;
  }
  return Math.max(1, Math.min(3, Math.trunc(parsedLevel)));
}



