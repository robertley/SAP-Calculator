import { LogService } from 'app/integrations/log.service';
import { GameService } from 'app/runtime/state/game.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Player } from 'app/domain/entities/player.class';
import { Toy } from 'app/domain/entities/toy.class';
import { Puma } from 'app/domain/entities/catalog/pets/puppy/tier-6/puma.class';

export class AbilityEngine {
  constructor(
    private logService: LogService,
    private gameService: GameService,
    private abilityService: AbilityService,
    private toyService: ToyService,
    private player: Player,
    private opponent: Player,
  ) {}

  applyPreBattleFriendDeathCounts() {
    const teams = [this.player, this.opponent];
    for (const team of teams) {
      for (const pet of team.petArray) {
        if (pet?.friendsDiedBeforeBattle) {
          this.abilityService.simulatePostRemovalFriendFaintsCounters(
            pet,
            pet.friendsDiedBeforeBattle,
          );
        }
      }
    }
  }

  abilityCycle() {
    this.emptyFrontSpaceCheck();
    let processedEvents = 0;
    const maxEventsPerCycle = 100000;
    while (true) {
      while (this.abilityService.hasGlobalEvents) {
        const nextEvent = this.abilityService.peekNextHighestPriorityEvent();

        if (
          nextEvent &&
          this.abilityService.getPriorityNumber(nextEvent.abilityType) >= 27
        ) {
          this.checkPetsAlive();
          const petsWereRemoved = this.removeDeadPets();

          if (petsWereRemoved) {
            this.resetClearFrontFlags();
            this.emptyFrontSpaceCheck();
            continue;
          }
        }

        const event = this.abilityService.getNextHighestPriorityEvent();
        if (event) {
          processedEvents++;
          if (processedEvents > maxEventsPerCycle) {
            const queue = this.abilityService
              .getQueueSnapshot()
              .map((evt) => evt.abilityType ?? 'unknown');
            const queueCounts = new Map<string, number>();
            for (const type of queue) {
              queueCounts.set(type, (queueCounts.get(type) ?? 0) + 1);
            }
            const summary = Array.from(queueCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([type, count]) => `${type}:${count}`)
              .join(', ');
            throw new Error(
              `Ability cycle overflow: processed>${maxEventsPerCycle}. Last=${event.abilityType ?? 'unknown'}. QueueLen=${queue.length}. Top=[${summary}]`,
            );
          }
          this.abilityService.executeEventCallback(event);
          this.checkPetsAlive();
        } else {
          console.error(
            'AbilityCycle: Expected event from queue but got null. Queue state inconsistent.',
          );
          break;
        }
      }

      const petRemoved = this.removeDeadPets();
      if (petRemoved) {
        this.resetClearFrontFlags();
        this.emptyFrontSpaceCheck();
      }

      if (!this.abilityService.hasGlobalEvents) {
        this.player.checkGoldenSpawn();
        this.opponent.checkGoldenSpawn();
        break;
      }
    }
  }

  checkPetsAlive() {
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
  }

  removeDeadPets() {
    let petRemoved = false;
    petRemoved = this.player.removeDeadPets();
    petRemoved = this.opponent.removeDeadPets() || petRemoved;
    return petRemoved;
  }

  emptyFrontSpaceCheck() {
    if (this.player.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.player);
    } else {
      for (const pet of this.player.petArray) {
        pet.clearFrontTriggered = false;
      }
    }
    if (this.opponent.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.opponent);
    } else {
      for (const pet of this.opponent.petArray) {
        pet.clearFrontTriggered = false;
      }
    }
    if (this.player.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceToyEvents(this.player);
    }
    if (this.opponent.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceToyEvents(this.opponent);
    }
    this.abilityService.executeEmptyFrontSpaceToyEvents();
  }

  initToys() {
    this.registerStartOfBattleToyEvents(this.player);
    this.registerStartOfBattleToyEvents(this.opponent);
  }

  private getActiveToys(player: Player): Toy[] {
    const activeToys: Toy[] = [];
    if (player.toy) {
      activeToys.push(player.toy);
    }
    if (player.hardToy) {
      activeToys.push(player.hardToy);
    }
    return activeToys;
  }

  private registerStartOfBattleToyEvents(player: Player): void {
    const toys = this.getActiveToys(player);
    for (const toy of toys) {
      const startOfBattle = toy.startOfBattle;
      if (!startOfBattle) {
        continue;
      }

      this.toyService.setStartOfBattleEvent({
        callback: () => {
          startOfBattle.call(toy, this.gameService.gameApi);
          const toyLevel = toy.level;
          for (const pet of player.petArray) {
            if (pet instanceof Puma) {
              toy.level = pet.level;
              startOfBattle.call(toy, this.gameService.gameApi, true);
              toy.level = toyLevel;
            }
          }
        },
        priority: toy.tier,
        player,
        customParams: {
          toyName: toy.name,
          suppressFriendFaintLog: toy.suppressFriendFaintLog,
        },
      });
    }
  }

  initializeEquipmentMultipliers() {
    for (let pet of this.player.petArray) {
      if (pet.equipment) {
        pet.setEquipmentMultiplier();
      }
    }

    for (let pet of this.opponent.petArray) {
      if (pet.equipment) {
        pet.setEquipmentMultiplier();
      }
    }
  }

  resetClearFrontFlags() {
    for (const pet of this.player.petArray) {
      pet.clearFrontTriggered = false;
    }
    for (const pet of this.opponent.petArray) {
      pet.clearFrontTriggered = false;
    }
  }
}





