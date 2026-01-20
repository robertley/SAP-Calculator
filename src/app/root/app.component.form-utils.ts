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
      parrotCopyPet: new FormControl(player[`pet${foo}`]?.parrotCopyPet ?? null),
      parrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      sarcasticFringeheadSwallowedPet: new FormControl(player[`pet${foo}`]?.sarcasticFringeheadSwallowedPet),
      mana: new FormControl(player[`pet${foo}`]?.mana ?? 0),
      triggersConsumed: new FormControl(player[`pet${foo}`]?.triggersConsumed ?? 0),
      abominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1),
      abominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2),
      abominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3),
      abominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPet ?? null),
      abominationSwallowedPet2ParrotCopyPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPet ?? null),
      abominationSwallowedPet3ParrotCopyPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPet ?? null),
      abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(player[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
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
      parrotCopyPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPet ?? null),
      parrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      sarcasticFringeheadSwallowedPet: new FormControl(opponent[`pet${foo}`]?.sarcasticFringeheadSwallowedPet),
      mana: new FormControl(opponent[`pet${foo}`]?.mana ?? 0),
      triggersConsumed: new FormControl(opponent[`pet${foo}`]?.triggersConsumed ?? 0),
      abominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1),
      abominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2),
      abominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3),
      abominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPet ?? null),
      abominationSwallowedPet2ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPet ?? null),
      abominationSwallowedPet3ParrotCopyPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPet ?? null),
      abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ?? 1),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ?? 1),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(opponent[`pet${foo}`]?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0),
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
    tokenPets: new FormControl(true),
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
