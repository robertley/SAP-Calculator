import { createBattleEngine, Battle, BattleEvent, BoardSnapshot, PetSnapshot, SimulationRunHooks } from 'sap-battle-engine';
import { SimulationConfig, SimulationResult, PetConfig } from 'app/domain/interfaces/simulation-config.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';
import { LogService } from '../log.service';
import { buildBoardStateMessage } from '../log/log-board-render';
import { AILMENT_CATEGORIES } from '../equipment/equipment-categories';

const ailments = new Set(Object.values(AILMENT_CATEGORIES).flat());

export function sampleBattlesByOutcome(
  battles: Battle[],
  limitPerOutcome: number,
): Battle[] {
  const limit = Math.max(0, Math.trunc(limitPerOutcome));
  const counts: Record<Battle['winner'], number> = {
    player: 0,
    opponent: 0,
    draw: 0,
  };
  return battles.filter((battle) => {
    if (counts[battle.winner] >= limit) {
      return false;
    }
    counts[battle.winner] += 1;
    return true;
  });
}

function displayPet(snapshot: PetSnapshot): Pet {
  const parent = new Player();
  parent.isOpponent = snapshot.side === 'opponent';
  return Object.assign(new Pet(), snapshot, {
    parent, savedPosition: snapshot.position - 1,
    equipment: snapshot.equipment ? { name: snapshot.equipment, uses: snapshot.equipmentUses } : null,
  });
}
function displayBoard(board: BoardSnapshot, config: SimulationConfig): string {
  const sides = (['player', 'opponent'] as const).map((side) => {
    const player = new Player();
    player.isOpponent = side === 'opponent';
    board[side].forEach((pet, index) => player.setPet(index, pet ? displayPet(pet) : null));
    const toy = side === 'player' ? config.playerToy : config.opponentToy;
    const hardToy = side === 'player' ? config.playerHardToy : config.opponentHardToy;
    player.toy = toy ? { name: toy, level: 1 } : null;
    player.hardToy = hardToy ? { name: hardToy, level: 1 } : null;
    return player;
  });
  return buildBoardStateMessage(sides[0], sides[1], (pet) => pet.savedPosition + 1, (name) => ailments.has(name));
}

/** The only bridge between battle execution and calculator presentation. */
export class CalculatorBattleEngine {
  private readonly engine = createBattleEngine();
  private readonly logService = new LogService();
  constructor(settings?: LogService) {
    this.logService.setShowTriggerNamesInLogs(settings?.isShowTriggerNamesInLogs() ?? false);
  }
  run(
    config: SimulationConfig,
    hooks?: SimulationRunHooks,
    maxBattlesPerOutcome?: number,
  ): SimulationResult {
    const result = this.engine.runSimulation(config, hooks);
    // Reduce the expensive formatted/structured-cloned result without starving
    // any winner filter when one outcome appears late in the simulation.
    const battles =
      result.battles && maxBattlesPerOutcome != null
        ? sampleBattlesByOutcome(result.battles, maxBattlesPerOutcome)
        : result.battles;
    return {
      ...result,
      ...(battles ? { battles: battles.map((battle) => ({
        ...battle,
        logs: this.formatEvents(battle.logs, config),
      })) } : {}),
    };
  }
  projectLineupAfterEndTurn(config: SimulationConfig, side: 'player' | 'opponent', lineup: (PetConfig | null)[]): (PetConfig | null)[] {
    return this.engine.projectLineupAfterEndTurn(config, side, lineup);
  }
  private formatEvents(events: BattleEvent[], config: SimulationConfig): Log[] {
    this.logService.reset();
    this.logService.setEnabled(true);
    this.logService.setDeferDecorations(true);
    for (const event of events) {
      this.logService.createLog({
        ...event,
        message: event.type === 'board' && !event.message ? displayBoard(event.board, config) : event.message,
        playerIsOpponent: event.side == null ? undefined : event.side === 'opponent',
        targetIsOpponent: event.targetSide == null ? undefined : event.targetSide === 'opponent',
        sourcePet: event.source ? displayPet(event.source) : undefined,
        targetPet: event.target ? displayPet(event.target) : undefined,
        // Keep snapshot events separate so their identities and board states remain meaningful.
        noCollapse: true,
      });
    }
    return this.logService.getLogs();
  }
}
