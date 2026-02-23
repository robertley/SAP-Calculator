import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { GameService } from 'app/runtime/state/game.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { initPetForms } from './app.component.pet-forms';

export { initPetForms } from './app.component.pet-forms';

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
  updatePlayerToy: (player: Player, toy: string | null) => void;
  updateToyLevel: (player: Player, level: number) => void;
  setHardToyImage: (player: Player, toyName: string | null) => void;
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
    tokenPets: new FormControl(true),
    komodoShuffle: new FormControl(false),
    mana: new FormControl(false),
    triggersConsumed: new FormControl(false),
    playerRollAmount: new FormControl(4),
    opponentRollAmount: new FormControl(4),
    playerLevel3Sold: new FormControl(0),
    opponentLevel3Sold: new FormControl(0),
    playerSummonedAmount: new FormControl(0),
    opponentSummonedAmount: new FormControl(0),
    playerTransformationAmount: new FormControl(0),
    opponentTransformationAmount: new FormControl(0),
    showAdvanced: new FormControl(false),
    showTriggerNamesInLogs: new FormControl(false),
    showPositionalArgsInLogs: new FormControl(true),
    ailmentEquipment: new FormControl(true),
    changeEquipmentUses: new FormControl(false),
    seed: new FormControl<number | null>(null),
    logsEnabled: new FormControl(true),
    simulations: new FormControl(100),
  });

  initPetForms(formGroup, ctx.player, ctx.opponent);

  formGroup
    .get('playerPack')!
    .valueChanges.subscribe((value: string | null | undefined) => {
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

  formGroup
    .get('opponentPack')!
    .valueChanges.subscribe((value: string | null | undefined) => {
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

  formGroup
    .get('playerToy')!
    .valueChanges.subscribe((value: string | null | undefined) => {
      ctx.updatePlayerToy(ctx.player, value ?? null);
    });

  formGroup
    .get('opponentToy')!
    .valueChanges.subscribe((value: string | null | undefined) => {
      ctx.updatePlayerToy(ctx.opponent, value ?? null);
    });

  formGroup
    .get('playerToyLevel')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.updateToyLevel(ctx.player, value);
    });

  formGroup
    .get('opponentToyLevel')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.updateToyLevel(ctx.opponent, value);
    });

  formGroup
    .get('playerHardToy')!
    .valueChanges.subscribe((value: string | null | undefined) => {
      ctx.gameService.gameApi.playerHardToy = value ?? null;
      ctx.setHardToyImage(ctx.player, value ?? null);
    });

  formGroup
    .get('playerHardToyLevel')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.playerHardToyLevel = value;
    });

  formGroup
    .get('opponentHardToy')!
    .valueChanges.subscribe((value: string | null | undefined) => {
      ctx.gameService.gameApi.opponentHardToy = value ?? null;
      ctx.setHardToyImage(ctx.opponent, value ?? null);
    });

  formGroup
    .get('opponentHardToyLevel')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.opponentHardToyLevel = value;
    });

  formGroup.get('turn')!.valueChanges.subscribe((value: number | null) => {
    if (value == null) {
      return;
    }
    ctx.updatePreviousShopTier(value);
    ctx.setDayNight();
  });

  formGroup
    .get('playerGoldSpent')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.updateGoldSpent(value, null);
    });

  formGroup
    .get('opponentGoldSpent')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.updateGoldSpent(null, value);
    });

  formGroup.get('oldStork')!.valueChanges.subscribe((value: boolean | null) => {
    if (value == null) {
      return;
    }
    ctx.gameService.gameApi.oldStork = value;
  });

  formGroup
    .get('komodoShuffle')!
    .valueChanges.subscribe((value: boolean | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.komodoShuffle = value;
    });

  formGroup.get('mana')!.valueChanges.subscribe((value: boolean | null) => {
    if (value == null) {
      return;
    }
    ctx.gameService.gameApi.mana = value;
  });

  formGroup
    .get('playerRollAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.playerRollAmount = value;
    });

  formGroup
    .get('opponentRollAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.opponentRollAmount = value;
    });

  formGroup
    .get('playerLevel3Sold')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.playerLevel3Sold = value;
    });

  formGroup
    .get('opponentLevel3Sold')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.opponentLevel3Sold = value;
    });

  formGroup
    .get('playerSummonedAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.playerSummonedAmount = value;
    });

  formGroup
    .get('opponentSummonedAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.opponentSummonedAmount = value;
    });

  formGroup
    .get('playerTransformationAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.playerTransformationAmount = value;
    });

  formGroup
    .get('opponentTransformationAmount')!
    .valueChanges.subscribe((value: number | null) => {
      if (value == null) {
        return;
      }
      ctx.gameService.gameApi.opponentTransformationAmount = value;
    });

  return formGroup;
}



