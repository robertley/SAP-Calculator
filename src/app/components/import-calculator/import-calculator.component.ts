import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplayCalcService } from '../../services/replay-calc.service';

@Component({
  selector: 'app-import-calculator',
  templateUrl: './import-calculator.component.html',
  styleUrls: ['./import-calculator.component.scss']
})
export class ImportCalculatorComponent implements OnInit {

  @Input()
  importFunc: (importVal: string) => boolean;

  formGroup: FormGroup = new FormGroup({
    calcCode: new FormControl(null, Validators.required),
    turn: new FormControl(1, Validators.min(1))
  });

  errorMessage = '';
  loading = false;

  constructor(
    private replayCalcService: ReplayCalcService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  submit() {
    this.errorMessage = '';
    const rawInput = this.formGroup.get('calcCode').value?.trim();
    if (!rawInput) {
      this.errorMessage = 'Paste calculator JSON or replay JSON.';
      return;
    }

    let parsedInput: any;
    try {
      parsedInput = JSON.parse(rawInput);
    } catch (error) {
      this.errorMessage = 'Invalid JSON. Please paste a valid calculator or replay JSON.';
      return;
    }

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
          const battleJson = response?.battle;
          if (!battleJson) {
            this.errorMessage = 'Replay lookup failed to return a battle.';
            return;
          }
          this.importReplayBattle(battleJson, response?.genesisBuildModel);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error?.error?.error || 'Failed to fetch replay data.';
        }
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
      const turnNumber = Number(this.formGroup.get('turn').value ?? parsedInput?.T);
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
      alert('Import successful');
    } else {
      this.errorMessage = 'Import failed.';
    }
  }

  private importReplayBattle(
    battleJson: any,
    buildModel?: any,
    metaBoards?: { userBoard?: any; opponentBoard?: any },
  ) {
    const calculatorState = this.replayCalcService.parseReplayForCalculator(
      battleJson,
      buildModel,
      metaBoards
    );
    if (this.importFunc(JSON.stringify(calculatorState))) {
      alert('Import successful');
      return;
    }
    this.errorMessage = 'Import failed.';
  }

}
