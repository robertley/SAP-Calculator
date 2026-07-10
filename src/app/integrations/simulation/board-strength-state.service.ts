import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { buildSimulationConfigFromForm } from 'app/runtime/state/simulation-form-mapper';
import {
  BoardStrengthResult,
  BoardStrengthSide,
  createBoardStrengthFingerprint,
} from './board-strength-evaluator';

interface CachedBoardStrength {
  fingerprint: string;
  result: BoardStrengthResult;
}

@Injectable({ providedIn: 'root' })
export class BoardStrengthStateService {
  private readonly cache = signal<
    Partial<Record<BoardStrengthSide, CachedBoardStrength>>
  >({});

  getFingerprint(formGroup: FormGroup, side: BoardStrengthSide): string {
    const config = buildSimulationConfigFromForm(
      formGroup,
      1,
      { maxLoggedBattles: 0 },
      { logsEnabled: false, maxLoggedBattles: 0 },
    );
    return createBoardStrengthFingerprint(config, side);
  }

  getResult(
    formGroup: FormGroup,
    side: BoardStrengthSide,
  ): BoardStrengthResult | null {
    const cached = this.cache()[side];
    if (!cached) {
      return null;
    }
    return cached.fingerprint === this.getFingerprint(formGroup, side)
      ? cached.result
      : null;
  }

  store(
    side: BoardStrengthSide,
    fingerprint: string,
    result: BoardStrengthResult,
  ): void {
    this.cache.update((current) => ({
      ...current,
      [side]: { fingerprint, result },
    }));
  }
}
