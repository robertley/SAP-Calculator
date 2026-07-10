import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import {
  BoardStrengthPoint,
  BoardStrengthProgress,
  BoardStrengthResult,
  BoardStrengthSide,
  getBoardStrengthPrecisionProfile,
} from 'app/integrations/simulation/board-strength-evaluator';
import { BoardStrengthStateService } from 'app/integrations/simulation/board-strength-state.service';
import { SimulationService } from 'app/integrations/simulation/simulation.service';
import { getPetIconPath } from 'app/runtime/asset-catalog';
import { Subscription } from 'rxjs';

type EvaluationStatus = 'idle' | 'running' | 'cancelled' | 'error';

@Component({
  selector: 'app-board-strength-dialog',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './board-strength-dialog.component.html',
  styleUrl: './board-strength-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardStrengthDialogComponent implements OnInit, OnDestroy {
  @Input({ required: true }) formGroup: FormGroup;
  @Input({ required: true }) player: Player;
  @Input({ required: true }) opponent: Player;

  selectedSide: BoardStrengthSide = 'player';
  readonly precision = 'high' as const;
  status: EvaluationStatus = 'idle';
  progress: BoardStrengthProgress | null = null;
  errorMessage = '';
  copyLabel = 'Copy Summary';

  private worker: Worker | null = null;
  private evaluationFingerprint = '';
  private formSubscription: Subscription | null = null;

  constructor(
    private readonly simulationService: SimulationService,
    private readonly state: BoardStrengthStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.formSubscription = this.formGroup.valueChanges.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    this.formSubscription?.unsubscribe();
  }

  get result(): BoardStrengthResult | null {
    if (!this.formGroup || this.status === 'running') {
      return null;
    }
    return this.state.getResult(this.formGroup, this.selectedSide);
  }

  get selectedPetNames(): string[] {
    if (!this.formGroup) {
      return [];
    }
    const controlName =
      this.selectedSide === 'player' ? 'playerPets' : 'opponentPets';
    const pets = this.formGroup.get(controlName)?.value;
    if (!Array.isArray(pets)) {
      return [];
    }
    return pets
      .map((pet) =>
        pet && typeof pet.name === 'string' ? pet.name : '',
      )
      .filter((name): name is string => Boolean(name));
  }

  get canEvaluate(): boolean {
    return this.selectedPetNames.length > 0 && this.status !== 'running';
  }

  get progressPercent(): number {
    if (!this.progress) {
      return 0;
    }
    if (this.progress.phase === 'complete') {
      return 100;
    }
    if (this.progress.phase === 'scout') {
      return 5;
    }
    if (this.progress.phase === 'scan') {
      return Math.min(
        45,
        (this.progress.completedStats / this.progress.totalStats) * 45,
      );
    }
    const profile = getBoardStrengthPrecisionProfile(this.precision);
    const initialBattles =
      this.progress.totalStats * profile.initialBattles;
    const refinementCapacity = Math.max(
      1,
      this.progress.maximumBattles - initialBattles,
    );
    const refinementProgress = Math.max(
      0,
      this.progress.battlesCompleted - initialBattles,
    );
    return Math.min(95, 45 + (refinementProgress / refinementCapacity) * 50);
  }

  get phaseLabel(): string {
    if (!this.progress || this.progress.phase === 'scout') {
      return 'Finding the board\'s benchmark range';
    }
    if (this.progress.phase === 'scan') {
      return 'Scanning the benchmark ladder';
    }
    if (this.progress.phase === 'refine') {
      return `Refining uncertain matchups · pass ${this.progress.refinementRound}`;
    }
    return 'Calculating board strength';
  }

  get curvePolyline(): string {
    return this.result ? this.getCurveCoordinates(this.result.points) : '';
  }

  get curveArea(): string {
    if (!this.result || this.result.points.length === 0) {
      return '';
    }
    return `12,208 ${this.getCurveCoordinates(this.result.points)} 608,208`;
  }

  get chartAxisLabels(): number[] {
    const result = this.result;
    if (!result) {
      return [];
    }
    const span = result.maxStat - result.minStat;
    return [0, 0.25, 0.5, 0.75, 1].map((position) =>
      Math.round(result.minStat + span * position),
    );
  }

  get formattedScore(): string {
    const result = this.result;
    return result
      ? `${result.score.toFixed(1)}${result.rangeTruncated ? '+' : ''}`
      : '';
  }

  get benchmarkMarkerX(): number | null {
    const result = this.result;
    if (!result || result.benchmark50 == null) {
      return null;
    }
    const span = Math.max(1, result.maxStat - result.minStat);
    return 12 + ((result.benchmark50 - result.minStat) / span) * 596;
  }

  get representativePoint(): BoardStrengthPoint | null {
    const result = this.result;
    if (!result || result.points.length === 0) {
      return null;
    }
    const target = result.benchmark50 ?? result.score;
    return result.points.reduce((closest, point) =>
      Math.abs(point.stat - target) < Math.abs(closest.stat - target)
        ? point
        : closest,
    );
  }

  get representativeCaption(): string {
    return this.result?.benchmark50 == null
      ? 'Closest tested matchup'
      : 'Nearest to the 50% benchmark';
  }

  setSide(side: BoardStrengthSide): void {
    if (this.status === 'running') {
      return;
    }
    this.selectedSide = side;
    this.status = 'idle';
    this.errorMessage = '';
    this.copyLabel = 'Copy Summary';
  }

  evaluate(): void {
    if (!this.canEvaluate) {
      return;
    }
    this.worker?.terminate();
    this.status = 'running';
    this.progress = null;
    this.errorMessage = '';
    this.copyLabel = 'Copy Summary';
    this.evaluationFingerprint = this.state.getFingerprint(
      this.formGroup,
      this.selectedSide,
    );

    this.worker = this.simulationService.runBoardStrengthInWorker(
      this.formGroup,
      this.player,
      this.opponent,
      {
        onProgress: (progress) => {
          this.progress = progress;
          this.changeDetectorRef.markForCheck();
        },
        onResult: (result) => {
          this.finishEvaluation(result);
        },
        onAborted: () => {
          this.status = 'cancelled';
          this.cleanupWorker();
          this.changeDetectorRef.markForCheck();
        },
        onError: (message) => {
          this.status = 'error';
          this.errorMessage = message;
          this.cleanupWorker();
          this.changeDetectorRef.markForCheck();
        },
      },
      {
        side: this.selectedSide,
        precision: this.precision,
        minStat: 1,
      },
    );
    this.changeDetectorRef.markForCheck();
  }

  cancel(): void {
    if (this.status !== 'running') {
      return;
    }
    this.worker?.terminate();
    this.worker = null;
    this.status = 'cancelled';
    this.progress = null;
    this.changeDetectorRef.markForCheck();
  }

  async copySummary(): Promise<void> {
    const result = this.result;
    if (!result || typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    const representative = this.representativePoint;
    const benchmark = this.formatBenchmark(result.benchmark50);
    const matchup = representative
      ? ` At ${representative.stat}/${representative.stat}: ${this.getWinPercent(representative)}% win, ${this.getDrawPercent(representative)}% draw, ${this.getLossPercent(representative)}% loss.`
      : '';
    await navigator.clipboard.writeText(
      `${this.sideLabel} board strength: ${result.score.toFixed(1)}${result.rangeTruncated ? '+' : ''} (BS1). 50% benchmark: ${benchmark}. ${result.totalBattles.toLocaleString()} battles.${matchup}`,
    );
    this.copyLabel = 'Copied';
    this.changeDetectorRef.markForCheck();
  }

  get sideLabel(): string {
    return this.selectedSide === 'player' ? 'Player' : 'Opponent';
  }

  getPetIcon(name: string): string {
    return getPetIconPath(name) ?? '';
  }

  formatBenchmark(value: number | null): string {
    return value == null ? '<1/1' : `${value}/${value}`;
  }

  getWinPercent(point: BoardStrengthPoint): number {
    return this.toPercent(point.wins, point.battles);
  }

  getDrawPercent(point: BoardStrengthPoint): number {
    return this.toPercent(point.draws, point.battles);
  }

  getLossPercent(point: BoardStrengthPoint): number {
    return this.toPercent(point.losses, point.battles);
  }

  trackByStat(_index: number, point: BoardStrengthPoint): number {
    return point.stat;
  }

  private finishEvaluation(result: BoardStrengthResult): void {
    if (!result.aborted) {
      this.state.store(
        this.selectedSide,
        this.evaluationFingerprint,
        result,
      );
    }
    this.status = result.aborted ? 'cancelled' : 'idle';
    this.progress = null;
    this.cleanupWorker();
    this.changeDetectorRef.markForCheck();
  }

  private cleanupWorker(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  private getCurveCoordinates(points: BoardStrengthPoint[]): string {
    if (points.length === 0) {
      return '';
    }
    const divisor = Math.max(1, points.length - 1);
    return points
      .map((point, index) => {
        const x = 12 + (index / divisor) * 596;
        const y = 16 + (1 - point.smoothedScore) * 188;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  private toPercent(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}
