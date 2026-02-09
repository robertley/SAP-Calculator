import { LogService } from 'app/integrations/log.service';
import { GameService } from 'app/runtime/state/game.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Player } from 'app/domain/entities/player.class';
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
    const playerToy = this.player.toy;
    const playerToyStart = playerToy?.startOfBattle;
    if (playerToy && playerToyStart) {
      this.toyService.setStartOfBattleEvent({
        callback: () => {
          playerToyStart.call(playerToy, this.gameService.gameApi);
          const toyLevel = playerToy.level;
          for (let pet of this.player.petArray) {
            if (pet instanceof Puma) {
              playerToy.level = pet.level;
              playerToyStart.call(playerToy, this.gameService.gameApi, true);
              playerToy.level = toyLevel;
            }
          }
        },
        priority: playerToy.tier,
        player: this.player,
      });
    }
    const opponentToy = this.opponent.toy;
    const opponentToyStart = opponentToy?.startOfBattle;
    if (opponentToy && opponentToyStart) {
      this.toyService.setStartOfBattleEvent({
        callback: () => {
          opponentToyStart.call(opponentToy, this.gameService.gameApi);
          const toyLevel = opponentToy.level;
          for (let pet of this.opponent.petArray) {
            if (pet instanceof Puma) {
              opponentToy.level = pet.level;
              opponentToyStart.call(
                opponentToy,
                this.gameService.gameApi,
                true,
              );
              opponentToy.level = toyLevel;
            }
          }
        },
        priority: opponentToy.tier,
        player: this.opponent,
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





