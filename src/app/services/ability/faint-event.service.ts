import { Injectable } from '@angular/core';
import { Pet } from '../../classes/pet.class';
import { AbilityQueueService } from './ability-queue.service';
import { ToyEventService } from './toy-event.service';

@Injectable({
  providedIn: 'root',
})
export class FaintEventService {
  constructor(
    private abilityQueueService: AbilityQueueService,
    private toyEventService: ToyEventService,
  ) {}

  triggerFaintEvents(faintedPet: Pet) {
    // Check friends
    const team = this.abilityQueueService.getTeam(faintedPet);
    for (let pet of team) {
      if (pet == faintedPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'BeforeThisDies',
          faintedPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'KitsuneFriendDies',
          faintedPet,
        );
      }
      // Check for FriendAheadDied (pet ahead of the dying pet)
      if (pet == faintedPet.petBehind(null, true)) {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendAheadDied',
          faintedPet,
        );
      }
      // Check for AdjacentFriendsDie
      if (
        pet == faintedPet.petBehind(null, true) ||
        pet.petBehind(null, true) == faintedPet
      ) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AdjacentFriendsDie',
          faintedPet,
        );
      }
    }
  }

  triggerAfterFaintEvents(faintedPet: Pet) {
    // Trigger toy events for friend faints
    // We rely on ToyEventService injected here.
    // Note: AbilityService passes player and pet. faintedPet.parent is player.
    // Assuming faintedPet.parent is set correctly.
    if (faintedPet.parent) {
      this.toyEventService.triggerFriendFaintsToyEvents(
        faintedPet.parent,
        faintedPet,
      );
    }

    // Trigger ThisDied/PetDied for the fainted pet explicitly (it may already be removed from the team list)
    this.abilityQueueService.triggerAbility(
      faintedPet,
      'PetDied',
      faintedPet,
    );
    this.abilityQueueService.triggerAbility(
      faintedPet,
      'ThisDied',
      faintedPet,
    );

    // Check friends (remaining team)
    const team = this.abilityQueueService.getTeam(faintedPet);
    for (let pet of team) {
      this.abilityQueueService.triggerAbility(pet, 'PetDied', faintedPet);
      this.abilityQueueService.triggerAbility(pet, 'FriendDied', faintedPet);
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        faintedPet,
        undefined,
        this.abilityQueueService.getNumberedTriggersForPet(pet, 'FriendDied'),
      );
    }

    // Check enemies
    const enemyTeam = this.abilityQueueService
      .getTeam(faintedPet.parent?.opponent)
      .filter((p) => p.alive);
    for (let pet of enemyTeam) {
      this.abilityQueueService.triggerAbility(pet, 'EnemyDied', faintedPet);
      this.abilityQueueService.triggerAbility(pet, 'PetDied', faintedPet);
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        faintedPet,
        undefined,
        this.abilityQueueService.getNumberedTriggersForPet(pet, 'EnemyFaint'),
      );
    }

    this.toyEventService.executeFriendFaintsToyEvents();
  }
}
