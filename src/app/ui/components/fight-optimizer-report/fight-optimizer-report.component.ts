import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import type {
  FightOptimizerResult,
  OptimizerSide,
  PetConfig,
  Positioning,
} from 'sap-battle-engine';
import {
  getEquipmentIconPath,
  getPetIconPath,
} from 'app/runtime/asset-catalog';
import { AILMENT_CATEGORIES } from 'app/integrations/equipment/equipment-categories';
import { getPetConfigEquipmentName } from 'app/integrations/equipment/pet-config-equipment';
import {
  getFightOptimizerDisplayLineup,
  getFightOptimizerLineup,
  getFightOptimizerStepChanges,
  getFightOptimizerTraceSteps,
} from './fight-optimizer-report-lineups';
import type {
  FightOptimizerDisplayLineup,
  FightOptimizerPositionChange,
  FightOptimizerTraceStep,
} from './fight-optimizer-report-lineups';

export type FightOptimizerApplyScope = OptimizerSide | 'both';

interface FightOptimizerConnector {
  key: string;
  path: string;
  side: OptimizerSide;
}

const AILMENT_NAMES = new Set(Object.values(AILMENT_CATEGORIES).flat());

@Component({
  selector: 'app-fight-optimizer-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fight-optimizer-report.component.html',
  styleUrl: './fight-optimizer-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FightOptimizerReportComponent implements OnDestroy {
  @ViewChild('optimizerTrace')
  private set optimizerTrace(element: ElementRef<HTMLElement> | undefined) {
    this.traceResizeObserver?.disconnect();
    this.traceResizeObserver = null;
    this.optimizerTraceElement = element;
    const traceElement = element?.nativeElement;
    if (traceElement && typeof ResizeObserver !== 'undefined') {
      this.traceResizeObserver = new ResizeObserver(() => {
        this.scheduleConnectorLayout();
      });
      this.traceResizeObserver.observe(traceElement);
    }
    this.scheduleConnectorLayout();
  }

  private optimizerTraceElement?: ElementRef<HTMLElement>;
  private optimizationResult: FightOptimizerResult | null = null;
  private readonly traceLineupCache = new Map<
    string,
    FightOptimizerDisplayLineup
  >();
  private readonly traceChangeCache = new Map<
    number,
    FightOptimizerPositionChange[]
  >();
  private connectorFrame: number | null = null;
  private traceResizeObserver: ResizeObserver | null = null;

  traceConnectors: FightOptimizerConnector[] = [];
  traceConnectorWidth = 0;
  traceConnectorHeight = 0;
  traceSteps: FightOptimizerTraceStep[] = [];
  finalLineups: Record<OptimizerSide, FightOptimizerDisplayLineup> = {
    player: [],
    opponent: [],
  };
  minimized = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  set result(value: FightOptimizerResult | null) {
    const isNewResult = value !== this.optimizationResult;
    this.optimizationResult = value;
    if (!value || isNewResult) {
      this.minimized = false;
    }
    this.traceLineupCache.clear();
    this.traceChangeCache.clear();
    this.traceConnectors = [];
    this.traceSteps = value ? getFightOptimizerTraceSteps(value) : [];
    this.finalLineups = value
      ? {
          player: getFightOptimizerDisplayLineup(
            value.finalPosition.playerPets,
            'player',
          ),
          opponent: getFightOptimizerDisplayLineup(
            value.finalPosition.opponentPets,
            'opponent',
          ),
        }
      : { player: [], opponent: [] };
    this.scheduleConnectorLayout();
  }

  get result(): FightOptimizerResult | null {
    return this.optimizationResult;
  }

  @Output() applyLineup = new EventEmitter<FightOptimizerApplyScope>();

  toggleMinimized(): void {
    this.minimized = !this.minimized;
    if (!this.minimized) {
      this.scheduleConnectorLayout();
    }
  }

  ngOnDestroy(): void {
    this.traceResizeObserver?.disconnect();
    if (this.connectorFrame !== null) {
      cancelAnimationFrame(this.connectorFrame);
    }
  }

  terminationLabel(result: FightOptimizerResult): string {
    const labels: Record<FightOptimizerResult['termination'], string> = {
      cycle: 'Response cycle found',
      'no-sampled-counter': 'No sampled counter',
      'simulation-budget': 'Simulation budget reached',
      'step-limit': 'Response-step limit reached',
      cancelled: 'Cancelled',
    };
    return labels[result.termination];
  }

  terminationDescription(result: FightOptimizerResult): string {
    if (result.termination === 'cycle' && result.cycle) {
      return `The response path repeated after ${result.cycle.length} state${
        result.cycle.length === 1 ? '' : 's'
      }.`;
    }
    if (result.termination === 'no-sampled-counter' && result.unbeatenSide) {
      return `${this.sideLabel(result.unbeatenSide)} had no sampled winning counter-position.`;
    }
    if (result.termination === 'simulation-budget') {
      return 'The configured battle budget was exhausted; the result is intentionally incomplete.';
    }
    if (result.termination === 'step-limit') {
      return 'The response-step limit was reached; the result is intentionally incomplete.';
    }
    return 'The search stopped before completing another response.';
  }

  sideLabel(side: OptimizerSide): string {
    return side === 'player' ? 'Player' : 'Opponent';
  }

  petIcon(pet: PetConfig | null): string | null {
    return pet?.name ? getPetIconPath(pet.name) : null;
  }

  equipmentName(pet: PetConfig | null): string | null {
    return getPetConfigEquipmentName(pet?.equipment);
  }

  equipmentIcon(pet: PetConfig | null): string | null {
    const equipmentName = this.equipmentName(pet);
    return equipmentName
      ? getEquipmentIconPath(
          equipmentName,
          AILMENT_NAMES.has(equipmentName),
        )
      : null;
  }

  traceLineup(
    result: FightOptimizerResult,
    side: OptimizerSide,
    positionId: number,
  ): FightOptimizerDisplayLineup {
    const cacheKey = `${side}:${positionId}`;
    const cachedLineup = this.traceLineupCache.get(cacheKey);
    if (cachedLineup) {
      return cachedLineup;
    }

    const lineup = getFightOptimizerDisplayLineup(
      getFightOptimizerLineup(result, side, positionId),
      side,
    );
    this.traceLineupCache.set(cacheKey, lineup);
    return lineup;
  }

  traceChanges(
    result: FightOptimizerResult,
    stepIndex: number,
  ): FightOptimizerPositionChange[] {
    const cachedChanges = this.traceChangeCache.get(stepIndex);
    if (cachedChanges) {
      return cachedChanges;
    }

    const changes = getFightOptimizerStepChanges(result, stepIndex);
    this.traceChangeCache.set(stepIndex, changes);
    return changes;
  }

  refreshTraceConnectors(): void {
    this.scheduleConnectorLayout();
  }

  private scheduleConnectorLayout(): void {
    if (
      !this.optimizerTraceElement ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      return;
    }
    if (this.connectorFrame !== null) {
      cancelAnimationFrame(this.connectorFrame);
    }
    this.connectorFrame = requestAnimationFrame(() => {
      this.connectorFrame = null;
      this.layoutTraceConnectors();
    });
  }

  private layoutTraceConnectors(): void {
    const traceElement = this.optimizerTraceElement?.nativeElement;
    const result = this.optimizationResult;
    if (!traceElement || !result || traceElement.clientWidth < 992) {
      this.setTraceConnectors([], 0, 0);
      return;
    }

    const stepElements = Array.from(
      traceElement.querySelectorAll<HTMLElement>('.optimizer-trace-step'),
    );
    if (stepElements.length !== this.traceSteps.length) {
      this.scheduleConnectorLayout();
      return;
    }

    const traceBounds = traceElement.getBoundingClientRect();
    const connectors: FightOptimizerConnector[] = [];
    for (
      let traceIndex = 1;
      traceIndex < this.traceSteps.length;
      traceIndex += 1
    ) {
      const traceStep = this.traceSteps[traceIndex];
      const step = traceStep.step;
      const changes = this.traceChanges(result, traceStep.stepIndex);
      changes.forEach((change, changeIndex) => {
        const previousPet = this.findTracePet(
          stepElements[traceIndex - 1],
          step.side,
          change.fromPosition,
        );
        const currentPet = this.findTracePet(
          stepElements[traceIndex],
          step.side,
          change.toPosition,
        );
        if (!previousPet || !currentPet) {
          return;
        }

        const previousBounds = previousPet.getBoundingClientRect();
        const currentBounds = currentPet.getBoundingClientRect();
        const fromX =
          previousBounds.left +
          previousBounds.width / 2 -
          traceBounds.left +
          traceElement.scrollLeft;
        const fromY =
          previousBounds.bottom - traceBounds.top + traceElement.scrollTop;
        const toX =
          currentBounds.left +
          currentBounds.width / 2 -
          traceBounds.left +
          traceElement.scrollLeft;
        const toY =
          currentBounds.top - traceBounds.top + traceElement.scrollTop - 6;
        const verticalDistance = Math.max(24, toY - fromY);
        const bend = Math.max(20, verticalDistance * 0.42);
        const laneOffset =
          (changeIndex - (changes.length - 1) / 2) * 5;

        connectors.push({
          key: `${traceStep.stepIndex}:${step.side}:${change.fromPosition}:${change.toPosition}`,
          side: step.side,
          path: `M ${fromX} ${fromY} C ${fromX} ${
            fromY + bend + laneOffset
          }, ${toX} ${toY - bend + laneOffset}, ${toX} ${toY}`,
        });
      });
    }

    this.setTraceConnectors(
      connectors,
      traceElement.scrollWidth,
      traceElement.scrollHeight,
    );
  }

  private findTracePet(
    stepElement: HTMLElement,
    side: OptimizerSide,
    position: number,
  ): HTMLElement | null {
    return stepElement.querySelector<HTMLElement>(
      `.optimizer-trace-team[data-side="${side}"] .optimizer-trace-pet[data-position="${position}"]`,
    );
  }

  private setTraceConnectors(
    connectors: FightOptimizerConnector[],
    width: number,
    height: number,
  ): void {
    this.traceConnectors = connectors;
    this.traceConnectorWidth = width;
    this.traceConnectorHeight = height;
    this.changeDetectorRef.markForCheck();
  }

  formatOrder(order: number[]): string {
    return order.map((slot) => slot + 1).join(' → ');
  }

  formatDisplayedOrder(order: number[], side: OptimizerSide): string {
    return this.formatOrder(side === 'player' ? order.slice().reverse() : order);
  }

  formatPosition(position: Positioning): string {
    return `#${position.id + 1}: ${this.formatOrder(position.order)}`;
  }
}
