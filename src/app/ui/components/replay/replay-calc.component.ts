import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
} from 'app/integrations/replay/replay-calc.service';
import {
  ReplayBattleJson,
  ReplayBoardJson,
  ReplayBuildModelJson,
  ReplayParseOptions,
  buildReplayAbilityPetMapFromActions,
  selectReplayBattleFromActions,
} from 'app/integrations/replay/replay-calc-parser';
import { buildReplayCode } from 'app/integrations/replay/replay-code';

interface ReplayActionEntry {
  Type?: number;
  Turn?: number;
  Battle?: string;
  Build?: string | null;
  Mode?: string | null;
}

interface ReplayCalcPayload {
  Pid?: string;
  T?: number;
  Actions?: ReplayActionEntry[];
  UserBoard?: ReplayBoardJson;
  OpponentBoard?: ReplayBoardJson;
  GenesisBuildModel?: ReplayBuildModelJson;
  AbilityPetMap?: Record<string, string | number> | null;
}

@Component({
  selector: 'app-replay-calc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './replay-calc.component.html',
  styleUrls: ['./replay-calc.component.scss'],
})
export class ReplayCalcComponent implements OnInit {
  private readonly sapCredentialsKey = 'sapCredentials';

  formGroup = new FormGroup({
    replayJson: new FormControl('', Validators.required),
    turn: new FormControl(1, Validators.min(1)),
    sapEmail: new FormControl(''),
    sapPassword: new FormControl(''),
  });

  errorMessage = '';
  statusMessage = '';
  statusTone: 'success' | 'error' | 'warning' = 'success';
  calculatorLink = '';
  replayCode = '';
  loading = false;
  private readonly replayTimeoutMs = 10000;
  private readonly replayHealthTimeoutMs = 2500;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private replayCalcService: ReplayCalcService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const saved = this.loadSapCredentials();
    if (saved) {
      this.formGroup.patchValue({
        sapEmail: saved.email || '',
        sapPassword: saved.password || '',
      });
    }
  }

  generate() {
    this.errorMessage = '';
    this.clearStatus();
    this.calculatorLink = '';
    this.replayCode = '';
    this.loading = false;

    const rawInput = this.formGroup.get('replayJson').value?.trim();
    if (!rawInput) {
      this.errorMessage =
        'Paste a replay JSON payload or a single battle JSON.';
      return;
    }

    let parsedInput: ReplayCalcPayload;
    try {
      parsedInput = JSON.parse(rawInput) as ReplayCalcPayload;
    } catch (error) {
      this.errorMessage =
        'Invalid JSON. Please paste a valid replay or battle JSON.';
      return;
    }

    let battleJson: ReplayBattleJson | null = null;
    let parseOptions: ReplayParseOptions | undefined;
    if (parsedInput?.Pid && !parsedInput?.Actions) {
      const turnNumber = Number(
        parsedInput?.T ?? this.formGroup.get('turn').value,
      );
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      this.setLoading(true);
      this.saveSapCredentials();
      const sapEmail = this.formGroup.get('sapEmail').value?.trim();
      const sapPassword = this.formGroup.get('sapPassword').value;
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
              Pid: parsedInput.Pid,
              T: turnNumber,
              SapEmail: sapEmail || undefined,
              SapPassword: sapPassword || undefined,
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
                battleJson = response?.battle;
                if (!battleJson) {
                  this.errorMessage = 'Replay lookup failed to return a battle.';
                  return;
                }
                this.populateReplayOutputs(
                  battleJson,
                  response?.genesisBuildModel,
                  response?.abilityPetMap ?? null,
                  turnNumber,
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
    } else if (parsedInput?.UserBoard && parsedInput?.OpponentBoard) {
      battleJson = parsedInput;
      parseOptions = {
        abilityPetMap: parsedInput?.AbilityPetMap ?? null,
      };
    } else if (parsedInput?.Actions) {
      const turnNumber = Number(
        this.formGroup.get('turn').value ?? parsedInput?.T,
      );
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      battleJson = selectReplayBattleFromActions(parsedInput.Actions, turnNumber);
      if (!battleJson) {
        this.errorMessage = `No battle found for turn ${turnNumber}.`;
        return;
      }
      parseOptions = {
        abilityPetMap:
          parsedInput?.AbilityPetMap ??
          buildReplayAbilityPetMapFromActions(parsedInput.Actions),
      };
    } else {
      this.errorMessage =
        'Replay JSON should include Actions or a battle with UserBoard/OpponentBoard.';
      return;
    }

    this.populateReplayOutputs(
      battleJson,
      parsedInput?.GenesisBuildModel,
      parseOptions?.abilityPetMap ?? null,
      Number(this.formGroup.get('turn').value ?? parsedInput?.T),
    );
  }

  copyLink() {
    if (!this.calculatorLink) {
      return;
    }
    navigator.clipboard
      .writeText(this.calculatorLink)
      .then(() => {
        this.setStatus('Replay calculator link copied to clipboard!', 'success');
      })
      .catch(() => {
        this.setStatus(
          'Failed to copy link. Please copy it manually.',
          'error',
        );
      });
  }

  copyReplayCode() {
    if (!this.replayCode) {
      return;
    }
    navigator.clipboard
      .writeText(this.replayCode)
      .then(() => {
        this.setStatus('Replay code copied to clipboard!', 'success');
      })
      .catch(() => {
        this.setStatus(
          'Failed to copy replay code. Please copy it manually.',
          'error',
        );
      });
  }

  private populateReplayOutputs(
    battleJson: ReplayBattleJson,
    genesisBuildModel?: ReplayBuildModelJson,
    abilityPetMap?: Record<string, string | number> | null,
    turnNumber?: number,
  ) {
    const calculatorState = this.replayCalcService.parseReplayForCalculator(
      battleJson,
      genesisBuildModel,
      undefined,
      { abilityPetMap: abilityPetMap ?? null },
    );
    this.calculatorLink =
      this.replayCalcService.generateCalculatorLink(calculatorState);
    this.replayCode = buildReplayCode({
      battle: battleJson,
      genesisBuildModel: genesisBuildModel ?? null,
      abilityPetMap: abilityPetMap ?? null,
      turn:
        typeof turnNumber === 'number' && Number.isFinite(turnNumber)
          ? turnNumber
          : undefined,
    });
  }

  private saveSapCredentials() {
    const email = this.formGroup.get('sapEmail').value?.trim() || '';
    const password = this.formGroup.get('sapPassword').value || '';
    const payload = { email, password };
    window.localStorage.setItem(
      this.sapCredentialsKey,
      JSON.stringify(payload),
    );
  }

  private loadSapCredentials(): { email?: string; password?: string } | null {
    const raw = window.localStorage.getItem(this.sapCredentialsKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private clearStatus() {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    this.statusMessage = '';
  }

  private setStatus(message: string, tone: 'success' | 'error' | 'warning') {
    this.statusMessage = message;
    this.statusTone = tone;
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }
    this.statusTimer = setTimeout(() => {
      this.statusMessage = '';
      this.statusTimer = null;
    }, 3000);
  }

  private setLoading(value: boolean) {
    this.loading = value;
    this.cdr.markForCheck();
  }
}

