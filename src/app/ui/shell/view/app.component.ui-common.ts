import { AbstractControl, FormGroup } from '@angular/forms';
import { ElementRef, QueryList } from '@angular/core';
import { Modal } from 'bootstrap';
import { TeamPreset } from 'app/integrations/team-presets.service';
import { Battle } from 'app/domain/interfaces/battle.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import { LogMessagePart } from '../simulation/app.component.simulation';
import { LocalStorageService } from 'app/runtime/state/local-storage.service';
import { UrlStateService } from 'app/runtime/state/url-state.service';
import { CalculatorStateService } from 'app/runtime/state/calculator-state.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { LogService } from 'app/integrations/log.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { GameService } from 'app/runtime/state/game.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { PetSelectorComponent } from 'app/ui/components/pet-selector/pet-selector.component';
import { SelectionType } from 'app/ui/components/item-selection-dialog/item-selection-dialog.component';
import { Player } from 'app/domain/entities/player.class';
import { shouldShowRollInputs } from '../state/app.component.rolls';
import { BATTLE_BACKGROUND_BASE } from './app.ui.constants';
import * as foodJson from 'assets/data/food.json';

export interface AppUiContext {
  formGroup: FormGroup;
  player: Player;
  opponent: Player;
  logService: LogService;
  petSelectors: QueryList<PetSelectorComponent>;
  selectionType: SelectionType;
  selectionSide: 'player' | 'opponent' | 'none';
  showSelectionDialog: boolean;
  selectedTeamId: string;
  savedTeams: TeamPreset[];
  playerPackImageBroken: boolean;
  opponentPackImageBroken: boolean;
  previousPackPlayer: string | null;
  previousPackOpponent: string | null;
  customPackEditor: ElementRef;
  customPackEditorModal: Modal;
  localStorageService: LocalStorageService;
  urlStateService: UrlStateService;
  calculatorStateService: CalculatorStateService;
  petService: PetService;
  equipmentService: EquipmentService;
  gameService: GameService;
  toyService: ToyService;
  battleBackgroundUrl: string;
  battleBackgrounds: string[];
  dayNight: boolean;
  playerToyImageUrl: string;
  opponentToyImageUrl: string;
  playerHardToyImageUrl: string;
  opponentHardToyImageUrl: string;
  playerPetsControls: AbstractControl[];
  opponentPetsControls: AbstractControl[];
  undoState?: any;
  simulated?: boolean;
  battles?: Battle[];
  battleRandomEvents?: LogMessagePart[][];
  battleRandomEventsByBattle?: Map<Battle, LogMessagePart[]>;
  filteredBattlesCache?: Battle[];
  viewBattle?: Battle | null;
  viewBattleLogs?: Log[];
  viewBattleLogRows?: Array<{ parts: LogMessagePart[]; classes: string[] }>;
  playerWinner?: number;
  opponentWinner?: number;
  draw?: number;
  apiResponse?: string | null;
  battleStarted?: boolean;
  currBattle?: Battle | null;
  setStatus?: (message: string, tone?: 'success' | 'error') => void;
}

const FOOD_PACK_CODE_TO_NAME: Record<string, string> = {
  Pack1: 'Turtle',
  Pack2: 'Puppy',
  Pack3: 'Star',
  Pack4: 'Golden',
  Pack5: 'Unicorn',
  Danger: 'Danger',
  Custom: 'Custom',
  MiniPack1: 'Custom',
  MiniPack2: 'Custom',
  MiniPack3: 'Custom',
};

let equipmentNamesByPack: Map<string, Set<string>> | null = null;

function buildEquipmentNamesByPack(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  const foods =
    (
      foodJson as unknown as {
        default?: Array<{ Name?: string; Packs?: string[]; PacksRequired?: string[] }>;
      }
    ).default ??
    (foodJson as unknown as Array<{ Name?: string; Packs?: string[]; PacksRequired?: string[] }>) ??
    [];
  for (const entry of foods) {
    const name = entry?.Name;
    if (!name) {
      continue;
    }
    const packCodes = new Set<string>();
    const packs = entry?.Packs ?? [];
    for (const code of packs) {
      if (code) {
        packCodes.add(String(code).trim());
      }
    }
    const hasCustomPack =
      packCodes.has('Custom') ||
      packCodes.has('MiniPack1') ||
      packCodes.has('MiniPack2') ||
      packCodes.has('MiniPack3');
    if (!hasCustomPack) {
      for (const code of entry?.PacksRequired ?? []) {
        if (code) {
          packCodes.add(String(code).trim());
        }
      }
    }
    for (const code of packCodes) {
      const packName = FOOD_PACK_CODE_TO_NAME[code];
      if (!packName) {
        continue;
      }
      if (!map.has(packName)) {
        map.set(packName, new Set());
      }
      map.get(packName)?.add(name);
    }
  }
  return map;
}

export function getEquipmentNamesForPack(packName: string | null | undefined): Set<string> | null {
  if (!packName) {
    return null;
  }
  if (!equipmentNamesByPack) {
    equipmentNamesByPack = buildEquipmentNamesByPack();
  }
  return equipmentNamesByPack.get(packName) ?? null;
}

export function trackByIndex(index: number): number {
  return index;
}

export function trackByTeamId(index: number, team: TeamPreset): string {
  return team?.id ?? String(index);
}

export function trackByLogTab(index: number, tab: { value: string | null }) {
  return tab?.value ?? String(index);
}

export function getRollInputVisible(ctx: AppUiContext): boolean {
  return (
    ctx.formGroup.get('showAdvanced').value ||
    shouldShowRollInputs([ctx.player, ctx.opponent])
  );
}

export function printFormGroup(ctx: AppUiContext): void {
  console.log(ctx.formGroup);
}

export function setRandomBackground(ctx: AppUiContext): void {
  if (!ctx.battleBackgrounds.length) {
    ctx.battleBackgroundUrl = '';
    return;
  }
  const idx = Math.floor(Math.random() * ctx.battleBackgrounds.length);
  ctx.battleBackgroundUrl = `${BATTLE_BACKGROUND_BASE}${ctx.battleBackgrounds[idx]}`;
}

export function fixCustomPackSelect(ctx: AppUiContext): void {
  ctx.formGroup
    .get('playerPack')
    .setValue(ctx.formGroup.get('playerPack').value, { emitEvent: false });
  ctx.formGroup
    .get('opponentPack')
    .setValue(ctx.formGroup.get('opponentPack').value, { emitEvent: false });
}

export function makeFormGroup(control: AbstractControl): FormGroup {
  return control as FormGroup;
}

export function toggleAdvanced(ctx: AppUiContext): void {
  const advanced = ctx.formGroup.get('showAdvanced').value;
  ctx.formGroup.get('showAdvanced').setValue(!advanced);
}
