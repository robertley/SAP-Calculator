import type {
  FightOptimizerResult,
  OptimizerSide,
  PetConfig,
} from 'sap-battle-engine';

export type FightOptimizerLineup = Array<PetConfig | null>;

export interface FightOptimizerDisplayPet {
  pet: PetConfig | null;
  position: number;
}

export type FightOptimizerDisplayLineup = FightOptimizerDisplayPet[];

export interface FightOptimizerPositionChange {
  pet: PetConfig;
  fromPosition: number;
  toPosition: number;
}

export interface FightOptimizerTraceStep {
  step: FightOptimizerResult['steps'][number];
  stepIndex: number;
}

/**
 * Both engine lineups are front-to-back. Mirror the player lineup when it is
 * drawn on the left side of the battlefield, retaining each engine position
 * so movement labels and connector anchors remain accurate.
 */
export function getFightOptimizerDisplayLineup(
  lineup: FightOptimizerLineup,
  side: OptimizerSide,
): FightOptimizerDisplayLineup {
  const displayed = lineup.map((pet, index) => ({
    pet,
    position: index + 1,
  }));

  return side === 'player' ? displayed.reverse() : displayed;
}

/**
 * A cycle spans state indices [startState, endState]. Since response step i
 * produces state i + 1, steps startState through endState - 1 are the
 * transitions that repeat. Non-cycle results retain their complete trace.
 */
export function getFightOptimizerTraceSteps(
  result: FightOptimizerResult,
): FightOptimizerTraceStep[] {
  const cycle = result.termination === 'cycle' ? result.cycle : undefined;
  const hasValidCycle =
    cycle &&
    Number.isInteger(cycle.startState) &&
    Number.isInteger(cycle.endState) &&
    cycle.startState >= 0 &&
    cycle.endState > cycle.startState &&
    cycle.endState <= result.steps.length;
  const startIndex = hasValidCycle ? cycle.startState : 0;
  const endIndex = hasValidCycle ? cycle.endState : result.steps.length;

  return result.steps.slice(startIndex, endIndex).map((step, offset) => ({
    step,
    stepIndex: startIndex + offset,
  }));
}

/**
 * The optimizer reports orders as original input slots, while its final pets
 * are already arranged in the final order. Rebuild the original lineup first
 * so any response-state order can be rendered with the correct pets.
 */
export function getFightOptimizerLineup(
  result: FightOptimizerResult,
  side: OptimizerSide,
  positionId: number,
): FightOptimizerLineup {
  const finalOrder =
    side === 'player'
      ? result.finalPosition.playerOrder
      : result.finalPosition.opponentOrder;
  const finalPets =
    side === 'player'
      ? result.finalPosition.playerPets
      : result.finalPosition.opponentPets;
  const positioning = result.positionings[side].find(
    (candidate) => candidate.id === positionId,
  );

  if (!positioning) {
    return [];
  }

  const lineupSize = Math.max(
    finalPets.length,
    finalOrder.length,
    ...finalOrder.map((slot) => slot + 1),
  );
  const originalLineup: FightOptimizerLineup = Array.from(
    { length: lineupSize },
    (): PetConfig | null => null,
  );

  finalOrder.forEach((sourceSlot, currentSlot) => {
    originalLineup[sourceSlot] = finalPets[currentSlot] ?? null;
  });

  return positioning.order.map(
    (sourceSlot) => originalLineup[sourceSlot] ?? null,
  );
}

/** Compare a response state with the state immediately before it. */
export function getFightOptimizerStepChanges(
  result: FightOptimizerResult,
  stepIndex: number,
): FightOptimizerPositionChange[] {
  const step = result.steps[stepIndex];
  if (!step) {
    return [];
  }

  const side = step.side;
  const currentPositionId =
    side === 'player' ? step.playerPosition : step.opponentPosition;
  const previousStep = result.steps[stepIndex - 1];
  const previousPositionId = previousStep
    ? side === 'player'
      ? previousStep.playerPosition
      : previousStep.opponentPosition
    : result.positionings[side][0]?.id;
  if (previousPositionId === undefined) {
    return [];
  }

  const previousPosition = result.positionings[side].find(
    (positioning) => positioning.id === previousPositionId,
  );
  const currentPosition = result.positionings[side].find(
    (positioning) => positioning.id === currentPositionId,
  );
  if (!previousPosition || !currentPosition) {
    return [];
  }

  const currentLineup = getFightOptimizerLineup(
    result,
    side,
    currentPositionId,
  );
  const changes: FightOptimizerPositionChange[] = [];

  currentPosition.order.forEach((sourceSlot, currentIndex) => {
    const previousIndex = previousPosition.order.indexOf(sourceSlot);
    const pet = currentLineup[currentIndex];
    if (pet?.name && previousIndex >= 0 && previousIndex !== currentIndex) {
      changes.push({
        pet,
        fromPosition: previousIndex + 1,
        toPosition: currentIndex + 1,
      });
    }
  });

  return changes;
}
