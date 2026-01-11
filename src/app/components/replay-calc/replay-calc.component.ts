import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplayCalcService } from '../../services/replay-calc.service';

@Component({
  selector: 'app-replay-calc',
  templateUrl: './replay-calc.component.html',
  styleUrls: ['./replay-calc.component.scss']
})
export class ReplayCalcComponent {
  formGroup = new FormGroup({
    replayJson: new FormControl('', Validators.required),
    turn: new FormControl(1, Validators.min(1))
  });

  errorMessage = '';
  calculatorLink = '';
  loading = false;

  constructor(
    private replayCalcService: ReplayCalcService,
    private http: HttpClient
  ) {}

  generate() {
    this.errorMessage = '';
    this.calculatorLink = '';
    this.loading = false;

    const rawInput = this.formGroup.get('replayJson').value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste a replay JSON payload or a single battle JSON.';
      return;
    }

    let parsedInput: any;
    try {
      parsedInput = JSON.parse(rawInput);
    } catch (error) {
      this.errorMessage = 'Invalid JSON. Please paste a valid replay or battle JSON.';
      return;
    }

    let battleJson = null;
    if (parsedInput?.Pid && !parsedInput?.Actions) {
      const turnNumber = Number(parsedInput?.T ?? this.formGroup.get('turn').value);
      if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
        this.errorMessage = 'Enter a valid turn number.';
        return;
      }
      this.loading = true;
      this.http.post('/api/replay-battle', { Pid: parsedInput.Pid, T: turnNumber }).subscribe({
        next: (response: any) => {
          this.loading = false;
          battleJson = response?.battle;
          if (!battleJson) {
            this.errorMessage = 'Replay lookup failed to return a battle.';
            return;
          }
          const calculatorState = this.replayCalcService.parseReplayForCalculator(
            battleJson,
            response?.genesisBuildModel
          );
          this.calculatorLink = this.replayCalcService.generateCalculatorLink(calculatorState);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error?.error?.error || 'Failed to fetch replay data.';
        }
      });
      return;
    } else if (parsedInput?.UserBoard && parsedInput?.OpponentBoard) {
      battleJson = parsedInput;
    } else if (parsedInput?.Actions) {
      const turnNumber = Number(this.formGroup.get('turn').value ?? parsedInput?.T);
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
      this.errorMessage = 'Replay JSON should include Actions or a battle with UserBoard/OpponentBoard.';
      return;
    }

      const calculatorState = this.replayCalcService.parseReplayForCalculator(
        battleJson,
        parsedInput?.GenesisBuildModel
      );
      this.calculatorLink = this.replayCalcService.generateCalculatorLink(calculatorState);
  }

  copyLink() {
    if (!this.calculatorLink) {
      return;
    }
    navigator.clipboard.writeText(this.calculatorLink).then(() => {
      alert('Replay calculator link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link. Please copy it manually.');
    });
  }
}
