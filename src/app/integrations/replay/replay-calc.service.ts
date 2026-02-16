import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';

import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalcParser,
  ReplayCalculatorState,
  ReplayMetaBoards,
  ReplayParseOptions,
} from './replay-calc-parser';
import { getReplayApiUrl } from './replay-api-endpoints';

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
                const message = replayId
                  ? `Replay exists (id: ${replayId}) but this API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle.`
                  : 'This replay API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle.';

                return throwError({
                  error: { error: message },
                  status: 400,
                });
              }),
              catchError(() =>
                throwError({
                  error: {
                    error:
                      'This replay API does not expose turn battle JSON. Configure a replay backend that supports /api/replay-battle.',
                  },
                  status: 400,
                }),
              ),
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
}
