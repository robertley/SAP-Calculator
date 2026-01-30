import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { ReplayCalcService } from '../../services/replay/replay-calc.service';

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
  statusTone: 'success' | 'error' = 'success';
  calculatorLink = '';
  loading = false;
  private readonly replayTimeoutMs = 10000;
  private readonly replayHealthTimeoutMs = 2500;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private replayCalcService: ReplayCalcService,
    private http: HttpClient,
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
    this.loading = false;

    const rawInput = this.formGroup.get('replayJson').value?.trim();
    if (!rawInput) {
      this.errorMessage =
        'Paste a replay JSON payload or a single battle JSON.';
      return;
    }

    let parsedInput: any;
    try {
      parsedInput = JSON.parse(rawInput);
    } catch (error) {
      this.errorMessage =
        'Invalid JSON. Please paste a valid replay or battle JSON.';
      return;
    }

    let battleJson = null;
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
      this.checkReplayApiReachable()
        .then((reachable) => {
          if (!reachable) {
            this.setLoading(false);
            return;
          }
          console.info('[replay] health check ok, requesting battle');
          this.http
            .post('/api/replay-battle', {
              Pid: parsedInput.Pid,
              T: turnNumber,
              SapEmail: sapEmail || undefined,
              SapPassword: sapPassword || undefined,
            })
            .pipe(
              timeout(this.replayTimeoutMs),
              finalize(() => {
                this.setLoading(false);
                console.info('[replay] replay-battle request finalized');
              }),
            )
            .subscribe({
              next: (response: any) => {
                battleJson = response?.battle;
                if (!battleJson) {
                  this.errorMessage = 'Replay lookup failed to return a battle.';
                  return;
                }
                const calculatorState =
                  this.replayCalcService.parseReplayForCalculator(
                    battleJson,
                    response?.genesisBuildModel,
                  );
                this.calculatorLink =
                  this.replayCalcService.generateCalculatorLink(
                    calculatorState,
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
    } else if (parsedInput?.Actions) {
      const turnNumber = Number(
        this.formGroup.get('turn').value ?? parsedInput?.T,
      );
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      let battleIndex = 0;
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
    } else {
      this.errorMessage =
        'Replay JSON should include Actions or a battle with UserBoard/OpponentBoard.';
      return;
    }

    const calculatorState = this.replayCalcService.parseReplayForCalculator(
      battleJson,
      parsedInput?.GenesisBuildModel,
    );
    this.calculatorLink =
      this.replayCalcService.generateCalculatorLink(calculatorState);
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
}
