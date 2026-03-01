import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {
  ReplayCalcService,
  ReplayBattleResponse,
  ReplayIndexUploadStatus,
  ReplayTurnsResponse,
} from 'app/integrations/replay/replay-calc.service';
import {
  ReplayBattleJson,
  ReplayBoardJson,
  ReplayBuildModelJson,
  ReplayMetaBoards,
  ReplayParseOptions,
  buildReplayAbilityPetMapFromActions,
} from 'app/integrations/replay/replay-calc-parser';
import { parseReplayCode } from 'app/integrations/replay/replay-code';
import { ReplayOddsImageService } from 'app/integrations/replay/replay-odds-image.service';
import {
  ReplayPositioningImageProgress,
  ReplayPositioningImageService,
} from 'app/integrations/replay/replay-positioning-image.service';
import { TimedStatusController } from 'app/ui/shared/timed-status.controller';

interface ReplayActionEntry {
  Type?: number;
  Turn?: number | string | null;
  Battle?: string;
  Build?: string | null;
  Mode?: string | null;
}

interface ReplayImportPayload {
  Pid?: string;
  pid?: string;
  T?: number;
  t?: number;
  Actions?: ReplayActionEntry[];
  UserBoard?: ReplayBoardJson;
  OpponentBoard?: ReplayBoardJson;
  GenesisBuildModel?: ReplayBuildModelJson;
  AbilityPetMap?: Record<string, string | number> | null;
  raw_json?: {
    Actions?: ReplayActionEntry[] | null;
    GenesisBuildModel?: ReplayBuildModelJson | null;
  } | null;
  turns?: unknown[] | null;
  replay?: {
    id?: string | null;
    raw_json?: {
      Actions?: ReplayActionEntry[] | null;
      GenesisBuildModel?: ReplayBuildModelJson | null;
    } | null;
    GenesisBuildModel?: ReplayBuildModelJson | null;
  } | null;
}

interface ReplayTurnsLikePayload extends ReplayImportPayload {
  turns: unknown[];
}

interface OddsImageSourcePayload {
  replay: Record<string, unknown>;
  simulationCount: number;
  optimizationSide?: 'player' | 'opponent';
  abilityPetMap?: Record<string, string | number> | null;
}

@Component({
  selector: 'app-import-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './import-calculator.component.html',
  styleUrls: ['./import-calculator.component.scss'],
})
export class ImportCalculatorComponent implements OnInit, OnDestroy {
  @Input()
  importFunc: (importVal: string, options?: { resetBattle?: boolean }) => boolean;
  readonly pidExample = '{"Pid":"ce7b41c5-d69d-4152-8c5d-0d5fee869f9f","T":6}';

  formGroup: FormGroup = new FormGroup({
    calcCode: new FormControl(null, Validators.required),
    turn: new FormControl(1, Validators.min(1)),
    oddsSimulations: new FormControl(100, Validators.min(1)),
    positioningSide: new FormControl('player'),
  });

  errorMessage = '';
  statusMessage = '';
  statusTone: 'success' | 'error' | 'warning' = 'success';
  loading = false;
  oddsImageLoading = false;
  positioningImageLoading = false;
  oddsImageBlob: Blob | null = null;
  oddsImagePreviewUrl: string | null = null;
  oddsImageFileName = '';
  positioningImageBlob: Blob | null = null;
  positioningImagePreviewUrl: string | null = null;
  positioningImageFileName = '';
  positioningProgressPercent = 0;
  positioningProgressMessage = '';
  private positioningBuildAbortController: AbortController | null = null;
  private destroyed = false;
  private readonly replayTimeoutMs = 10000;
  private readonly replayHealthTimeoutMs = 2500;
  private readonly maxPositioningSimulations = 50;
  private readonly statusController = new TimedStatusController<
    'success' | 'error' | 'warning'
  >(
    (message) => {
      this.statusMessage = message;
    },
    (tone) => {
      this.statusTone = tone;
    },
    3000,
    () => {
      this.cdr.markForCheck();
    },
  );

  constructor(
    private replayCalcService: ReplayCalcService,
    private replayOddsImageService: ReplayOddsImageService,
    private replayPositioningImageService: ReplayPositioningImageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.destroyed = false;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.statusController.dispose();
    this.cancelPositioningBuild();
    this.clearOddsPreview();
    this.clearPositioningPreview();
  }

  private isReplayTurnsPayload(
    value: ReplayImportPayload,
  ): value is ReplayTurnsLikePayload {
    return Array.isArray(value.turns);
  }

  submit() {
    this.errorMessage = '';
    this.clearStatus();
    const calcControl = this.formGroup.get('calcCode');
    const rawInput = calcControl?.value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste calculator JSON or replay JSON.';
      return;
    }

    const replayCodePayload = parseReplayCode(rawInput);
    if (replayCodePayload?.battle) {
      this.importReplayBattle(
        replayCodePayload.battle,
        replayCodePayload.genesisBuildModel,
        undefined,
        { abilityPetMap: replayCodePayload.abilityPetMap ?? null },
      );
      return;
    }

    let parsedInput: ReplayImportPayload;
    try {
      parsedInput = JSON.parse(rawInput) as ReplayImportPayload;
    } catch (error) {
      if (this.importFunc(rawInput)) {
        this.setStatus('Import successful.', 'success');
        return;
      }
      if (this.tryReplayPid(rawInput)) {
        return;
      }
      this.errorMessage =
        'Invalid JSON. Please paste a valid calculator or replay JSON.';
      return;
    }

    if ((parsedInput?.Pid || parsedInput?.pid) && !parsedInput?.Actions) {
      const pidValue = parsedInput?.Pid ?? parsedInput?.pid;
      const turnNumber = Number(
        parsedInput?.T ?? parsedInput?.t ?? this.formGroup.get('turn').value,
      );
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      this.setLoading(true);
      this.replayCalcService
        .checkReplayApiHealth(this.replayHealthTimeoutMs)
        .then((healthStatus) => {
          if (!healthStatus.reachable) {
            this.errorMessage =
              'Replay API is not reachable. Ensure the replay server is running.';
            this.setLoading(false);
            this.cdr.markForCheck();
            return;
          }
          if (!healthStatus.isReplayHealthContract) {
            this.setStatus(
              'Replay API is reachable, but /api/health is not the replay backend format. Continuing lookup.',
              'warning',
            );
          }
          console.info('[replay] health check reachable, requesting battle');
          this.replayCalcService
            .fetchReplayBattle(
              {
                Pid: pidValue,
                T: turnNumber,
                onReplayIndexUploadStatus: (status: ReplayIndexUploadStatus) =>
                  this.handleReplayIndexUploadStatus(status),
              },
              this.replayTimeoutMs,
            )
            .pipe(
              finalize(() => {
                this.setLoading(false);
                console.info('[replay] replay-battle request finalized');
              }),
            )
            .subscribe({
              next: (response: ReplayBattleResponse) => {
                const battleJson = response?.battle;
                if (!battleJson) {
                  this.errorMessage = 'Replay lookup failed to return a battle.';
                  return;
                }
                this.importReplayBattle(
                  battleJson,
                  response?.genesisBuildModel,
                  undefined,
                  { abilityPetMap: response?.abilityPetMap ?? null },
                  { resetBattle: true, suppressSuccessStatus: true },
                );
              },
              error: (error) => {
                if (error?.name === 'TimeoutError') {
                  this.errorMessage =
                    'Replay lookup timed out. Ensure the replay server is running.';
                  this.cdr.markForCheck();
                  return;
                }
                this.errorMessage =
                  error?.error?.error || 'Failed to fetch replay data.';
                this.cdr.markForCheck();
              },
            });
        })
        .catch(() => {
          this.setLoading(false);
          this.errorMessage = 'Failed to reach the replay API.';
          this.cdr.markForCheck();
        });
      return;
    }

    if (parsedInput?.UserBoard && parsedInput?.OpponentBoard) {
      this.importReplayBattle(parsedInput, parsedInput?.GenesisBuildModel, {
        userBoard: parsedInput?.UserBoard,
        opponentBoard: parsedInput?.OpponentBoard,
      }, {
        abilityPetMap: parsedInput?.AbilityPetMap ?? null,
      });
      return;
    }

    if (parsedInput?.Actions) {
      const turnNumber = Number(
        this.formGroup.get('turn').value ?? parsedInput?.T,
      );
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      let battleIndex = 0;
      let battleJson = null;
      for (const action of parsedInput.Actions) {
        if (action?.Type !== 0 || !action?.Battle) {
          continue;
        }
        battleIndex += 1;
        if (battleIndex === turnNumber) {
          try {
            battleJson = JSON.parse(action.Battle);
          } catch (error) {
            this.errorMessage = `Failed to parse battle JSON for turn ${turnNumber}.`;
            return;
          }
          break;
        }
      }
      if (!battleJson) {
        this.errorMessage = `No battle found for turn ${turnNumber}.`;
        return;
      }
      const abilityPetMap =
        parsedInput?.AbilityPetMap ??
        buildReplayAbilityPetMapFromActions(parsedInput.Actions);
      this.importReplayBattle(battleJson, parsedInput?.GenesisBuildModel, {
        userBoard: parsedInput?.UserBoard,
        opponentBoard: parsedInput?.OpponentBoard,
      }, {
        abilityPetMap,
      });
      return;
    }

    if (this.isReplayTurnsPayload(parsedInput)) {
      const turnNumber = Number(this.formGroup.get('turn').value);
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }

      try {
        const replayServiceWithTurnsBuilder = this.replayCalcService as unknown as {
          buildReplayBattleResponseFromTurns: (
            turnsResponse: unknown,
            requestedTurn: number,
            replayId: string,
          ) => ReplayBattleResponse;
        };
        const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
          parsedInput,
          turnNumber,
          parsedInput?.replay?.id || 'manual-import',
        );
        if (response?.battle) {
          this.importReplayBattle(
            response.battle,
            response.genesisBuildModel,
            undefined,
            { abilityPetMap: response.abilityPetMap ?? null },
            { resetBattle: true },
          );
          return;
        }
      } catch (error) {
        void error;
        this.errorMessage = 'Failed to process turns JSON.';
        return;
      }
    }


    if (this.importFunc(rawInput)) {
      this.setStatus('Import successful.', 'success');
    } else {
      this.errorMessage = 'Import failed.';
    }
  }

  buildOddsImage() {
    this.errorMessage = '';
    this.clearStatus();
    const rawInput = this.formGroup.get('calcCode')?.value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste replay JSON or a replay Pid first.';
      return;
    }

    const simulationCount = this.getOddsSimulationCount();
    const requestedTurn = this.getRequestedTurn();

    const replayCodePayload = parseReplayCode(rawInput);
    if (replayCodePayload?.battle) {
      const replayPayload = this.buildSingleBattleReplayPayload(
        replayCodePayload.battle,
        replayCodePayload.turn ?? requestedTurn,
        replayCodePayload.genesisBuildModel ?? null,
        replayCodePayload.abilityPetMap ?? null,
      );
      this.requestOddsImageDownload({
        replay: replayPayload,
        simulationCount,
        abilityPetMap: replayCodePayload.abilityPetMap ?? null,
      });
      return;
    }

    let parsedInput: ReplayImportPayload;
    try {
      parsedInput = JSON.parse(rawInput) as ReplayImportPayload;
    } catch {
      const pid = rawInput.trim();
      if (this.looksLikePid(pid)) {
        this.fetchReplayJsonAndBuildOddsImage(pid, requestedTurn, simulationCount);
        return;
      }
      this.errorMessage = 'Invalid JSON. Paste replay JSON or a replay Pid.';
      return;
    }

    if ((parsedInput?.Pid || parsedInput?.pid) && !parsedInput?.Actions) {
      const pid = String(parsedInput?.Pid ?? parsedInput?.pid);
      this.fetchReplayJsonAndBuildOddsImage(pid, requestedTurn, simulationCount);
      return;
    }

    const request = this.buildOddsImageSourceFromPayload(
      parsedInput,
      requestedTurn,
      simulationCount,
    );
    if (!request) {
      this.errorMessage =
        'Replay JSON must include Actions, turns, replay.raw_json.Actions, or UserBoard/OpponentBoard.';
      return;
    }
    this.requestOddsImageDownload(request);
  }

  buildPositioningImage() {
    this.errorMessage = '';
    this.clearStatus();
    const rawInput = this.formGroup.get('calcCode')?.value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste replay JSON or a replay Pid first.';
      return;
    }

    const simulationCount = this.getPositioningSimulationCount();
    const requestedTurn = this.getRequestedTurn();
    const optimizationSide = this.getPositioningSide();

    const replayCodePayload = parseReplayCode(rawInput);
    if (replayCodePayload?.battle) {
      const replayPayload = this.buildSingleBattleReplayPayload(
        replayCodePayload.battle,
        replayCodePayload.turn ?? requestedTurn,
        replayCodePayload.genesisBuildModel ?? null,
        replayCodePayload.abilityPetMap ?? null,
      );
      this.requestPositioningImageDownload({
        replay: replayPayload,
        simulationCount,
        optimizationSide,
        abilityPetMap: replayCodePayload.abilityPetMap ?? null,
      });
      return;
    }

    let parsedInput: ReplayImportPayload;
    try {
      parsedInput = JSON.parse(rawInput) as ReplayImportPayload;
    } catch {
      const pid = rawInput.trim();
      if (this.looksLikePid(pid)) {
        this.fetchReplayJsonAndBuildPositioningImage(
          pid,
          requestedTurn,
          simulationCount,
          optimizationSide,
        );
        return;
      }
      this.errorMessage = 'Invalid JSON. Paste replay JSON or a replay Pid.';
      return;
    }

    if ((parsedInput?.Pid || parsedInput?.pid) && !parsedInput?.Actions) {
      const pid = String(parsedInput?.Pid ?? parsedInput?.pid);
      this.fetchReplayJsonAndBuildPositioningImage(
        pid,
        requestedTurn,
        simulationCount,
        optimizationSide,
      );
      return;
    }

    const request = this.buildOddsImageSourceFromPayload(
      parsedInput,
      requestedTurn,
      simulationCount,
    );
    if (!request) {
      this.errorMessage =
        'Replay JSON must include Actions, turns, replay.raw_json.Actions, or UserBoard/OpponentBoard.';
      return;
    }
    this.requestPositioningImageDownload({
      ...request,
      optimizationSide,
    });
  }

  private importReplayBattle(
    battleJson: ReplayBattleJson,
    buildModel?: ReplayBuildModelJson,
    metaBoards?: ReplayMetaBoards,
    parseOptions?: ReplayParseOptions,
    options?: { resetBattle?: boolean; suppressSuccessStatus?: boolean },
  ) {
    const calculatorState = this.replayCalcService.parseReplayForCalculator(
      battleJson,
      buildModel,
      metaBoards,
      parseOptions,
    );
    if (
      this.importFunc(JSON.stringify(calculatorState), {
        resetBattle: options?.resetBattle,
      })
    ) {
      if (!options?.suppressSuccessStatus) {
        this.setStatus('Import successful.', 'success');
      }
      return;
    }
    this.errorMessage = 'Import failed.';
  }

  private tryReplayPid(rawInput: string): boolean {
    const pid = rawInput?.trim();
    if (!pid) {
      return false;
    }
    const looksLikePid = /^[a-f0-9-]{16,}$/i.test(pid) || /^\d+$/.test(pid);
    if (!looksLikePid) {
      return false;
    }
    const turnNumber = Number(this.formGroup.get('turn').value);
    if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
      this.errorMessage = 'Enter a valid turn number.';
      return true;
    }
    this.setLoading(true);
    this.replayCalcService
      .checkReplayApiHealth(this.replayHealthTimeoutMs)
      .then((healthStatus) => {
        if (!healthStatus.reachable) {
          this.errorMessage =
            'Replay API is not reachable. Ensure the replay server is running.';
          this.setLoading(false);
          this.cdr.markForCheck();
          return;
        }
        if (!healthStatus.isReplayHealthContract) {
          this.setStatus(
            'Replay API is reachable, but /api/health is not the replay backend format. Continuing lookup.',
            'warning',
          );
        }
        console.info('[replay] health check reachable, requesting battle');
        this.replayCalcService
          .fetchReplayBattle(
            {
              Pid: pid,
              T: turnNumber,
              onReplayIndexUploadStatus: (status: ReplayIndexUploadStatus) =>
                this.handleReplayIndexUploadStatus(status),
            },
            this.replayTimeoutMs,
          )
          .pipe(
            finalize(() => {
              this.setLoading(false);
              console.info('[replay] replay-battle request finalized');
            }),
          )
          .subscribe({
            next: (response: ReplayBattleResponse) => {
              const battleJson = response?.battle;
              if (!battleJson) {
                this.errorMessage = 'Replay lookup failed to return a battle.';
                return;
              }
              this.importReplayBattle(
                battleJson,
                response?.genesisBuildModel,
                undefined,
                { abilityPetMap: response?.abilityPetMap ?? null },
                { resetBattle: true, suppressSuccessStatus: true },
              );
            },
            error: (error) => {
              if (error?.name === 'TimeoutError') {
                this.errorMessage =
                  'Replay lookup timed out. Ensure the replay server is running.';
                this.cdr.markForCheck();
                return;
              }
              this.errorMessage =
                error?.error?.error || 'Failed to fetch replay data.';
              this.cdr.markForCheck();
            },
          });
      })
      .catch(() => {
        this.setLoading(false);
        this.errorMessage = 'Failed to reach the replay API.';
        this.cdr.markForCheck();
      });
    return true;
  }

  private handleReplayIndexUploadStatus(status: ReplayIndexUploadStatus): void {
    if (status.outcome === 'success') {
      this.setStatus(status.message, 'success');
      this.cdr.markForCheck();
      return;
    }
    this.setStatus(status.message, 'warning');
    this.cdr.markForCheck();
  }

  private fetchReplayJsonAndBuildOddsImage(
    replayId: string,
    turnNumber: number,
    simulationCount: number,
  ): void {
    this.setOddsImageLoading(true);
    this.replayCalcService
      .checkReplayApiHealth(this.replayHealthTimeoutMs)
      .then((healthStatus) => {
        if (!healthStatus.reachable) {
          this.errorMessage =
            'Replay API is not reachable. Ensure the replay backend is available.';
          this.setOddsImageLoading(false);
          this.cdr.markForCheck();
          return;
        }
        if (!healthStatus.isReplayHealthContract) {
          this.setStatus(
            'Replay API is reachable, but /api/health is not the replay backend format. Continuing lookup.',
            'warning',
          );
        }

        this.replayCalcService
          .fetchReplayTurns(
            {
              Pid: replayId,
              T: turnNumber,
              onReplayIndexUploadStatus: (status: ReplayIndexUploadStatus) =>
                this.handleReplayIndexUploadStatus(status),
            },
            this.replayTimeoutMs,
          )
          .subscribe({
            next: (turnsResponse: ReplayTurnsResponse) => {
              if (this.destroyed) {
                this.setPositioningImageLoading(false);
                return;
              }
              void this.resolveOddsReplayPayloadFromTurns(
                turnsResponse,
                replayId,
              )
                .then((replayPayload) => {
                  this.requestOddsImageDownload(
                    {
                      replay: replayPayload,
                      simulationCount,
                      abilityPetMap: turnsResponse?.abilityPetMap ?? null,
                    },
                    replayId,
                  );
                })
                .catch((error: unknown) => {
                  this.handleOddsImageError(error);
                  this.setOddsImageLoading(false);
                });
            },
            error: (error) => {
              this.errorMessage =
                error?.error?.error || 'Failed to fetch replay JSON from replay API.';
              this.setOddsImageLoading(false);
              this.cdr.markForCheck();
            },
          });
      })
      .catch(() => {
        this.setOddsImageLoading(false);
        this.errorMessage = 'Failed to reach the replay API.';
        this.cdr.markForCheck();
      });
  }

  private fetchReplayJsonAndBuildPositioningImage(
    replayId: string,
    turnNumber: number,
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
  ): void {
    this.setPositioningImageLoading(true);
    this.replayCalcService
      .checkReplayApiHealth(this.replayHealthTimeoutMs)
      .then((healthStatus) => {
        if (!healthStatus.reachable) {
          this.errorMessage =
            'Replay API is not reachable. Ensure the replay backend is available.';
          this.setPositioningImageLoading(false);
          this.cdr.markForCheck();
          return;
        }
        if (!healthStatus.isReplayHealthContract) {
          this.setStatus(
            'Replay API is reachable, but /api/health is not the replay backend format. Continuing lookup.',
            'warning',
          );
        }

        this.replayCalcService
          .fetchReplayTurns(
            {
              Pid: replayId,
              T: turnNumber,
              onReplayIndexUploadStatus: (status: ReplayIndexUploadStatus) =>
                this.handleReplayIndexUploadStatus(status),
            },
            this.replayTimeoutMs,
          )
          .subscribe({
            next: (turnsResponse: ReplayTurnsResponse) => {
              void this.resolveOddsReplayPayloadFromTurns(
                turnsResponse,
                replayId,
              )
                .then((replayPayload) => {
                  if (this.destroyed) {
                    this.setPositioningImageLoading(false);
                    return;
                  }
                  this.requestPositioningImageDownload(
                    {
                      replay: replayPayload,
                      simulationCount,
                      optimizationSide,
                      abilityPetMap: turnsResponse?.abilityPetMap ?? null,
                    },
                    replayId,
                  );
                })
                .catch((error: unknown) => {
                  this.handleOddsImageError(error);
                  this.setPositioningImageLoading(false);
                });
            },
            error: (error) => {
              this.errorMessage =
                error?.error?.error || 'Failed to fetch replay JSON from replay API.';
              this.setPositioningImageLoading(false);
              this.cdr.markForCheck();
            },
          });
      })
      .catch(() => {
        this.setPositioningImageLoading(false);
        this.errorMessage = 'Failed to reach the replay API.';
        this.cdr.markForCheck();
      });
  }

  private async resolveOddsReplayPayloadFromTurns(
    turnsResponse: ReplayTurnsResponse,
    replayId: string,
  ): Promise<Record<string, unknown>> {
    if (this.hasRawReplayActions(turnsResponse)) {
      return turnsResponse as unknown as Record<string, unknown>;
    }

    const actionsFromTurns = this.buildActionsFromTurnsPayload(
      turnsResponse?.turns ?? null,
    );
    if (actionsFromTurns.length > 0) {
      return this.buildReplayPayloadFromHydratedActions(turnsResponse, actionsFromTurns);
    }

    const synthesizedActions = this.buildActionsFromTurnsSummary(
      turnsResponse,
      replayId,
    );
    if (synthesizedActions.length > 0) {
      return this.buildReplayPayloadFromHydratedActions(
        turnsResponse,
        synthesizedActions,
      );
    }

    const turnCount = this.getReplayTurnCount(turnsResponse);
    if (turnCount <= 0) {
      return turnsResponse as unknown as Record<string, unknown>;
    }

    const hydratedActions: ReplayActionEntry[] = [];
    for (let turn = 1; turn <= turnCount; turn += 1) {
      try {
        const replayBattleResponse = await this.replayCalcService
          .fetchReplayBattleDirect(
            {
              Pid: replayId,
              T: turn,
            },
            this.replayTimeoutMs,
          )
          .toPromise();
        if (replayBattleResponse?.battle) {
          hydratedActions.push({
            Type: 0,
            Turn: turn,
            Battle: JSON.stringify(replayBattleResponse.battle),
          });
        }
      } catch {
        // skip failed turns and continue hydrating the remainder
      }
    }

    if (hydratedActions.length === 0) {
      throw new Error(
        'Replay lookup did not include usable battle payloads in turns JSON.',
      );
    }
    if (hydratedActions.length < turnCount) {
      this.setStatus(
        `Loaded ${hydratedActions.length}/${turnCount} turns. Some turns may be missing from the preview.`,
        'warning',
      );
    }

    return this.buildReplayPayloadFromHydratedActions(turnsResponse, hydratedActions);
  }

  private hasRawReplayActions(turnsResponse: ReplayTurnsResponse): boolean {
    return Boolean(
      Array.isArray(turnsResponse?.replay?.raw_json?.Actions),
    );
  }

  private getReplayTurnCount(turnsResponse: ReplayTurnsResponse): number {
    const turnEntries = turnsResponse?.turns;
    if (Array.isArray(turnEntries) && turnEntries.length > 0) {
      return turnEntries.length;
    }
    const rawActions = turnsResponse?.replay?.raw_json?.Actions;
    if (Array.isArray(rawActions) && rawActions.length > 0) {
      const battleActions = rawActions.filter((action) => action?.Type === 0);
      return battleActions.length > 0 ? battleActions.length : rawActions.length;
    }
    return 0;
  }

  private buildActionsFromTurnsPayload(turns: unknown[] | null): ReplayActionEntry[] {
    if (!Array.isArray(turns) || turns.length === 0) {
      return [];
    }
    const actions: ReplayActionEntry[] = [];
    let fallbackTurn = 1;
    turns.forEach((turnEntry) => {
      if (!turnEntry || typeof turnEntry !== 'object') {
        return;
      }
      const turnRecord = turnEntry as Record<string, unknown>;
      const rawBattle = turnRecord['Battle'];
      if (typeof rawBattle !== 'string' || rawBattle.trim().length === 0) {
        return;
      }
      const actionType = Number(turnRecord['Type']);
      if (Number.isFinite(actionType) && actionType !== 0) {
        return;
      }
      let parsedTurn = Number(
        turnRecord['Turn'] ?? turnRecord['turn'] ?? turnRecord['turnNumber'],
      );
      if (!Number.isFinite(parsedTurn) || parsedTurn <= 0) {
        parsedTurn = fallbackTurn;
      }
      actions.push({
        Type: 0,
        Turn: Math.trunc(parsedTurn),
        Battle: rawBattle,
      });
      fallbackTurn += 1;
    });
    return actions;
  }

  private buildActionsFromTurnsSummary(
    turnsResponse: ReplayTurnsResponse,
    replayId: string,
  ): ReplayActionEntry[] {
    const turnCount = this.getReplayTurnCount(turnsResponse);
    if (turnCount <= 0) {
      return [];
    }
    const replayServiceWithTurnsBuilder = this.replayCalcService as unknown as {
      buildReplayBattleResponseFromTurns: (
        turnsResponseValue: ReplayTurnsResponse,
        requestedTurn: number,
        replayIdValue: string,
      ) => ReplayBattleResponse;
    };
    const actions: ReplayActionEntry[] = [];
    for (let turn = 1; turn <= turnCount; turn += 1) {
      try {
        const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
          turnsResponse,
          turn,
          replayId,
        );
        if (response?.battle) {
          actions.push({
            Type: 0,
            Turn: turn,
            Battle: JSON.stringify(response.battle),
          });
        }
      } catch {
        // ignore turn-level synthesis failures
      }
    }
    return actions;
  }

  private buildReplayPayloadFromHydratedActions(
    turnsResponse: ReplayTurnsResponse,
    actions: ReplayActionEntry[],
  ): Record<string, unknown> {
    const genesisBuildModel =
      turnsResponse?.genesisBuildModel ??
      turnsResponse?.replay?.raw_json?.GenesisBuildModel ??
      turnsResponse?.replay?.GenesisBuildModel ??
      null;
    const abilityPetMap = turnsResponse?.abilityPetMap ?? null;
    return {
      Actions: actions,
      GenesisBuildModel: genesisBuildModel,
      AbilityPetMap: abilityPetMap,
    };
  }

  private buildOddsImageSourceFromPayload(
    payload: ReplayImportPayload,
    turnNumber: number,
    simulationCount: number,
  ): OddsImageSourcePayload | null {
    if (payload?.Actions) {
      return {
        replay: payload as unknown as Record<string, unknown>,
        simulationCount,
        abilityPetMap:
          payload.AbilityPetMap ?? buildReplayAbilityPetMapFromActions(payload.Actions),
      };
    }

    if (payload?.UserBoard && payload?.OpponentBoard) {
      return {
        replay: this.buildSingleBattleReplayPayload(
          payload as unknown as ReplayBattleJson,
          turnNumber,
          payload.GenesisBuildModel ?? null,
          payload.AbilityPetMap ?? null,
        ),
        simulationCount,
        abilityPetMap: payload.AbilityPetMap ?? null,
      };
    }

    if (payload?.raw_json?.Actions) {
      return {
        replay: payload.raw_json as unknown as Record<string, unknown>,
        simulationCount,
        abilityPetMap: payload.AbilityPetMap ?? null,
      };
    }

    if (payload?.replay?.raw_json?.Actions) {
      return {
        replay: payload.replay.raw_json as unknown as Record<string, unknown>,
        simulationCount,
        abilityPetMap: payload.AbilityPetMap ?? null,
      };
    }

    if (this.isReplayTurnsPayload(payload)) {
      return {
        replay: payload as unknown as Record<string, unknown>,
        simulationCount,
        abilityPetMap: payload.AbilityPetMap ?? null,
      };
    }

    return null;
  }

  private buildSingleBattleReplayPayload(
    battle: ReplayBattleJson,
    turnNumber: number,
    genesisBuildModel: ReplayBuildModelJson | null,
    abilityPetMap: Record<string, string | number> | null,
  ): Record<string, unknown> {
    return {
      Actions: [
        {
          Type: 0,
          Turn: turnNumber,
          Battle: JSON.stringify(battle),
        },
      ],
      GenesisBuildModel: genesisBuildModel ?? null,
      AbilityPetMap: abilityPetMap ?? null,
    };
  }

  private requestOddsImageDownload(
    request: OddsImageSourcePayload,
    replayId?: string,
  ): void {
    this.setOddsImageLoading(true);
    this.replayOddsImageService
      .buildOddsImageBlob({
        replayPayload: request.replay,
        simulationCount: request.simulationCount,
        abilityPetMap: request.abilityPetMap ?? null,
      })
      .then((blob) => {
        this.setOddsPreview(blob, replayId);
        this.setStatus('Replay odds image ready. Preview and download below.', 'success');
      })
      .catch((error) => {
        this.handleOddsImageError(error);
      })
      .finally(() => {
        this.setOddsImageLoading(false);
      });
  }

  private requestPositioningImageDownload(
    request: OddsImageSourcePayload,
    replayId?: string,
  ): void {
    this.cancelPositioningBuild();
    const abortController = new AbortController();
    this.positioningBuildAbortController = abortController;
    this.setPositioningImageLoading(true);
    this.replayPositioningImageService
      .buildPositioningImageBlob({
        replayPayload: request.replay,
        simulationCount: request.simulationCount,
        optimizationSide: request.optimizationSide ?? 'player',
        abilityPetMap: request.abilityPetMap ?? null,
        abortSignal: abortController.signal,
        onProgress: (progress: ReplayPositioningImageProgress) => {
          this.positioningProgressPercent = Math.round(progress.percent);
          this.positioningProgressMessage = progress.message;
          this.cdr.markForCheck();
        },
      })
      .then((blob) => {
        if (abortController.signal.aborted) {
          return;
        }
        this.setPositioningPreview(blob, replayId);
        this.setStatus('Positioning image ready. Preview and download below.', 'success');
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '';
        if (abortController.signal.aborted || message === 'Positioning image build cancelled.') {
          this.setStatus('Positioning image build cancelled.', 'warning');
          return;
        }
        this.handleOddsImageError(error);
      })
      .finally(() => {
        if (this.positioningBuildAbortController === abortController) {
          this.positioningBuildAbortController = null;
          this.setPositioningImageLoading(false);
          this.clearPositioningProgress();
        }
      });
  }

  downloadOddsImage(): void {
    if (!this.oddsImageBlob) {
      return;
    }
    const objectUrl = window.URL.createObjectURL(this.oddsImageBlob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = this.oddsImageFileName || `replay-odds-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(objectUrl);
  }

  clearOddsPreview(): void {
    if (this.oddsImagePreviewUrl) {
      window.URL.revokeObjectURL(this.oddsImagePreviewUrl);
    }
    this.oddsImagePreviewUrl = null;
    this.oddsImageBlob = null;
    this.oddsImageFileName = '';
  }

  downloadPositioningImage(): void {
    if (!this.positioningImageBlob) {
      return;
    }
    const objectUrl = window.URL.createObjectURL(this.positioningImageBlob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = this.positioningImageFileName || `replay-positioning-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(objectUrl);
  }

  clearPositioningPreview(): void {
    if (this.positioningImagePreviewUrl) {
      window.URL.revokeObjectURL(this.positioningImagePreviewUrl);
    }
    this.positioningImagePreviewUrl = null;
    this.positioningImageBlob = null;
    this.positioningImageFileName = '';
  }

  private setOddsPreview(blob: Blob, replayId?: string): void {
    this.clearOddsPreview();
    this.oddsImageBlob = blob;
    this.oddsImagePreviewUrl = window.URL.createObjectURL(blob);
    const sanitizedReplayId =
      typeof replayId === 'string'
        ? replayId.replace(/[^a-zA-Z0-9_-]/g, '')
        : '';
    this.oddsImageFileName = sanitizedReplayId
      ? `replay-odds-${sanitizedReplayId}.png`
      : `replay-odds-${new Date().toISOString().slice(0, 10)}.png`;
    this.cdr.markForCheck();
  }

  private setPositioningPreview(blob: Blob, replayId?: string): void {
    this.clearPositioningPreview();
    this.positioningImageBlob = blob;
    this.positioningImagePreviewUrl = window.URL.createObjectURL(blob);
    const sanitizedReplayId =
      typeof replayId === 'string'
        ? replayId.replace(/[^a-zA-Z0-9_-]/g, '')
        : '';
    this.positioningImageFileName = sanitizedReplayId
      ? `replay-positioning-${sanitizedReplayId}.png`
      : `replay-positioning-${new Date().toISOString().slice(0, 10)}.png`;
    this.cdr.markForCheck();
  }

  private handleOddsImageError(error: unknown): void {
    let message = 'Failed to build replay odds image.';
    if (error instanceof Error && error.message) {
      message = error.message;
    } else if (typeof error === 'string' && error.trim().length > 0) {
      message = error;
    }

    this.errorMessage = message;
    this.cdr.markForCheck();
  }

  private looksLikePid(value: string): boolean {
    return /^[a-f0-9-]{16,}$/i.test(value) || /^\d+$/.test(value);
  }

  private getRequestedTurn(): number {
    const rawTurn = Number(this.formGroup.get('turn')?.value ?? 1);
    return Number.isFinite(rawTurn) && rawTurn > 0 ? Math.trunc(rawTurn) : 1;
  }

  private getOddsSimulationCount(): number {
    const rawCount = Number(this.formGroup.get('oddsSimulations')?.value ?? 100);
    return Number.isFinite(rawCount) && rawCount > 0 ? Math.trunc(rawCount) : 100;
  }

  private getPositioningSimulationCount(): number {
    const requested = this.getOddsSimulationCount();
    if (requested > this.maxPositioningSimulations) {
      this.setStatus(
        `Positioning image simulations capped at ${this.maxPositioningSimulations}.`,
        'warning',
      );
      return this.maxPositioningSimulations;
    }
    return requested;
  }

  private getPositioningSide(): 'player' | 'opponent' {
    const rawValue = this.formGroup.get('positioningSide')?.value;
    return rawValue === 'opponent' ? 'opponent' : 'player';
  }

  private setLoading(value: boolean) {
    this.loading = value;
    this.cdr.markForCheck();
  }

  private setOddsImageLoading(value: boolean) {
    this.oddsImageLoading = value;
    this.cdr.markForCheck();
  }

  private setPositioningImageLoading(value: boolean) {
    this.positioningImageLoading = value;
    if (value) {
      this.positioningProgressPercent = Math.max(this.positioningProgressPercent, 1);
      if (!this.positioningProgressMessage) {
        this.positioningProgressMessage = 'Starting positioning build...';
      }
    }
    this.cdr.markForCheck();
  }

  cancelPositioningBuild(): void {
    if (!this.positioningBuildAbortController) {
      return;
    }
    this.positioningBuildAbortController.abort();
    this.positioningBuildAbortController = null;
    this.setPositioningImageLoading(false);
    this.clearPositioningProgress();
  }

  private clearPositioningProgress(): void {
    this.positioningProgressPercent = 0;
    this.positioningProgressMessage = '';
  }

  private clearStatus() {
    this.statusController.clear();
  }

  private setStatus(message: string, tone: 'success' | 'error' | 'warning') {
    this.statusController.set(message, tone);
  }
}
