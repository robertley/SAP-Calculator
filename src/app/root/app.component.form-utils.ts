import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Player } from '../classes/player.class';
import { GameService } from '../services/game.service';
import { ToyService } from '../services/toy/toy.service';

export interface AppFormInitContext {
  player: Player;
  opponent: Player;
  gameService: GameService;
  toyService: ToyService;
  updatePreviousShopTier: (turn: number) => void;
  updateGoldSpent: (player: number | null, opponent: number | null) => void;
  setDayNight: () => void;
  openCustomPackEditor: () => void;
  resetPackImageError: (side: 'player' | 'opponent', packName: string) => void;
  updatePlayerPack: (player: Player, pack: string, randomize?: boolean) => void;
  updatePlayerToy: (player: Player, toy: string) => void;
  updateToyLevel: (player: Player, level: number) => void;
  setHardToyImage: (player: Player, toyName: string) => void;
}

export function initPetForms(formGroup: FormGroup, player: Player, opponent: Player) {
  const petsDummyArray = [0, 1, 2, 3, 4];
  const playerPetFormGroups = petsDummyArray.map((foo) =>
    new FormGroup({
      name: new FormControl(player[`pet${foo}`]?.name),
      attack: new FormControl(player[`pet${foo}`]?.attack ?? 0),
      health: new FormControl(player[`pet${foo}`]?.health ?? 0),
      exp: new FormControl(player[`pet${foo}`]?.exp ?? 0),
      equipment: new FormControl(player[`pet${foo}`]?.equipment),
      equipmentUses: new FormControl(player[`pet${foo}`]?.equipment?.uses ?? null),
      belugaSwallowedPet: new FormControl(player[`pet${foo}`]?.belugaSwallowedPet),
      sarcasticFringeheadSwallowedPet: new FormControl(player[`pet${foo}`]?.sarcasticFringeheadSwallowedPet),
      mana: new FormControl(player[`pet${foo}`]?.mana ?? 0),
      triggersConsumed: new FormControl(player[`pet${foo}`]?.triggersConsumed ?? 0),
      abominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1),
      abominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2),
      abominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3),
      abominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3TimesHurt ?? 0),
      friendsDiedBeforeBattle: new FormControl(player[`pet${foo}`]?.friendsDiedBeforeBattle ?? 0),
      battlesFought: new FormControl(player[`pet${foo}`]?.battlesFought ?? 0),
      timesHurt: new FormControl(player[`pet${foo}`]?.timesHurt ?? 0),
    })
  );

  const playerFormArray = formGroup.get('playerPets') as FormArray;
  playerFormArray.clear();
  for (const petFormGroup of playerPetFormGroups) {
    playerFormArray.push(petFormGroup);
  }

  const opponentFormGroups = petsDummyArray.map((foo) =>
    new FormGroup({
      name: new FormControl(opponent[`pet${foo}`]?.name),
      attack: new FormControl(opponent[`pet${foo}`]?.attack ?? 0),
      health: new FormControl(opponent[`pet${foo}`]?.health ?? 0),
      exp: new FormControl(opponent[`pet${foo}`]?.exp ?? 0),
      equipment: new FormControl(opponent[`pet${foo}`]?.equipment),
      equipmentUses: new FormControl(opponent[`pet${foo}`]?.equipment?.uses ?? null),
      belugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.belugaSwallowedPet),
      sarcasticFringeheadSwallowedPet: new FormControl(opponent[`pet${foo}`]?.sarcasticFringeheadSwallowedPet),
      mana: new FormControl(opponent[`pet${foo}`]?.mana ?? 0),
      triggersConsumed: new FormControl(opponent[`pet${foo}`]?.triggersConsumed ?? 0),
      abominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1),
      abominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2),
      abominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3),
      abominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3TimesHurt ?? 0),
      friendsDiedBeforeBattle: new FormControl(opponent[`pet${foo}`]?.friendsDiedBeforeBattle ?? 0),
      battlesFought: new FormControl(opponent[`pet${foo}`]?.battlesFought ?? 0),
      timesHurt: new FormControl(opponent[`pet${foo}`]?.timesHurt ?? 0),
    })
  );

  const opponentFormArray = formGroup.get('opponentPets') as FormArray;
  opponentFormArray.clear();
  for (const petFormGroup of opponentFormGroups) {
    opponentFormArray.push(petFormGroup);
  }
}

export function createAppFormGroup(ctx: AppFormInitContext): FormGroup {
  const defaultTurn = 11;
  const defaultGoldSpent = 10;

  ctx.updatePreviousShopTier(defaultTurn);
  ctx.updateGoldSpent(defaultGoldSpent, defaultGoldSpent);

  const formGroup = new FormGroup({
    playerPack: new FormControl<string | null>(ctx.player.pack ?? null),
    opponentPack: new FormControl<string | null>(ctx.opponent.pack ?? null),
    playerToy: new FormControl(ctx.player.toy?.name),
    playerToyLevel: new FormControl(ctx.player.toy?.level ?? 1),
    opponentToy: new FormControl(ctx.opponent.toy?.name),
    opponentToyLevel: new FormControl(ctx.opponent.toy?.level ?? 1),
    playerHardToy: new FormControl(null),
    playerHardToyLevel: new FormControl(1),
    opponentHardToy: new FormControl(null),
    opponentHardToyLevel: new FormControl(1),
    turn: new FormControl(defaultTurn),
    playerGoldSpent: new FormControl(defaultGoldSpent),
    opponentGoldSpent: new FormControl(defaultGoldSpent),
    allPets: new FormControl(false),
    logFilter: new FormControl(null),
    playerPets: new FormArray([]),
    opponentPets: new FormArray([]),
    customPacks: new FormArray([]),
    oldStork: new FormControl(false),
    tokenPets: new FormControl(false),
    komodoShuffle: new FormControl(false),
    mana: new FormControl(false),
    triggersConsumed: new FormControl(false),
    showSwallowedLevels: new FormControl(false),
    playerRollAmount: new FormControl(4),
    opponentRollAmount: new FormControl(4),
    playerLevel3Sold: new FormControl(0),
    opponentLevel3Sold: new FormControl(0),
    playerSummonedAmount: new FormControl(0),
    opponentSummonedAmount: new FormControl(0),
    playerTransformationAmount: new FormControl(0),
    opponentTransformationAmount: new FormControl(0),
    showAdvanced: new FormControl(false),
    ailmentEquipment: new FormControl(true),
    changeEquipmentUses: new FormControl(false),
    simulations: new FormControl(100),
  });

  initPetForms(formGroup, ctx.player, ctx.opponent);

  formGroup.get('playerPack').valueChanges.subscribe((value) => {
    if (value == null) {
      return;
    }

    if (value == 'Add Custom Pack') {
      ctx.openCustomPackEditor();
      return;
    }
    ctx.resetPackImageError('player', value);
    ctx.updatePlayerPack(ctx.player, value);
  });

  formGroup.get('opponentPack').valueChanges.subscribe((value) => {
    if (value == null) {
      return;
    }

    if (value == 'Add Custom Pack') {
      ctx.openCustomPackEditor();
      return;
    }
    ctx.resetPackImageError('opponent', value);
    ctx.updatePlayerPack(ctx.opponent, value);
  });

  formGroup.get('playerToy').valueChanges.subscribe((value) => {
    ctx.updatePlayerToy(ctx.player, value);
  });

  formGroup.get('opponentToy').valueChanges.subscribe((value) => {
    ctx.updatePlayerToy(ctx.opponent, value);
  });

  formGroup.get('playerToyLevel').valueChanges.subscribe((value) => {
    ctx.updateToyLevel(ctx.player, value);
  });

  formGroup.get('opponentToyLevel').valueChanges.subscribe((value) => {
    ctx.updateToyLevel(ctx.opponent, value);
  });

  formGroup.get('playerHardToy').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerHardToy = value;
    ctx.setHardToyImage(ctx.player, value);
  });

  formGroup.get('playerHardToyLevel').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerHardToyLevel = value;
  });

  formGroup.get('opponentHardToy').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentHardToy = value;
    ctx.setHardToyImage(ctx.opponent, value);
  });

  formGroup.get('opponentHardToyLevel').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentHardToyLevel = value;
  });

  formGroup.get('turn').valueChanges.subscribe((value) => {
    ctx.updatePreviousShopTier(value);
    ctx.setDayNight();
  });

  formGroup.get('playerGoldSpent').valueChanges.subscribe((value) => {
    ctx.updateGoldSpent(value, null);
  });

  formGroup.get('opponentGoldSpent').valueChanges.subscribe((value) => {
    ctx.updateGoldSpent(null, value);
  });

  formGroup.get('oldStork').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.oldStork = value;
  });

  formGroup.get('komodoShuffle').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.komodoShuffle = value;
  });

  formGroup.get('mana').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.mana = value;
  });

  formGroup.get('playerRollAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerRollAmount = value;
  });

  formGroup.get('opponentRollAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentRollAmount = value;
  });

  formGroup.get('playerLevel3Sold').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerLevel3Sold = value;
  });

  formGroup.get('opponentLevel3Sold').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentLevel3Sold = value;
  });

  formGroup.get('playerSummonedAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerSummonedAmount = value;
  });

  formGroup.get('opponentSummonedAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentSummonedAmount = value;
  });

  formGroup.get('playerTransformationAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.playerTransformationAmount = value;
  });

  formGroup.get('opponentTransformationAmount').valueChanges.subscribe((value) => {
    ctx.gameService.gameApi.opponentTransformationAmount = value;
  });

  return formGroup;
}
