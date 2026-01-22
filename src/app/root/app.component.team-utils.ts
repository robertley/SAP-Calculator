import { FormArray, FormGroup } from '@angular/forms';
import { Player } from '../classes/player.class';
import { EquipmentService } from '../services/equipment/equipment.service';
import { PetService } from '../services/pet/pet.service';
import {
  TeamPreset,
  TeamPresetsService,
} from '../services/team-presets.service';
import { cloneEquipment } from '../util/equipment-utils';

export function saveTeamPreset(options: {
  side: 'player' | 'opponent';
  teamName: string;
  formGroup: FormGroup;
  savedTeams: TeamPreset[];
  selectedTeamId: string;
  teamPresetsService: TeamPresetsService;
}): { savedTeams: TeamPreset[]; selectedTeamId: string; teamName: string } {
  const name = options.teamName?.trim() || prompt('Team name?');
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
  const triggersConsumed = Boolean(
    options.formGroup.get('triggersConsumed').value,
  );
  const showSwallowedLevels = Boolean(
    options.formGroup.get('showSwallowedLevels').value,
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
    existing.triggersConsumed = triggersConsumed;
    existing.showSwallowedLevels = showSwallowedLevels;
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
      triggersConsumed,
      showSwallowedLevels,
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
  if (team.triggersConsumed != null) {
    options.formGroup.get('triggersConsumed').setValue(team.triggersConsumed);
  }
  if (team.showSwallowedLevels != null) {
    options.formGroup
      .get('showSwallowedLevels')
      .setValue(team.showSwallowedLevels);
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
  const playerToyName = team.playerToyName ?? team.toyName ?? null;
  const playerToyLevel = team.playerToyLevel ?? team.toyLevel ?? 1;
  const opponentToyName = team.opponentToyName ?? team.toyName ?? null;
  const opponentToyLevel = team.opponentToyLevel ?? team.toyLevel ?? 1;

  options.formGroup.get('playerToy').setValue(playerToyName);
  options.formGroup.get('playerToyLevel').setValue(playerToyLevel);
  options.formGroup.get('opponentToy').setValue(opponentToyName);
  options.formGroup.get('opponentToyLevel').setValue(opponentToyLevel);

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
    const equipmentName = petData.equipment?.name;
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
        abominationSwallowedPet1: petData.abominationSwallowedPet1 ?? null,
        abominationSwallowedPet2: petData.abominationSwallowedPet2 ?? null,
        abominationSwallowedPet3: petData.abominationSwallowedPet3 ?? null,
        abominationSwallowedPet1BelugaSwallowedPet:
          petData.abominationSwallowedPet1BelugaSwallowedPet ?? null,
        abominationSwallowedPet2BelugaSwallowedPet:
          petData.abominationSwallowedPet2BelugaSwallowedPet ?? null,
        abominationSwallowedPet3BelugaSwallowedPet:
          petData.abominationSwallowedPet3BelugaSwallowedPet ?? null,
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
): any[] {
  const key = side === 'player' ? 'playerPets' : 'opponentPets';
  const formArray = formGroup.get(key) as FormArray;
  return formArray.controls.map((control) =>
    sanitizePetFormValue(control.value),
  );
}

function sanitizePetFormValue(petValue: any): any {
  if (!petValue?.name) {
    return null;
  }
  const equipmentName = petValue.equipment?.name ?? null;
  return {
    name: petValue.name ?? null,
    attack: petValue.attack ?? 0,
    health: petValue.health ?? 0,
    exp: petValue.exp ?? 0,
    equipment: equipmentName ? { name: equipmentName } : null,
    belugaSwallowedPet: petValue.belugaSwallowedPet ?? null,
    sarcasticFringeheadSwallowedPet:
      petValue.sarcasticFringeheadSwallowedPet ?? null,
    mana: petValue.mana ?? 0,
    triggersConsumed: petValue.triggersConsumed ?? 0,
    abominationSwallowedPet1: petValue.abominationSwallowedPet1 ?? null,
    abominationSwallowedPet2: petValue.abominationSwallowedPet2 ?? null,
    abominationSwallowedPet3: petValue.abominationSwallowedPet3 ?? null,
    abominationSwallowedPet1BelugaSwallowedPet:
      petValue.abominationSwallowedPet1BelugaSwallowedPet ?? null,
    abominationSwallowedPet2BelugaSwallowedPet:
      petValue.abominationSwallowedPet2BelugaSwallowedPet ?? null,
    abominationSwallowedPet3BelugaSwallowedPet:
      petValue.abominationSwallowedPet3BelugaSwallowedPet ?? null,
    abominationSwallowedPet1Level: petValue.abominationSwallowedPet1Level ?? 1,
    abominationSwallowedPet2Level: petValue.abominationSwallowedPet2Level ?? 1,
    abominationSwallowedPet3Level: petValue.abominationSwallowedPet3Level ?? 1,
    abominationSwallowedPet1TimesHurt:
      petValue.abominationSwallowedPet1TimesHurt ?? 0,
    abominationSwallowedPet2TimesHurt:
      petValue.abominationSwallowedPet2TimesHurt ?? 0,
    abominationSwallowedPet3TimesHurt:
      petValue.abominationSwallowedPet3TimesHurt ?? 0,
    friendsDiedBeforeBattle: petValue.friendsDiedBeforeBattle ?? 0,
    battlesFought: petValue.battlesFought ?? 0,
    timesHurt: petValue.timesHurt ?? 0,
    equipmentUses: petValue.equipmentUses ?? null,
  };
}

function applyTeamEquipmentUses(
  formGroup: FormGroup,
  side: 'player' | 'opponent',
  pets?: any[],
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
