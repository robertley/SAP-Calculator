import { describe, expect, it } from 'vitest';
import { runSimulation } from '../../../simulation/simulate';
import { createBaseConfig, createPet } from '../../support/battle-test-runtime';
import {
  buildFightAnimationFrames,
  parseFightAnimationBoardState,
} from '../../../src/app/ui/shell/simulation/app.component.fight-animation';
import { buildFightAnimationRenderFrame } from '../../../src/app/ui/shell/simulation/app.component.fight-animation-controls';

describe('Fight animation frames', () => {
  it('parses board snapshots into player/opponent slots', () => {
    const message =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant"><img src="assets/items/Garlic.png" class="log-inline-icon" alt="Garlic">(4/5/2xp) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(3/4/1xp) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';

    const state = parseFightAnimationBoardState(message);

    expect(state).not.toBeNull();
    expect(state?.playerSlots[0]).toMatchObject({
      isEmpty: false,
      attack: 4,
      health: 5,
      exp: 2,
      petName: 'Ant',
      equipmentName: 'Garlic',
    });
    expect(state?.opponentSlots[0]).toMatchObject({
      isEmpty: false,
      attack: 3,
      health: 4,
      exp: 1,
      petName: 'Fish',
    });
    expect(state?.playerSlots[1].isEmpty).toBe(true);
  });

  it('builds frames from logs and applies in-between combat mutations', () => {
    const firstBoard =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(4/4) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const finalBoard =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/1) | ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: 'Phase 1: Before battle' },
      { type: 'board', message: firstBoard },
      {
        type: 'attack',
        message: 'Ant attacks Fish for 4.',
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
      { type: 'death', message: 'Fish fainted.' },
      { type: 'board', message: finalBoard },
      { type: 'board', message: 'Player is the winner' },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(5);
    expect(frames[1]).toMatchObject({
      logIndex: 2,
      type: 'attack',
      text: '[P1->O1] Ant attacks Fish for 4.',
      impact: {
        attackerSide: 'player',
        attackerSlot: 0,
        targetSide: 'opponent',
        targetSlot: 0,
        damage: 4,
      },
    });
    expect(frames[1].opponentSlots[0]).toMatchObject({
      isEmpty: false,
      petName: 'Fish',
      health: 0,
    });
    expect(frames[1].popups).toContainEqual({
      side: 'opponent',
      slot: 0,
      type: 'damage',
      delta: -4,
    });
    expect(frames[2].opponentSlots[0].isEmpty).toBe(true);
    expect(frames[4]).toMatchObject({
      logIndex: 5,
      type: 'board',
      text: 'Player is the winner',
    });
  });

  it('can skip board logs while still applying board snapshots to state', () => {
    const firstBoard =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(4/4) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: firstBoard },
      {
        type: 'attack',
        message: 'Ant attacks Fish for 4.',
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any, {
      includeBoardFrames: false,
    });

    expect(frames).toHaveLength(1);
    expect(frames[0]).toMatchObject({
      type: 'attack',
      logIndex: 1,
    });
    expect(frames[0].impact).toMatchObject({
      attackerSide: 'player',
      targetSide: 'opponent',
      targetSlot: 0,
      damage: 4,
    });
  });

  it('updates transformed pet image, stats, and equipment between board logs', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Tadpole.png" class="log-pet-icon" alt="Tadpole">(2/1) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Tadpole transformed into a level 1 Frog.',
        sourceIndex: 1,
      },
      {
        type: 'ability',
        message: 'Frog gave Frog 2 attack and 3 health.',
        sourceIndex: 1,
        targetIndex: 1,
      },
      {
        type: 'ability',
        message: 'Frog gave Frog Melon.',
        sourceIndex: 1,
        targetIndex: 1,
      },
      {
        type: 'ability',
        message: 'Frog lost Melon equipment',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(5);
    expect(frames[1].playerSlots[0]).toMatchObject({
      petName: 'Frog',
      petIconSrc: 'assets/art/Public/Public/Pets/Frog.png',
    });
    expect(frames[2].playerSlots[0]).toMatchObject({
      attack: 4,
      health: 4,
    });
    expect(frames[2].popups).toEqual(
      expect.arrayContaining([
        {
          side: 'player',
          slot: 0,
          type: 'attack',
          delta: 2,
        },
        {
          side: 'player',
          slot: 0,
          type: 'health',
          delta: 3,
        },
      ]),
    );
    expect(frames[3].playerSlots[0]).toMatchObject({
      equipmentName: 'Melon',
      equipmentIconSrc: 'assets/art/Public/Public/Food/Melon.png',
    });
    expect(frames[4].playerSlots[0]).toMatchObject({
      equipmentName: null,
      equipmentIconSrc: null,
    });
  });

  it('applies experience changes and emits exp popups', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(3/4/1xp) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8/0xp) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Fish gained +2 experience.',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].playerSlots[0]).toMatchObject({
      petName: 'Fish',
      exp: 3,
    });
    expect(frames[1].popups).toContainEqual({
      side: 'player',
      slot: 0,
      type: 'exp',
      delta: 2,
    });
  });

  it('updates the slot pet visual when a stat-gain log names a different pet', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Frog gained 2 attack and 1 health.',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].playerSlots[0]).toMatchObject({
      petName: 'Frog',
      petIconSrc: 'assets/art/Public/Public/Pets/Frog.png',
      attack: 6,
      health: 5,
    });
    expect(frames[1].popups).toEqual(
      expect.arrayContaining([
        {
          side: 'player',
          slot: 0,
          type: 'attack',
          delta: 2,
        },
        {
          side: 'player',
          slot: 0,
          type: 'health',
          delta: 1,
        },
      ]),
    );
  });

  it('applies enemy ailment equipment to the correct side', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Kakapo.png" class="log-pet-icon" alt="Kakapo">(8/8) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Kakapo gave Pig Spooked.',
        sourceIndex: 1,
        targetIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].opponentSlots[0]).toMatchObject({
      petName: 'Pig',
      equipmentName: 'Spooked',
      equipmentIconSrc: 'assets/art/Ailments/Ailments/Scared.png',
    });
    expect(frames[1].playerSlots[0].equipmentName).toBeNull();
  });

  it('keeps same-side attack targets on their own side', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) P2 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(3/5) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(7/7) O2 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(7/7) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'attack',
        message: 'Ant attacks Fish for 2.',
        sourceIndex: 1,
        targetIndex: 2,
        playerIsOpponent: false,
        targetIsOpponent: false,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].impact).toMatchObject({
      attackerSide: 'player',
      attackerSlot: 0,
      targetSide: 'player',
      targetSlot: 1,
      damage: 2,
    });
    expect(frames[1].playerSlots[1]).toMatchObject({
      petName: 'Fish',
      health: 3,
    });
    expect(frames[1].opponentSlots[1]).toMatchObject({
      petName: 'Pig',
      health: 7,
    });
  });

  it('uses base pet icon with companion badge for copied-ability names', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(6/8) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'attack',
        message: "Abomination's Parrot's Whale attacks Pig for 3.",
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].playerSlots[0]).toMatchObject({
      petName: "Abomination's Parrot's Whale",
      petIconSrc: 'assets/art/Public/Public/Pets/Shoggoth.png',
      petCompanionName: 'Whale',
      petCompanionIconSrc: 'assets/art/Public/Public/Pets/Whale.png',
    });
  });

  it('captures faint and shift-forward effects when front units die', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(2/2) O2 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(6/6) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'death',
        message: 'Fish fainted.',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].death).toMatchObject({
      side: 'opponent',
      slot: 0,
      petName: 'Fish',
    });
    expect(frames[1].shifts).toContainEqual({
      side: 'opponent',
      slot: 0,
      fromSlot: 1,
    });
    expect(frames[1].opponentSlots[0]).toMatchObject({
      petName: 'Pig',
    });
  });

  it('precomputes slot render model classes and suppresses death ghost on shifted slot', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(2/2) O2 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(6/6) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'death',
        message: 'Fish fainted.',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);
    const renderFrame = buildFightAnimationRenderFrame(frames[1], 1);
    const shiftedOpponentFront = renderFrame.opponentSlots[0];

    expect(renderFrame.phase).toBe('b');
    expect(shiftedOpponentFront.classMap['fight-slot-shifted']).toBe(true);
    expect(shiftedOpponentFront.shiftSteps).toBe(1);
    expect(shiftedOpponentFront.death).toBeNull();
  });

  it('applies per-slot impact phase classes for attacker lunge animations', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Ant.png" class="log-pet-icon" alt="Ant">(4/4) | O1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(4/4) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'attack',
        message: 'Ant attacks Fish for 4.',
        sourceIndex: 1,
        targetIndex: 1,
        playerIsOpponent: false,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);
    const renderFrame = buildFightAnimationRenderFrame(frames[1], 1);
    const playerFront = renderFrame.playerSlots[0];
    const opponentFront = renderFrame.opponentSlots[0];

    expect(renderFrame.phase).toBe('b');
    expect(playerFront.classMap['fight-slot-attacker']).toBe(true);
    expect(playerFront.classMap['fight-impact-phase-b']).toBe(true);
    expect(playerFront.classMap['fight-impact-phase-a']).toBe(false);
    expect(opponentFront.classMap['fight-slot-target']).toBe(true);
    expect(opponentFront.classMap['fight-impact-phase-b']).toBe(true);
    expect(opponentFront.classMap['fight-impact-phase-a']).toBe(false);
  });

  it('precomputes stat-gain slot classes and popup grouping', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) P1 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(3/4/1xp) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(8/8/0xp) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Fish gained +2 experience.',
        sourceIndex: 1,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);
    const renderFrame = buildFightAnimationRenderFrame(frames[1], 0);
    const playerFront = renderFrame.playerSlots[0];

    expect(renderFrame.phase).toBe('a');
    expect(playerFront.classMap['fight-slot-stat-gain']).toBe(true);
    expect(playerFront.popups).toContainEqual({
      side: 'player',
      slot: 0,
      type: 'exp',
      delta: 2,
    });
  });

  it('applies Armadillo-style "increased health of X by N" logs to the named target', () => {
    const board =
      '___ (-/-) ___ (-/-) ___ (-/-) P2 <img src="assets/pets/Fish.png" class="log-pet-icon" alt="Fish">(3/4) P1 <img src="assets/pets/Armadillo.png" class="log-pet-icon" alt="Armadillo">(4/8) | O1 <img src="assets/pets/Pig.png" class="log-pet-icon" alt="Pig">(6/6) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
    const logs: any[] = [
      { type: 'board', message: board },
      {
        type: 'ability',
        message: 'Armadillo increased health of Pig by 8.',
        playerIsOpponent: false,
      },
    ];

    const frames = buildFightAnimationFrames(logs as any);

    expect(frames).toHaveLength(2);
    expect(frames[1].opponentSlots[0]).toMatchObject({
      petName: 'Pig',
      health: 14,
    });
    expect(frames[1].playerSlots[0]).toMatchObject({
      petName: 'Armadillo',
      health: 8,
    });
    expect(frames[1].popups).toContainEqual({
      side: 'opponent',
      slot: 0,
      type: 'health',
      delta: 8,
    });
  });

  it('creates playable frames from real simulation battle logs', () => {
    const config = createBaseConfig('Custom');
    config.logsEnabled = true;
    config.maxLoggedBattles = 1;
    config.simulationCount = 1;
    config.playerPets[0] = createPet('Ant', { attack: 4, health: 4 });
    config.opponentPets[0] = createPet('Fish', { attack: 4, health: 4 });

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const frames = buildFightAnimationFrames(logs as any);

    expect(frames.length).toBeGreaterThan(0);
    const attackFrame = frames.find((frame) => frame.type === 'attack');
    expect(attackFrame).toBeTruthy();
    expect(attackFrame?.impact).toBeTruthy();
    expect(frames.some((frame) => frame.playerSlots.some((slot) => !slot.isEmpty))).toBe(true);
    expect(frames[frames.length - 1].text.length).toBeGreaterThan(0);
  });
});
