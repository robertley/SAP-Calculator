import { Injectable } from '@angular/core';

import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalcParser,
  ReplayCalculatorState,
  ReplayMetaBoards,
} from './replay-calc-parser';

@Injectable({
  providedIn: 'root',
})
export class ReplayCalcService {
  private parser = new ReplayCalcParser();

  parseReplayForCalculator(
    battleJson: ReplayBattleJson,
    buildModel?: ReplayBuildModelJson,
    metaBoards?: ReplayMetaBoards,
  ): ReplayCalculatorState {
    return this.parser.parseReplayForCalculator(
      battleJson,
      buildModel,
      metaBoards,
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
}
