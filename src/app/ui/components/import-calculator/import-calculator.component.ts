import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { ReplayCalcService } from 'app/integrations/replay/replay-calc.service';

@Component({
  selector: 'app-import-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './import-calculator.component.html',
  styleUrls: ['./import-calculator.component.scss'],
})
export class ImportCalculatorComponent implements OnInit {
  @Input()
  importFunc: (importVal: string, options?: { resetBattle?: boolean }) => boolean;

  formGroup: FormGroup = new FormGroup({
    calcCode: new FormControl(null, Validators.required),
    turn: new FormControl(1, Validators.min(1)),
  });

  errorMessage = '';
  statusMessage = '';
  statusTone: 'success' | 'error' = 'success';
  loading = false;
  private readonly replayTimeoutMs = 10000;
  private readonly replayHealthTimeoutMs = 2500;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private replayCalcService: ReplayCalcService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  submit() {
    this.errorMessage = '';
    this.clearStatus();
    const calcControl = this.formGroup.get('calcCode');
    const rawInput = calcControl?.value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste calculator JSON or replay JSON.';
      return;
    }
    calcControl?.setValue('', { emitEvent: false });
    calcControl?.markAsPristine();
    calcControl?.markAsUntouched();
    calcControl?.updateValueAndValidity({ emitEvent: false });

    let parsedInput: any;
    try {
      parsedInput = JSON.parse(rawInput);
    } catch (error) {
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
      this.checkReplayApiReachable()
        .then((reachable) => {
          if (!reachable) {
            this.setLoading(false);
            return;
          }
          console.info('[replay] health check ok, requesting battle');
          this.http
            .post('/api/replay-battle', { Pid: pidValue, T: turnNumber })
            .pipe(
              timeout(this.replayTimeoutMs),
              finalize(() => {
                this.setLoading(false);
                console.info('[replay] replay-battle request finalized');
              }),
            )
            .subscribe({
              next: (response: any) => {
                const battleJson = response?.battle;
                if (!battleJson) {
                  this.errorMessage = 'Replay lookup failed to return a battle.';
                  return;
                }
                this.importReplayBattle(
                  battleJson,
                  response?.genesisBuildModel,
                  undefined,
                  { resetBattle: true },
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
      this.importReplayBattle(battleJson, parsedInput?.GenesisBuildModel, {
        userBoard: parsedInput?.UserBoard,
        opponentBoard: parsedInput?.OpponentBoard,
      });
      return;
    }

    if (this.importFunc(rawInput)) {
      this.setStatus('Import successful.', 'success');
    } else {
      this.errorMessage = 'Import failed.';
    }
  }

  private importReplayBattle(
    battleJson: any,
    buildModel?: any,
    metaBoards?: { userBoard?: any; opponentBoard?: any },
    options?: { resetBattle?: boolean },
  ) {
    const calculatorState = this.replayCalcService.parseReplayForCalculator(
      battleJson,
      buildModel,
      metaBoards,
    );
    if (this.importFunc(JSON.stringify(calculatorState), options)) {
      this.setStatus('Import successful.', 'success');
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
    this.checkReplayApiReachable()
      .then((reachable) => {
        if (!reachable) {
          this.setLoading(false);
          return;
        }
        console.info('[replay] health check ok, requesting battle');
        this.http
          .post('/api/replay-battle', { Pid: pid, T: turnNumber })
          .pipe(
            timeout(this.replayTimeoutMs),
            finalize(() => {
              this.setLoading(false);
              console.info('[replay] replay-battle request finalized');
            }),
          )
          .subscribe({
            next: (response: any) => {
              const battleJson = response?.battle;
              if (!battleJson) {
                this.errorMessage = 'Replay lookup failed to return a battle.';
                return;
              }
              this.importReplayBattle(
                battleJson,
                response?.genesisBuildModel,
                undefined,
                { resetBattle: true },
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

  private async checkReplayApiReachable(): Promise<boolean> {
    return new Promise((resolve) => {
      console.info('[replay] health check start');
      this.http
        .get('/api/health')
        .pipe(
          timeout(this.replayHealthTimeoutMs),
          catchError(() => of(null)),
        )
        .subscribe({
          next: (value) => {
            if (!value) {
              this.errorMessage =
                'Replay API is not reachable. Ensure the replay server is running.';
              console.info('[replay] health check failed');
              this.cdr.markForCheck();
              resolve(false);
              return;
            }
            console.info('[replay] health check success');
            resolve(true);
          },
          error: () => {
            this.errorMessage =
              'Replay API is not reachable. Ensure the replay server is running.';
            console.info('[replay] health check error');
            this.cdr.markForCheck();
            resolve(false);
          },
        });
    });
  }

  private setLoading(value: boolean) {
    this.loading = value;
    this.cdr.markForCheck();
  }

  private clearStatus() {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    this.statusMessage = '';
  }

  private setStatus(message: string, tone: 'success' | 'error') {
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
}

