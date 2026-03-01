import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

function createConfig(sparrowExp: number): SimulationConfig {
  return {
    playerPack: 'Star',
    opponentPack: 'Turtle',
    turn: 8,
    logsEnabled: true,
    simulationCount: 1,
    playerPets: [
      {
        name: 'Ant',
        attack: 1,
        health: 50,
        exp: 0,
        equipment: { name: 'Strawberry' },
      },
      {
        name: 'Sparrow',
        attack: 3,
        health: 2,
        exp: sparrowExp,
      },
      null,
      null,
      null,
    ],
    opponentPets: [
      {
        name: 'Elephant',
        attack: 30,
        health: 100,
        exp: 0,
      },
      null,
      null,
      null,
      null,
    ],
  };
}

function getElephantIntoAntLogs(messages: string[]): string[] {
  return messages.filter((message) => message.startsWith('Elephant attacks Ant for '));
}

function getDamageValues(attackMessages: string[]): number[] {
  return attackMessages
    .map((message) => /^Elephant attacks Ant for (\d+)\./.exec(message))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => Number(match[1]));
}

describe('Sparrow + Strawberry shield regression', () => {
  it('blocks 5 damage for each Strawberry use at Sparrow level 1', () => {
    const result = runSimulation(createConfig(0));
    const messages = (result.battles?.[0]?.logs ?? [])
      .map((log) => log.message)
      .filter((message): message is string => typeof message === 'string');
    const elephantAttackLogs = getElephantIntoAntLogs(messages);
    const damageValues = getDamageValues(elephantAttackLogs);

    expect(damageValues).toEqual([25, 25]);
    expect(elephantAttackLogs[0]).toContain('(Strawberry -5 (Sparrow))');
    expect(elephantAttackLogs[1]).toContain('(Strawberry -5 (Sparrow))');
  });

  it('blocks 10 damage for each Strawberry use at Sparrow level 2', () => {
    const result = runSimulation(createConfig(2));
    const messages = (result.battles?.[0]?.logs ?? [])
      .map((log) => log.message)
      .filter((message): message is string => typeof message === 'string');
    const elephantAttackLogs = getElephantIntoAntLogs(messages);
    const damageValues = getDamageValues(elephantAttackLogs);

    expect(damageValues.slice(0, 3)).toEqual([20, 20, 30]);
    expect(elephantAttackLogs[0]).toContain('(Strawberry -10 (Sparrow))');
    expect(elephantAttackLogs[1]).toContain('(Strawberry -10 (Sparrow))');
    expect(elephantAttackLogs[2]).not.toContain('(Strawberry');
  });
});
