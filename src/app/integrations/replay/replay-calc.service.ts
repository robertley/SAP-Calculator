import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalcParser,
  ReplayCalculatorState,
  ReplayMetaBoards,
  ReplayParseOptions,
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
}

interface ReplayTurnsResponse {
  replayId?: string;
  turns?: ReplayTurnEntry[] | null;
  genesisBuildModel?: ReplayBuildModelJson;
  abilityPetMap?: Record<string, string | number> | null;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReplayCalcService {
  private parser = new ReplayCalcParser();

  constructor(private http: HttpClient) {}

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
    return this.http
      .post<ReplayBattleResponse>(getReplayApiUrl('/replay-battle'), payload)
      .pipe(
        timeout(timeoutMs),
        catchError((error: HttpErrorResponse) => {
          if (error?.status !== 404 && error?.status !== 405) {
            return throwError(error);
          }

          return this.http
            .post<ReplayIndexResponse>(getReplayApiUrl('/replays'), {
              participationId: payload.Pid,
            })
            .pipe(
              timeout(timeoutMs),
              switchMap((indexResponse) => {
                const replayId = indexResponse?.replayId;
                if (!replayId) {
                  return throwError({
                    error: {
                      error:
                        'This replay API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle or /api/replays/:id/turns.',
                    },
                    status: 400,
                  });
                }

                return this.http
                  .get<ReplayTurnsResponse>(getReplayTurnsApiUrl(replayId))
                  .pipe(
                    timeout(timeoutMs),
                    map((turnsResponse) =>
                      this.buildReplayBattleResponseFromTurns(
                        turnsResponse,
                        payload.T,
                        replayId,
                      ),
                    ),
                  );
              }),
              catchError((fallbackError) => {
                if (fallbackError?.status === 404 || fallbackError?.status === 400) {
                  return throwError(fallbackError);
                }

                return throwError({
                  error: {
                    error:
                      'This replay API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle or /api/replays/:id/turns.',
                  },
                  status: 400,
                });
              }),
            );
        }),
      );
  }

  async checkReplayApiReachable(timeoutMs: number): Promise<boolean> {
    const result = await this.http
      .get(getReplayApiUrl('/health'))
      .pipe(
        timeout(timeoutMs),
        catchError(() => of(null)),
      )
      .toPromise();
    return Boolean(result);
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

  private buildReplayBattleResponseFromTurns(
    turnsResponse: ReplayTurnsResponse,
    requestedTurn: number,
    replayId: string,
  ): ReplayBattleResponse {
    const turns = turnsResponse?.turns ?? [];
    const byTurn = turns.find(
      (turn) => this.toFiniteNumber(turn?.turn) === requestedTurn,
    );
    const byIndex = requestedTurn > 0 ? turns[requestedTurn - 1] : null;
    const selectedTurn = byTurn ?? byIndex;

    if (!selectedTurn) {
      throw {
        error: {
          error: `Replay ${replayId} does not contain turn ${requestedTurn}.`,
        },
        status: 404,
      };
    }

    return {
      battle: {
        UserBoard: this.mapReplayTurnsSide(selectedTurn.user),
        OpponentBoard: this.mapReplayTurnsSide(selectedTurn.opponent),
      },
      genesisBuildModel: turnsResponse?.genesisBuildModel,
      abilityPetMap: turnsResponse?.abilityPetMap ?? null,
    };
  }
}
