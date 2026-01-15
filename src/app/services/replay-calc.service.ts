import { Injectable } from "@angular/core";

import { ReplayCalcParser } from "./replay-calc-parser";

@Injectable({
  providedIn: "root",
})
export class ReplayCalcService {
  private parser = new ReplayCalcParser();

  parseReplayForCalculator(battleJson: any, buildModel?: any) {
    return this.parser.parseReplayForCalculator(battleJson, buildModel);
  }

  buildCustomPacksFromGenesis(buildModel?: any, battleJson?: any) {
    return this.parser.buildCustomPacksFromGenesis(buildModel, battleJson);
  }

  generateCalculatorLink(calculatorState: any) {
    return this.parser.generateCalculatorLink(calculatorState);
  }
}
