import { Injectable } from '@angular/core';
import { ReplayCalcService, ReplayBattleResponse } from './replay-calc.service';
import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalculatorState,
  buildReplayAbilityPetMapFromActions,
} from './replay-calc-parser';
import { SimulationRunner } from 'app/gameplay/simulation-runner';
import {
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogService } from '../log.service';
import { GameService } from 'app/runtime/state/game.service';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from '../ability/ability.service';
import { PetService } from '../pet/pet.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ToyService } from '../toy/toy.service';
import * as petsData from 'assets/data/pets.json';
import * as perksData from 'assets/data/perks.json';
import * as toysData from 'assets/data/toys.json';
import {
  ReplayImageBattleInfo,
  ReplayImageCanvasRendererService,
  ReplayImagePetInfo,
  ReplayImageToyInfo,
} from './replay-image-canvas-renderer.service';

export interface ReplayOddsImageBuildInput {
  replayPayload: Record<string, unknown>;
  simulationCount: number;
  abilityPetMap?: Record<string, string | number> | null;
}

export interface ReplayOddsImageHotspot {
  turn: number;
  calculatorUrl: string;
  top: number;
  height: number;
}

export interface ReplayOddsImagePreview {
  width: number;
  height: number;
  hotspots: ReplayOddsImageHotspot[];
}

export interface ReplayOddsImageResult {
  blob: Blob;
  preview: ReplayOddsImagePreview;
}

interface ReplayActionEntry {
  Type?: number;
  Turn?: number | string | null;
  Battle?: string;
  Mode?: string | null;
}

interface ContentEntry {
  Id?: string | number;
  Name?: string;
  NameId?: string;
}

interface OddsBattleRow {
  turn: number;
  battle: ReplayBattleJson;
  calculatorUrl: string;
}

type RenderPetInfo = ReplayImagePetInfo;
type RenderToyInfo = ReplayImageToyInfo;
type RenderBattleInfo = ReplayImageBattleInfo;

interface TurnOddsSummary {
  player: string;
  opponent: string;
  draw: string;
}

interface TurnOddsAnalysis {
  odds: TurnOddsSummary | null;
  calculatorUrl: string | null;
  renderInfo: RenderBattleInfo | null;
}

const MODULE_PETS =
  ((petsData as unknown as { default?: ContentEntry[] }).default ??
    (petsData as unknown as ContentEntry[])) ?? [];
const MODULE_PERKS =
  ((perksData as unknown as { default?: ContentEntry[] }).default ??
    (perksData as unknown as ContentEntry[])) ?? [];
const MODULE_TOYS =
  ((toysData as unknown as { default?: ContentEntry[] }).default ??
    (toysData as unknown as ContentEntry[])) ?? [];

const PET_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_PETS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const PERK_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_PERKS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const TOY_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_TOYS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const PET_NAME_ID_BY_KEY = new Map<string, string>();
const PERK_NAME_ID_BY_KEY = new Map<string, string>();

MODULE_PETS.forEach((entry) => {
  if (typeof entry?.NameId !== 'string') {
    return;
  }
  const byName = normalizeLookupKey(entry.Name);
  const byNameId = normalizeLookupKey(entry.NameId);
  if (byName) {
    PET_NAME_ID_BY_KEY.set(byName, entry.NameId);
  }
  if (byNameId) {
    PET_NAME_ID_BY_KEY.set(byNameId, entry.NameId);
  }
});

MODULE_PERKS.forEach((entry) => {
  if (typeof entry?.NameId !== 'string') {
    return;
  }
  const byName = normalizeLookupKey(entry.Name);
  const byNameId = normalizeLookupKey(entry.NameId);
  if (byName) {
    PERK_NAME_ID_BY_KEY.set(byName, entry.NameId);
  }
  if (byNameId) {
    PERK_NAME_ID_BY_KEY.set(byNameId, entry.NameId);
  }
});

function normalizeLookupKey(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

@Injectable({
  providedIn: 'root',
})
export class ReplayOddsImageService {
  constructor(
    private replayCalcService: ReplayCalcService,
    private logService: LogService,
    private gameService: GameService,
    private abilityService: AbilityService,
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
    private replayImageRenderer: ReplayImageCanvasRendererService,
  ) {}

  async buildOddsImage(input: ReplayOddsImageBuildInput): Promise<ReplayOddsImageResult> {
    const resolvedReplay = this.resolveReplayActionsContainer(input.replayPayload);
    const turns = this.extractBattleRows(resolvedReplay);
    if (turns.length === 0) {
      throw new Error('Replay JSON did not contain battle turns.');
    }

    const replayActions = this.getReplayActions(resolvedReplay);
    const abilityPetMap =
      input.abilityPetMap ??
      this.getReplayAbilityPetMap(resolvedReplay) ??
      (replayActions ? buildReplayAbilityPetMapFromActions(replayActions) : null);

    const buildModel = this.getReplayBuildModel(resolvedReplay);
    const analyses = turns.map((turn) =>
      this.computeTurnOdds(
        turn.battle,
        buildModel,
        abilityPetMap,
        input.simulationCount,
      ),
    );
    const turnsWithLinks = turns.map((turn, index) => ({
      ...turn,
      calculatorUrl: analyses[index]?.calculatorUrl ?? '',
    }));
    const renderInfo = turnsWithLinks.map(
      (turn, index) => analyses[index]?.renderInfo ?? this.toRenderBattleInfo(turn.battle),
    );

    return this.renderOddsImage(
      turnsWithLinks,
      renderInfo,
      analyses.map((entry) => entry.odds),
      input.simulationCount,
    );
  }

  async buildOddsImageBlob(input: ReplayOddsImageBuildInput): Promise<Blob> {
    const result = await this.buildOddsImage(input);
    return result.blob;
  }

  private computeTurnOdds(
    battle: ReplayBattleJson,
    buildModel: ReplayBuildModelJson | null,
    abilityPetMap: Record<string, string | number> | null,
    simulationCount: number,
  ): TurnOddsAnalysis {
    try {
      const calculatorState = this.replayCalcService.parseReplayForCalculator(
        battle,
        buildModel ?? undefined,
        undefined,
        { abilityPetMap },
      );
      const config = this.createSimulationConfigFromCalculatorState(
        calculatorState,
        simulationCount,
      );
      const result = this.runLocalSimulation(config);
      const total = result.playerWins + result.opponentWins + result.draws;
      if (total <= 0) {
        return {
          odds: null,
          calculatorUrl: this.replayCalcService.generateCalculatorLink(calculatorState),
          renderInfo: this.buildRenderBattleInfoFromCalculatorState(
            battle,
            calculatorState,
          ),
        };
      }
      return {
        odds: {
          player: `${((result.playerWins / total) * 100).toFixed(1)}%`,
          opponent: `${((result.opponentWins / total) * 100).toFixed(1)}%`,
          draw: `${((result.draws / total) * 100).toFixed(1)}%`,
        },
        calculatorUrl: this.replayCalcService.generateCalculatorLink(calculatorState),
        renderInfo: this.buildRenderBattleInfoFromCalculatorState(
          battle,
          calculatorState,
        ),
      };
    } catch {
      return {
        odds: null,
        calculatorUrl: null,
        renderInfo: null,
      };
    }
  }

  private runLocalSimulation(config: SimulationConfig): SimulationResult {
    const previousGameApi = this.gameService.gameApi
      ? ({ ...this.gameService.gameApi } as GameAPI)
      : null;
    const wasEnabled = this.logService.isEnabled();
    const wasDeferDecorations = this.logService.isDeferDecorations();
    const wasShowTriggerNames = this.logService.isShowTriggerNamesInLogs();

    const runner = new SimulationRunner(
      this.logService,
      this.gameService,
      this.abilityService,
      this.petService,
      this.equipmentService,
      this.toyService,
    );

    try {
      return runner.run(config);
    } finally {
      if (previousGameApi) {
        this.gameService.gameApi = previousGameApi;
      }
      this.logService.setEnabled(wasEnabled);
      this.logService.setDeferDecorations(wasDeferDecorations);
      this.logService.setShowTriggerNamesInLogs(wasShowTriggerNames);
    }
  }

  private createSimulationConfigFromCalculatorState(
    calculatorState: ReplayCalculatorState,
    simulationCount: number,
  ): SimulationConfig {
    return {
      playerPack: calculatorState.playerPack,
      opponentPack: calculatorState.opponentPack,
      playerToy: calculatorState.playerToy,
      playerToyLevel: this.toNumberOrFallback(calculatorState.playerToyLevel, 1),
      playerHardToy: calculatorState.playerHardToy,
      playerHardToyLevel: calculatorState.playerHardToyLevel,
      opponentToy: calculatorState.opponentToy,
      opponentToyLevel: this.toNumberOrFallback(calculatorState.opponentToyLevel, 1),
      opponentHardToy: calculatorState.opponentHardToy,
      opponentHardToyLevel: calculatorState.opponentHardToyLevel,
      turn: calculatorState.turn,
      playerGoldSpent: calculatorState.playerGoldSpent,
      opponentGoldSpent: calculatorState.opponentGoldSpent,
      playerRollAmount: calculatorState.playerRollAmount,
      opponentRollAmount: calculatorState.opponentRollAmount,
      playerSummonedAmount: calculatorState.playerSummonedAmount,
      opponentSummonedAmount: calculatorState.opponentSummonedAmount,
      playerLevel3Sold: calculatorState.playerLevel3Sold,
      opponentLevel3Sold: calculatorState.opponentLevel3Sold,
      playerTransformationAmount: calculatorState.playerTransformationAmount,
      opponentTransformationAmount: calculatorState.opponentTransformationAmount,
      playerPets: calculatorState.playerPets,
      opponentPets: calculatorState.opponentPets,
      customPacks: calculatorState.customPacks,
      allPets: calculatorState.allPets,
      oldStork: calculatorState.oldStork,
      tokenPets: calculatorState.tokenPets,
      komodoShuffle: calculatorState.komodoShuffle,
      mana: calculatorState.mana,
      seed: calculatorState.seed,
      simulationCount,
      logsEnabled: false,
      maxLoggedBattles: 0,
    };
  }

  private resolveReplayActionsContainer(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const rootRawJson = this.getRecord(payload, 'raw_json');
    if (rootRawJson && Array.isArray(rootRawJson['Actions'])) {
      return rootRawJson;
    }

    const nestedReplay = this.getRecord(payload, 'replay');
    const nestedRawJson = nestedReplay ? this.getRecord(nestedReplay, 'raw_json') : null;
    if (nestedRawJson && Array.isArray(nestedRawJson['Actions'])) {
      return nestedRawJson;
    }

    return payload;
  }

  private extractBattleRows(replayPayload: Record<string, unknown>): OddsBattleRow[] {
    const actions = this.getReplayActions(replayPayload);
    if (!actions || actions.length === 0) {
      const turns = replayPayload['turns'];
      if (!Array.isArray(turns)) {
        return [];
      }
      const replayServiceWithTurnsBuilder = this.replayCalcService as unknown as {
        buildReplayBattleResponseFromTurns: (
          turnsResponse: unknown,
          requestedTurn: number,
          replayId: string,
        ) => ReplayBattleResponse;
      };
      const replayId = this.getReplayIdFromPayload(replayPayload) ?? 'manual-replay';
      const rows: OddsBattleRow[] = [];
      for (let index = 0; index < turns.length; index += 1) {
        try {
          const turnNumber = index + 1;
          const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
            replayPayload as unknown,
            turnNumber,
            replayId,
          );
          if (response?.battle) {
            rows.push({ turn: turnNumber, battle: response.battle, calculatorUrl: '' });
          }
        } catch {
          // ignore
        }
      }
      return rows;
    }

    let fallbackTurn = 1;
    return actions
      .map((action) => {
        const actionType = this.toNumberOrFallback(action?.Type, 0);
        if ((actionType !== 0 && actionType !== 1) || typeof action.Battle !== 'string') {
          return null;
        }
        const parsedBattle = this.safeParseBattleJson(action.Battle);
        if (!parsedBattle) {
          return null;
        }
        const parsedTurn = this.toPositiveInt(action.Turn);
        const row = { turn: parsedTurn ?? fallbackTurn, battle: parsedBattle, calculatorUrl: '' };
        fallbackTurn += 1;
        return row;
      })
      .filter((row): row is OddsBattleRow => row !== null);
  }

  private toRenderBattleInfo(battle: ReplayBattleJson): RenderBattleInfo {
    const userBoard = this.getBoard(battle, 'UserBoard');
    const opponentBoard = this.getBoard(battle, 'OpponentBoard');
    return {
      outcome: this.getBattleOutcome(battle),
      playerName: this.getDisplayName(battle, 'User'),
      opponentName: this.getDisplayName(battle, 'Opponent'),
      playerLives: this.getBoardLives(userBoard),
      opponentLives: this.getBoardLives(opponentBoard),
      playerPets: this.getBoardPets(userBoard),
      opponentPets: this.getBoardPets(opponentBoard),
      playerToy: this.getBoardToy(userBoard),
      opponentToy: this.getBoardToy(opponentBoard),
    };
  }

  private buildRenderBattleInfoFromCalculatorState(
    battle: ReplayBattleJson,
    calculatorState: ReplayCalculatorState,
  ): RenderBattleInfo {
    const baseInfo = this.toRenderBattleInfo(battle);
    return {
      ...baseInfo,
      playerPets: this.buildRenderPetsFromPetConfigLineup(calculatorState.playerPets ?? []),
      opponentPets: this.buildRenderPetsFromPetConfigLineup(calculatorState.opponentPets ?? []),
    };
  }

  private async renderOddsImage(
    turns: OddsBattleRow[],
    renderInfo: RenderBattleInfo[],
    oddsByTurn: Array<TurnOddsSummary | null>,
    simulationCount: number,
  ): Promise<ReplayOddsImageResult> {
    const WIN_PERCENT_COLUMN_WIDTH = 260;
    const title =
      renderInfo[0]?.playerName && renderInfo[0]?.opponentName
        ? `${renderInfo[0].playerName} vs ${renderInfo[0].opponentName}`
        : null;
    const session = this.replayImageRenderer.createSession({
      rowCount: turns.length,
      extraColumnWidth: WIN_PERCENT_COLUMN_WIDTH,
      title,
    });
    const { ctx } = session;

    for (let i = 0; i < turns.length; i += 1) {
      const info = renderInfo[i];
      const odds = oddsByTurn[i];
      const winValue = odds ? this.parsePercentValue(odds.player) : null;
      const lossValue = odds ? this.parsePercentValue(odds.opponent) : null;
      const drawValue = odds ? this.parsePercentValue(odds.draw) : null;
      const isGaped =
        info.outcome === 1 && winValue !== null && Number.isFinite(winValue) && winValue <= 5;

      const { baseY } = await this.replayImageRenderer.drawBattleRow(session, {
        index: i,
        turn: turns[i].turn,
        info,
        backgroundColor: isGaped ? '#F4D35E' : undefined,
      });

      const oddsX = session.baseWidth + 10;
      ctx.textAlign = 'left';
      if (odds) {
        const max = Math.max(winValue ?? -1, lossValue ?? -1, drawValue ?? -1);
        const hasCertainOutcome =
          winValue === 100 || lossValue === 100 || drawValue === 100;
        const textStartY = baseY + 8;
        const lineHeight = 18;

        if (!hasCertainOutcome || winValue === 100) {
          ctx.fillStyle = '#137333';
          ctx.font = winValue === max ? 'bold 16px Arial' : '16px Arial';
          ctx.fillText(`Win ${odds.player}`, oddsX, textStartY);
        }
        if (!hasCertainOutcome || lossValue === 100) {
          const lossY = hasCertainOutcome ? textStartY : textStartY + lineHeight;
          ctx.fillStyle = '#B00020';
          ctx.font = lossValue === max ? 'bold 16px Arial' : '16px Arial';
          ctx.fillText(`Loss ${odds.opponent}`, oddsX, lossY);
        }
        if (!hasCertainOutcome || drawValue === 100) {
          const drawY = hasCertainOutcome ? textStartY : textStartY + lineHeight * 2;
          ctx.fillStyle = '#000000';
          ctx.font = drawValue === max ? 'bold 16px Arial' : '16px Arial';
          ctx.fillText(`Draw ${odds.draw}`, oddsX, drawY);
        }

        if (!hasCertainOutcome && winValue !== null && drawValue !== null) {
          const expectedScore = winValue / 100 + 0.5 * (drawValue / 100);
          const expectedY = textStartY + lineHeight * 3;
          ctx.fillStyle = '#444444';
          ctx.font = '14px Arial';
          ctx.fillText(`Expected: ${expectedScore.toFixed(3)}`, oddsX, expectedY);
          if (isGaped) {
            ctx.fillStyle = '#7A5C00';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('GAPED', oddsX, expectedY + lineHeight);
          }
        }
      } else {
        ctx.fillStyle = '#444444';
        ctx.font = '16px Arial';
        ctx.fillText('Win% unavailable', oddsX, baseY + 22);
      }
      ctx.textAlign = 'center';
    }

    const footerY = this.replayImageRenderer.drawFooterBackground(session);
    ctx.fillStyle = '#111111';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Simulations per turn: ${simulationCount}`, 25, footerY + 24);

    const preview: ReplayOddsImagePreview = {
      width: session.width,
      height: session.height,
      hotspots: turns
        .map((turn, index) =>
          turn.calculatorUrl.length > 0
            ? {
                turn: turn.turn,
                calculatorUrl: turn.calculatorUrl,
                top: session.headerHeight + index * session.rowHeight,
                height: session.rowHeight,
              }
            : null,
        )
        .filter((hotspot): hotspot is ReplayOddsImageHotspot => hotspot !== null),
    };

    return {
      blob: await this.replayImageRenderer.toBlob(session),
      preview,
    };
  }

  private buildRenderPetsFromPetConfigLineup(
    lineup: Array<ReplayCalculatorState['playerPets'][number]>,
  ): Array<RenderPetInfo | null> {
    return lineup.map((pet) => {
      if (!pet?.name) {
        return null;
      }
      const petNameId = PET_NAME_ID_BY_KEY.get(normalizeLookupKey(pet.name)) ?? null;
      const equipmentName = pet?.equipment?.name ?? null;
      const perkNameId = equipmentName
        ? (PERK_NAME_ID_BY_KEY.get(normalizeLookupKey(equipmentName)) ?? null)
        : null;
      return {
        imagePath: petNameId ? `/assets/art/Public/Public/Pets/${petNameId}.png` : null,
        perkImagePath: perkNameId ? `/assets/art/Public/Public/Food/${perkNameId}.png` : null,
        attack: this.toNumberOrFallback(pet.attack, 0),
        health: this.toNumberOrFallback(pet.health, 0),
        tempAttack: 0,
        tempHealth: 0,
        level:
          this.toNumberOrFallback(pet.exp, 1) >= 5
            ? 3
            : this.toNumberOrFallback(pet.exp, 1) >= 2
              ? 2
              : 1,
        xp: this.toNumberOrFallback(pet.exp, 0),
      };
    });
  }

  private getReplayActions(payload: Record<string, unknown>): ReplayActionEntry[] | null {
    const actions = payload['Actions'];
    return Array.isArray(actions) ? (actions as ReplayActionEntry[]) : null;
  }

  private getReplayBuildModel(payload: Record<string, unknown>): ReplayBuildModelJson | null {
    const build = payload['GenesisBuildModel'];
    return this.isObject(build) ? (build as ReplayBuildModelJson) : null;
  }

  private getReplayAbilityPetMap(
    payload: Record<string, unknown>,
  ): Record<string, string | number> | null {
    const raw = payload['abilityPetMap'] ?? payload['AbilityPetMap'];
    if (!this.isObject(raw)) {
      return null;
    }
    const result: Record<string, string | number> = {};
    Object.entries(raw).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        result[key] = value;
      }
    });
    return Object.keys(result).length > 0 ? result : null;
  }

  private getReplayIdFromPayload(payload: Record<string, unknown>): string | null {
    const replayId = payload['replayId'];
    if (typeof replayId === 'string' && replayId.length > 0) {
      return replayId;
    }
    const replay = this.getRecord(payload, 'replay');
    const nestedId = replay?.['id'];
    return typeof nestedId === 'string' && nestedId.length > 0 ? nestedId : null;
  }

  private safeParseBattleJson(rawBattle: string): ReplayBattleJson | null {
    try {
      const parsed = JSON.parse(rawBattle) as unknown;
      return this.isObject(parsed) ? (parsed as ReplayBattleJson) : null;
    } catch {
      return null;
    }
  }

  private parsePercentValue(percentText: string): number | null {
    const parsed = Number(String(percentText).replace('%', ''));
    return Number.isFinite(parsed) ? parsed : null;
  }

  private getBoard(
    battle: ReplayBattleJson,
    side: 'UserBoard' | 'OpponentBoard',
  ): Record<string, unknown> | null {
    const battleRecord = battle as unknown as Record<string, unknown>;
    const board = battleRecord[side];
    return this.isObject(board) ? board : null;
  }

  private getBoardPets(board: Record<string, unknown> | null): Array<RenderPetInfo | null> {
    if (!board) {
      return [];
    }
    const mins = this.getRecord(board, 'Mins');
    const items = mins?.['Items'];
    if (!Array.isArray(items)) {
      return [];
    }

    const pets: Array<RenderPetInfo | null> = [null, null, null, null, null];
    items.forEach((item) => {
      if (!this.isObject(item)) {
        return;
      }
      const petId = this.toReplayId(item['Enu']);
      if (!petId) {
        return;
      }
      const perkId = this.toReplayId(item['Perk']);
      const attackStats = this.getRecord(item, 'At');
      const healthStats = this.getRecord(item, 'Hp');
      const attack = this.toNumberOrFallback(attackStats?.['Perm'], 0);
      const health = this.toNumberOrFallback(healthStats?.['Perm'], 0);
      const tempAttack = this.toNumberOrFallback(attackStats?.['Temp'], 0);
      const tempHealth = this.toNumberOrFallback(healthStats?.['Temp'], 0);
      const petNameId = PET_NAME_ID_BY_ID.get(petId) ?? null;
      const perkNameId = perkId ? PERK_NAME_ID_BY_ID.get(perkId) ?? null : null;
      const poi = this.getRecord(item, 'Poi');
      const rawPosition =
        this.toNumberOrFallback(poi?.['x'], this.toNumberOrFallback(item['slot'], 0));
      const position = Math.max(0, Math.min(4, Math.trunc(rawPosition)));
      pets[position] = {
        imagePath: petNameId ? `/assets/art/Public/Public/Pets/${petNameId}.png` : null,
        perkImagePath: perkNameId ? `/assets/art/Public/Public/Food/${perkNameId}.png` : null,
        attack,
        health,
        tempAttack,
        tempHealth,
        level: this.toNumberOrFallback(item['Lvl'], 1),
        xp: this.toNumberOrFallback(item['Exp'], 0),
      };
    });
    return pets;
  }

  private getBoardToy(board: Record<string, unknown> | null): RenderToyInfo | null {
    if (!board) {
      return null;
    }
    const rel = this.getRecord(board, 'Rel') ?? this.getRecord(board, 'Relics');
    const items =
      (rel?.['Items'] as unknown[] | undefined) ??
      (Array.isArray(board['Relics']) ? (board['Relics'] as unknown[]) : undefined);
    if (!Array.isArray(items)) {
      return null;
    }
    const toyItem = items.find(
      (entry) => this.isObject(entry) && this.toReplayId(entry['Enu']) !== null,
    ) as Record<string, unknown> | undefined;
    if (!toyItem) {
      return null;
    }
    const toyId = this.toReplayId(toyItem['Enu']);
    if (!toyId) {
      return null;
    }
    const toyNameId = TOY_NAME_ID_BY_ID.get(toyId) ?? null;
    return {
      imagePath: toyNameId ? `/assets/art/Public/Public/Toys/${toyNameId}.png` : null,
      level: this.toNumberOrFallback(toyItem['Lvl'], 1),
    };
  }

  private getBoardLives(board: Record<string, unknown> | null): number | null {
    if (!board) {
      return null;
    }
    const direct =
      board['Lives'] ??
      board['lives'] ??
      board['Back'] ??
      board['health'] ??
      board['Health'];
    const parsed = this.toPositiveInt(direct);
    return parsed;
  }

  private getBattleOutcome(battle: ReplayBattleJson): number {
    const battleRecord = battle as unknown as Record<string, unknown>;
    return this.toNumberOrFallback(battleRecord['Outcome'], 3);
  }

  private getDisplayName(
    battle: ReplayBattleJson | undefined,
    key: 'User' | 'Opponent',
  ): string | null {
    const battleRecord = battle as unknown as Record<string, unknown> | null;
    if (!battleRecord) {
      return null;
    }
    const side = battleRecord[key];
    if (!this.isObject(side)) {
      return null;
    }
    const value = side['DisplayName'];
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private getRecord(
    value: Record<string, unknown>,
    key: string,
  ): Record<string, unknown> | null {
    const entry = value[key];
    return this.isObject(entry) ? (entry as Record<string, unknown>) : null;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private toPositiveInt(value: unknown): number | null {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    const whole = Math.trunc(parsed);
    return whole > 0 ? whole : null;
  }

  private toReplayId(value: unknown): string | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    return null;
  }

  private toNumberOrFallback(value: unknown, fallback: number): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

}
