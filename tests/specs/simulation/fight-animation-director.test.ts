import { describe, expect, it } from 'vitest';
import { Log } from '../../../src/app/domain/interfaces/log.interface';
import {
  buildFightAnimationFrames,
  buildFightAnimationTimeline,
  getDirectedIntervalMs,
} from '../../../src/app/ui/shell/simulation/app.component.fight-animation';

const BASE_BOARD =
  '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';

describe('Fight animation director', () => {
  it('builds deterministic timelines for the same frame list', () => {
    const logs: Log[] = [
      { type: 'board', message: BASE_BOARD },
      {
        type: 'attack',
        message: 'Ant attacks Pig for 4.',
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
      {
        type: 'ability',
        message: 'Pig gained 2 attack.',
        sourceIndex: 1,
        playerIsOpponent: true,
      },
    ];
    const frames = buildFightAnimationFrames(logs, { includeBoardFrames: false });

    const timelineA = buildFightAnimationTimeline(frames);
    const timelineB = buildFightAnimationTimeline(frames);

    expect(timelineA).toEqual(timelineB);
    expect(timelineA.steps).toHaveLength(2);
  });

  it('allows opposite-side ability intents to overlap in timeline start time', () => {
    const logs: Log[] = [
      { type: 'board', message: BASE_BOARD },
      {
        type: 'ability',
        message: 'Ant gained 2 attack.',
        sourceIndex: 1,
        playerIsOpponent: false,
      },
      {
        type: 'ability',
        message: 'Pig gained 2 attack.',
        sourceIndex: 1,
        playerIsOpponent: true,
      },
    ];
    const frames = buildFightAnimationFrames(logs, { includeBoardFrames: false });
    const timeline = buildFightAnimationTimeline(frames);

    expect(timeline.steps).toHaveLength(2);
    expect(timeline.steps[0].mode).toBe('overlap');
    expect(timeline.steps[1].mode).toBe('overlap');
    expect(timeline.steps[1].startAtMs).toBe(timeline.steps[0].startAtMs);
    expect(getDirectedIntervalMs(timeline, 0)).toBe(90);
  });

  it('treats attack intents as blocking and delays following frames', () => {
    const logs: Log[] = [
      { type: 'board', message: BASE_BOARD },
      {
        type: 'attack',
        message: 'Ant attacks Pig for 4.',
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
      {
        type: 'ability',
        message: 'Ant gained 2 attack.',
        sourceIndex: 1,
        playerIsOpponent: false,
      },
    ];
    const frames = buildFightAnimationFrames(logs, { includeBoardFrames: false });
    const timeline = buildFightAnimationTimeline(frames);
    const attackStep = timeline.steps[0];
    const followingStep = timeline.steps[1];

    expect(attackStep.mode).toBe('block');
    expect(followingStep.startAtMs).toBeGreaterThanOrEqual(attackStep.endAtMs);
  });
});
