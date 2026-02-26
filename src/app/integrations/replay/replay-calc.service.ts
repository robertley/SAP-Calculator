import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalcParser,
  ReplayCalculatorState,
  ReplayMetaBoards,
  ReplayParseOptions,
  buildReplayAbilityPetMapFromActions,
} from './replay-calc-parser';
import { getReplayApiUrl, getReplayTurnsApiUrl } from './replay-api-endpoints';

export interface ReplayBattleRequest {
  Pid: string;
  T: number;
  SapEmail?: string;
  SapPassword?: string;
}

export interface ReplayBattleResponse {
  battle?: ReplayBattleJson;
  genesisBuildModel?: ReplayBuildModelJson;
  abilityPetMap?: Record<string, string | number> | null;
  error?: string;
}

export interface ReplayApiHealthStatus {
  reachable: boolean;
  isReplayHealthContract: boolean;
}

interface ReplayIndexResponse {
  replayId?: string;
  status?: string;
  error?: string;
}

interface ReplayTurnsStats {
  turn?: number | null;
  victories?: number | null;
  health?: number | null;
  goldSpent?: number | null;
  rolls?: number | null;
  summons?: number | null;
  level3Sold?: number | null;
  transformed?: number | null;
}

interface ReplayTurnsPetStat {
  permanent?: number | null;
  temporary?: number | null;
  max?: number | null;
}

interface ReplayTurnsAbility {
  id?: string | number | null;
  level?: number | null;
  group?: number | null;
  triggersConsumed?: number | null;
}

interface ReplayMappedAbility {
  Enu: string;
  Lvl: number;
  Grop: number;
  TrCo: number;
}

interface ReplayTurnsPet {
  slot?: number | null;
  id?: string | number | null;
  level?: number | null;
  experience?: number | null;
  perkId?: string | number | null;
  attack?: ReplayTurnsPetStat | null;
  health?: ReplayTurnsPetStat | null;
  mana?: number | null;
  cosmetic?: number | null;
  abilities?: ReplayTurnsAbility[] | null;
}

interface ReplayTurnsSide {
  stats?: ReplayTurnsStats | null;
  pets?: ReplayTurnsPet[] | null;
}

interface ReplayTurnEntry {
  turn?: number | string | null;
  user?: ReplayTurnsSide | null;
  opponent?: ReplayTurnsSide | null;
  turnNumber?: number | string | null;
  playerGoldSpent?: number | null;
  opponentGoldSpent?: number | null;
  playerRolls?: number | null;
  opponentRolls?: number | null;
  playerSummons?: number | null;
  opponentSummons?: number | null;
  pets?: {
    player?: ReplaySummaryPet[] | null;
    opponent?: ReplaySummaryPet[] | null;
  } | null;
}

interface ReplaySummaryPet {
  position?: number | null;
  petName?: string | null;
  level?: number | null;
  attack?: number | null;
  health?: number | null;
  mana?: number | null;
  perk?: string | number | null;
  abilities?: ReplayTurnsAbility[] | null;
  experience?: number | null;
  id?: string | number | null;
  [key: string]: unknown;
}

interface ReplayTurnActionLike {
  Type?: number | null;
  Turn?: number | string | null;
  turn?: number | string | null;
  turnNumber?: number | string | null;
  Build?: string | null;
  Battle?: string | null;
  Mode?: string | null;
  OpponentGoldSpent?: number | null;
  user?: ReplayTurnsSide | null;
  opponent?: ReplayTurnsSide | null;
  playerPets?: ReplaySummaryPet[] | null;
  opponentPets?: ReplaySummaryPet[] | null;
  replay?: {
    id?: string | null;
  } | null;
}

type ReplayJsonObject = Record<string, unknown>;

interface ReplayTurnsResponse {
  replayId?: string;
  replay?: {
    id?: string;
    raw_json?: {
      Actions?: ReplayTurnActionLike[];
      GenesisBuildModel?: ReplayBuildModelJson;
    };
    GenesisBuildModel?: ReplayBuildModelJson;
  } | null;
  turns?: ReplayTurnActionLike[] | null;
  genesisBuildModel?: ReplayBuildModelJson;
  abilityPetMap?: Record<string, string | number> | null;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReplayCalcService {
  private parser = new ReplayCalcParser();

  constructor(private http: HttpClient) { }

  parseReplayForCalculator(
    battleJson: ReplayBattleJson,
    buildModel?: ReplayBuildModelJson,
    metaBoards?: ReplayMetaBoards,
    options?: ReplayParseOptions,
  ): ReplayCalculatorState {
    return this.parser.parseReplayForCalculator(
      battleJson,
      buildModel,
      metaBoards,
      options,
    );
  }

  buildCustomPacksFromGenesis(
    buildModel?: ReplayBuildModelJson,
    battleJson?: ReplayBattleJson,
  ) {
    return this.parser.buildCustomPacksFromGenesis(buildModel, battleJson);
  }

  generateCalculatorLink(calculatorState: ReplayCalculatorState): string {
    return this.parser.generateCalculatorLink(calculatorState);
  }

  fetchReplayBattle(
    payload: ReplayBattleRequest,
    timeoutMs: number,
  ): Observable<ReplayBattleResponse> {
    return this.fetchReplayBattleFromTurnsApi(payload, timeoutMs);
  }


  private fetchReplayBattleFromTurnsApi(
    payload: ReplayBattleRequest,
    timeoutMs: number,
  ): Observable<ReplayBattleResponse> {
    const participationId = String(payload.Pid);

    return this.fetchReplayBattleByReplayId(
      participationId,
      payload.T,
      timeoutMs,
    ).pipe(
      catchError((directGetError) => {
        if (directGetError?.status !== 404) {
          return this.normalizeReplayFetchError(directGetError);
        }

        return this.http
          .post<ReplayIndexResponse>(getReplayApiUrl('/replays'), {
            Pid: participationId,
            participationId,
          })
          .pipe(
            timeout(timeoutMs),
            switchMap((indexResponse) => {
              const replayId = indexResponse?.replayId;
              if (!replayId) {
                return throwError({
                  error: {
                    error:
                      'Replay indexing did not return a replayId.',
                  },
                  status: 400,
                });
              }
              return this.fetchReplayBattleByReplayId(
                String(replayId),
                payload.T,
                timeoutMs,
              );
            }),
            catchError((fallbackError) =>
              this.normalizeReplayFetchError(fallbackError),
            ),
          );
      }),
    );
  }

  private fetchReplayBattleByReplayId(
    replayId: string,
    requestedTurn: number,
    timeoutMs: number,
  ): Observable<ReplayBattleResponse> {
    return this.http.get<ReplayTurnsResponse>(getReplayTurnsApiUrl(replayId)).pipe(
      timeout(timeoutMs),
      map((turnsResponse) =>
        this.buildReplayBattleResponseFromTurns(
          turnsResponse,
          requestedTurn,
          replayId,
        ),
      ),
    );
  }

  private normalizeReplayFetchError(error: unknown): Observable<never> {
    const status = (error as { status?: number } | null)?.status;
    if (status === 404 || status === 400) {
      return throwError(error);
    }

    return throwError({
      error: {
        error:
          'This replay API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle or /api/replays/:id/turns.',
      },
      status: 400,
    });
  }

  async checkReplayApiHealth(timeoutMs: number): Promise<ReplayApiHealthStatus> {
    const result = await this.http
      .get<unknown>(getReplayApiUrl('/health'))
      .pipe(
        timeout(timeoutMs),
        map((response) => ({
          reachable: true,
          isReplayHealthContract: this.isReplayHealthResponse(response),
        })),
        catchError(() =>
          of({
            reachable: false,
            isReplayHealthContract: false,
          }),
        ),
      )
      .toPromise();
    return (
      result ?? {
        reachable: false,
        isReplayHealthContract: false,
      }
    );
  }

  async checkReplayApiReachable(timeoutMs: number): Promise<boolean> {
    const status = await this.checkReplayApiHealth(timeoutMs);
    return status.reachable;
  }

  private isReplayHealthResponse(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const response = value as {
      ok?: unknown;
      hasCredentials?: unknown;
      tokenLoaded?: unknown;
    };

    return (
      typeof response.ok === 'boolean' &&
      typeof response.hasCredentials === 'boolean' &&
      typeof response.tokenLoaded === 'boolean'
    );
  }

  private toFiniteNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
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

  private isRecord(value: unknown): value is ReplayJsonObject {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private parseJsonObject(raw: unknown): ReplayJsonObject | null {
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private mapReplayTurnsPet(pet: ReplayTurnsPet): Record<string, unknown> {
    const abilities = (pet?.abilities ?? [])
      .map((ability) => {
        const abilityId = this.toReplayId(ability?.id);
        if (!abilityId) {
          return null;
        }
        return {
          Enu: abilityId,
          Lvl: this.toFiniteNumber(ability?.level) ?? 1,
          Grop: this.toFiniteNumber(ability?.group) ?? 0,
          TrCo: this.toFiniteNumber(ability?.triggersConsumed) ?? 0,
        };
      })
      .filter((ability): ability is ReplayMappedAbility => ability !== null);

    return {
      Enu: this.toReplayId(pet?.id),
      Lvl: this.toFiniteNumber(pet?.level) ?? 1,
      Exp: this.toFiniteNumber(pet?.experience) ?? 0,
      Perk: this.toReplayId(pet?.perkId),
      At: {
        Perm: this.toFiniteNumber(pet?.attack?.permanent) ?? 0,
        Temp: this.toFiniteNumber(pet?.attack?.temporary) ?? 0,
        Max: this.toFiniteNumber(pet?.attack?.max),
      },
      Hp: {
        Perm: this.toFiniteNumber(pet?.health?.permanent) ?? 0,
        Temp: this.toFiniteNumber(pet?.health?.temporary) ?? 0,
        Max: this.toFiniteNumber(pet?.health?.max),
      },
      Mana: this.toFiniteNumber(pet?.mana) ?? 0,
      Cosm: this.toFiniteNumber(pet?.cosmetic) ?? 0,
      Poi: {
        x: this.toFiniteNumber(pet?.slot) ?? 0,
      },
      Abil: abilities,
      ...pet,
    };
  }

  private mapReplaySummaryPet(pet: ReplaySummaryPet): Record<string, unknown> {
    const abilities = (pet?.abilities ?? [])
      .map((ability) => {
        const abilityId = this.toReplayId(ability?.id);
        if (!abilityId) {
          return null;
        }
        return {
          Enu: abilityId,
          Lvl: this.toFiniteNumber(ability?.level) ?? 1,
          Grop: this.toFiniteNumber(ability?.group) ?? 0,
          TrCo: this.toFiniteNumber(ability?.triggersConsumed) ?? 0,
        };
      })
      .filter((ability): ability is ReplayMappedAbility => ability !== null);

    return {
      Enu: this.toReplayId(pet?.petName) || this.toReplayId(pet?.id),
      Lvl: this.toFiniteNumber(pet?.level) ?? 1,
      Exp: this.toFiniteNumber(pet?.experience) ?? 0,
      Perk: this.toReplayId(pet?.perk),
      At: {
        Perm: this.toFiniteNumber(pet?.attack) ?? 0,
        Temp: 0,
        Max: null,
      },
      Hp: {
        Perm: this.toFiniteNumber(pet?.health) ?? 0,
        Temp: 0,
        Max: null,
      },
      Mana: this.toFiniteNumber(pet?.mana) ?? 0,
      Cosm: 0,
      Poi: {
        x: this.toFiniteNumber(pet?.position) ?? 0,
      },
      Abil: abilities,
      ...pet,
    };
  }

  private mapReplayTurnsSide(side?: ReplayTurnsSide | null): Record<string, unknown> {
    const stats = side?.stats ?? null;
    return {
      Tur: this.toFiniteNumber(stats?.turn) ?? 1,
      Vic: this.toFiniteNumber(stats?.victories) ?? 0,
      Back: this.toFiniteNumber(stats?.health) ?? 0,
      GoSp: this.toFiniteNumber(stats?.goldSpent) ?? 0,
      Rold: this.toFiniteNumber(stats?.rolls) ?? 0,
      MiSu: this.toFiniteNumber(stats?.summons) ?? 0,
      MSFL: this.toFiniteNumber(stats?.level3Sold) ?? 0,
      TrTT: this.toFiniteNumber(stats?.transformed) ?? 0,
      Mins: {
        Items: (side?.pets ?? []).map((pet) => this.mapReplayTurnsPet(pet)),
      },
    };
  }

  private mapReplaySummarySide(
    turn: ReplayTurnEntry,
    side: 'player' | 'opponent',
    buildJson?: ReplayJsonObject | null,
  ): Record<string, unknown> {
    if (buildJson && side === 'player') {
      // If we have direct Build JSON (for player), return it
      return buildJson;
    }

    const isPlayer = side === 'player';
    const pets =
      (isPlayer ? turn?.pets?.player : turn?.pets?.opponent) ?? [];
    return {
      Tur:
        this.toFiniteNumber((turn as { Turn?: unknown })?.Turn) ??
        this.toFiniteNumber(turn?.turnNumber) ??
        this.toFiniteNumber(turn?.turn) ??
        1,
      Vic: 0,
      Back: 0,
      GoSp: this.toFiniteNumber(
        isPlayer ? turn?.playerGoldSpent : turn?.opponentGoldSpent,
      ) ?? 0,
      Rold: this.toFiniteNumber(
        isPlayer ? turn?.playerRolls : turn?.opponentRolls,
      ) ?? 0,
      MiSu: this.toFiniteNumber(
        isPlayer ? turn?.playerSummons : turn?.opponentSummons,
      ) ?? 0,
      MSFL: 0,
      TrTT: 0,
      Mins: {
        Items: pets.map((pet) => this.mapReplaySummaryPet(pet)),
      },
    };
  }

  private buildReplayBattleResponseFromTurns(
    turnsResponse: ReplayTurnsResponse,
    requestedTurn: number,
    replayId: string,
  ): ReplayBattleResponse {
    const turns = turnsResponse?.turns ?? [];

    const byTurnActions = turns.filter((action) => {
      const turnNum = this.toFiniteNumber(action?.Turn) ?? this.toFiniteNumber(action?.turn) ?? this.toFiniteNumber(action?.turnNumber);
      return turnNum === requestedTurn;
    });

    // Prefer Battle (Type 1) because it typically contains both UserBoard and OpponentBoard in its Battle JSON.
    // Build (Type 0) often only has the player's 'Bor' state.
    const selectedTurn = byTurnActions.find((a) => a.Type === 1) ??
      byTurnActions.find((a) => a.Type === 0) ??
      byTurnActions[0] ??
      (requestedTurn > 0 && requestedTurn <= turns.length ? turns[requestedTurn - 1] : null);

    if (!selectedTurn) {
      throw {
        error: {
          error: `Replay ${replayId} does not contain turn ${requestedTurn}.`,
        },
        status: 404,
      };
    }

    const hasRawSides = Boolean(selectedTurn?.user || selectedTurn?.opponent);
    let buildJson: ReplayJsonObject | null = null;
    let battleJson: ReplayJsonObject | null = null;

    if (!hasRawSides) {
      // Try to find Build and Battle data across ALL actions for this turn
      const buildAction = byTurnActions.find((a) => a.Build);
      if (buildAction) {
        const parsed = this.parseJsonObject(buildAction.Build);
        const bor = this.isRecord(parsed?.Bor) ? parsed.Bor : null;
        buildJson = bor ?? parsed;
      }

      const battleAction = byTurnActions.find((a) => a.Battle);
      if (battleAction) {
        const parsed = this.parseJsonObject(battleAction.Battle);
        if (parsed?.UserBoard || parsed?.OpponentBoard) {
          battleJson = parsed;
        }
      }

      // If opponent board is still missing, try the Mode string (common in summarized replays)
      if (!battleJson?.OpponentBoard) {
        const modeAction = byTurnActions.find((a) => a.Mode);
        if (modeAction) {
          const parsed = this.parseJsonObject(modeAction.Mode);
          const opponents = Array.isArray(parsed?.Opponents) ? parsed.Opponents : [];
          const opp = this.isRecord(opponents[0]) ? opponents[0] : null;
          if (opp) {
            if (!battleJson) {
              battleJson = {};
            }
            battleJson.OpponentBoard = {
              Mins: { Items: opp.Minions },
              Rel: { Items: opp.Relics },
              Pack: opp.Pack,
              Tur: requestedTurn,
              GoSp: modeAction.OpponentGoldSpent ?? 0,
            };
          }
        }
      }
    }

    let abilityPetMap = turnsResponse?.abilityPetMap ?? null;
    if (!abilityPetMap && turnsResponse?.replay?.raw_json?.Actions) {
      abilityPetMap = buildReplayAbilityPetMapFromActions(
        turnsResponse.replay.raw_json.Actions,
      );
      // If we still have nothing, check if an action in the turn has pre-parsed pets.
      const turnWithPets =
        byTurnActions.find((a) => a.playerPets || a.opponentPets) ?? selectedTurn;
      if (!buildJson && turnWithPets?.playerPets) {
        buildJson = { Mins: { Items: turnWithPets.playerPets } };
      }
      if (!battleJson?.OpponentBoard && turnWithPets?.opponentPets) {
        if (!battleJson) {
          battleJson = {};
        }
        battleJson.OpponentBoard = { Mins: { Items: turnWithPets.opponentPets } };
      }
    }

    return {
      battle: hasRawSides
        ? {
          UserBoard: this.mapReplayTurnsSide(selectedTurn?.user),
          OpponentBoard: this.mapReplayTurnsSide(selectedTurn?.opponent),
        }
        : {
          UserBoard: this.mapReplaySummarySide(
            selectedTurn as ReplayTurnEntry,
            'player',
            buildJson ?? (this.isRecord(battleJson?.UserBoard) ? battleJson.UserBoard : null),
          ),
          OpponentBoard: this.mapReplaySummarySide(
            selectedTurn as ReplayTurnEntry,
            'opponent',
            this.isRecord(battleJson?.OpponentBoard) ? battleJson.OpponentBoard : null,
          ),
        },
      genesisBuildModel:
        turnsResponse?.genesisBuildModel ??
        turnsResponse?.replay?.raw_json?.GenesisBuildModel ??
        turnsResponse?.replay?.GenesisBuildModel,
      abilityPetMap,
    };
  }
}
