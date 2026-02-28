import { FightAnimationFrame, FightSide } from './types';

export type FightAnimationLane = 'global' | FightSide;

export type FightAnimationIntentMode = 'block' | 'overlap';

export interface FightAnimationIntent {
    frameIndex: number;
    mode: FightAnimationIntentMode;
    lanes: FightAnimationLane[];
    durationMs: number;
}

export interface FightAnimationTimelineStep {
    frameIndex: number;
    startAtMs: number;
    endAtMs: number;
    durationMs: number;
    mode: FightAnimationIntentMode;
    lanes: FightAnimationLane[];
}

export interface FightAnimationTimeline {
    steps: FightAnimationTimelineStep[];
    totalDurationMs: number;
}

const MIN_DIRECTED_DURATION_MS = 120;

const BASE_DURATION_BY_TYPE: Record<FightAnimationFrame['type'], number> = {
    board: 180,
    attack: 360,
    death: 220,
    ability: 260,
    equipment: 260,
    move: 230,
    trumpets: 240,
};

export function buildFightAnimationIntents(
    frames: FightAnimationFrame[],
): FightAnimationIntent[] {
    return frames.map((frame, frameIndex) => {
        const lanes = collectTouchedLanes(frame);
        const mode = determineIntentMode(frame, lanes);
        return {
            frameIndex,
            mode,
            lanes,
            durationMs: computeFrameDurationMs(frame),
        };
    });
}

export function buildFightAnimationTimeline(
    frames: FightAnimationFrame[],
): FightAnimationTimeline {
    if (!Array.isArray(frames) || frames.length === 0) {
        return { steps: [], totalDurationMs: 0 };
    }

    const intents = buildFightAnimationIntents(frames);
    const laneClock: Record<FightAnimationLane, number> = {
        global: 0,
        player: 0,
        opponent: 0,
    };
    const steps: FightAnimationTimelineStep[] = [];

    for (const intent of intents) {
        const dependencyLanes =
            intent.mode === 'block'
                ? (['global', 'player', 'opponent'] as FightAnimationLane[])
                : intent.lanes;
        const startAtMs = Math.max(
            0,
            ...dependencyLanes.map((lane) => laneClock[lane] ?? 0),
        );
        const endAtMs = startAtMs + intent.durationMs;
        const updateLanes =
            intent.mode === 'block'
                ? (['global', 'player', 'opponent'] as FightAnimationLane[])
                : intent.lanes;
        for (const lane of updateLanes) {
            laneClock[lane] = endAtMs;
        }
        steps.push({
            frameIndex: intent.frameIndex,
            startAtMs,
            endAtMs,
            durationMs: intent.durationMs,
            mode: intent.mode,
            lanes: intent.lanes,
        });
    }

    return {
        steps,
        totalDurationMs: Math.max(0, ...steps.map((step) => step.endAtMs)),
    };
}

export function getDirectedIntervalMs(
    timeline: FightAnimationTimeline | null | undefined,
    frameIndex: number,
): number | null {
    if (!timeline || frameIndex < 0 || frameIndex >= timeline.steps.length) {
        return null;
    }
    const step = timeline.steps[frameIndex];
    const nextStep = timeline.steps[frameIndex + 1];
    if (!step) {
        return null;
    }
    if (!nextStep) {
        return step.durationMs;
    }
    return Math.max(90, nextStep.startAtMs - step.startAtMs);
}

function determineIntentMode(
    frame: FightAnimationFrame,
    lanes: FightAnimationLane[],
): FightAnimationIntentMode {
    if (frame.type === 'attack' || frame.type === 'death') {
        return 'block';
    }
    if (frame.type === 'move') {
        return frame.shifts.length > 0 ? 'block' : 'overlap';
    }
    if (frame.type === 'board') {
        return 'overlap';
    }
    const nonGlobalLanes = new Set(
        lanes.filter((lane): lane is FightSide => lane !== 'global'),
    );
    if (nonGlobalLanes.size > 1) {
        return 'block';
    }
    return 'overlap';
}

function collectTouchedLanes(frame: FightAnimationFrame): FightAnimationLane[] {
    const lanes = new Set<FightAnimationLane>();

    if (frame.impact) {
        lanes.add(frame.impact.attackerSide);
        lanes.add(frame.impact.targetSide);
    }
    if (frame.death) {
        lanes.add(frame.death.side);
    }
    for (const popup of frame.popups) {
        lanes.add(popup.side);
    }
    for (const shift of frame.shifts) {
        lanes.add(shift.side);
    }
    for (const equipmentChange of frame.equipmentChanges) {
        lanes.add(equipmentChange.side);
    }
    for (const toyChange of frame.toyChanges) {
        lanes.add(toyChange.side);
    }

    if (lanes.size === 0) {
        lanes.add('global');
    }
    return Array.from(lanes);
}

function computeFrameDurationMs(frame: FightAnimationFrame): number {
    let durationMs = BASE_DURATION_BY_TYPE[frame.type] ?? 260;

    if (frame.randomEvent) {
        durationMs += 55;
    }
    if (frame.impact) {
        durationMs += frame.impact.isSnipe ? 42 : 72;
    }
    if (frame.death) {
        durationMs += 48;
    }
    if (frame.popups.length > 0) {
        durationMs += Math.min(140, frame.popups.length * 18);
    }
    if (frame.shifts.length > 0) {
        durationMs += Math.min(95, frame.shifts.length * 24);
    }
    if (frame.equipmentChanges.length > 0) {
        durationMs += Math.min(75, frame.equipmentChanges.length * 16);
    }
    if (frame.toyChanges.length > 0) {
        durationMs += Math.min(80, frame.toyChanges.length * 22);
    }
    if (
        frame.type === 'ability' &&
        frame.popups.length === 0 &&
        frame.equipmentChanges.length === 0 &&
        frame.toyChanges.length === 0 &&
        !frame.impact &&
        !frame.death
    ) {
        durationMs -= 30;
    }

    return Math.max(MIN_DIRECTED_DURATION_MS, durationMs);
}
