import { Injectable } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
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
          'Faint',
          faintedPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendFaints',
          faintedPet,
        );
      }
      // Check for FriendAheadFainted (pet ahead of the dying pet)
      if (pet == faintedPet.petBehind(null, true)) {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendAheadFainted',
          faintedPet,
        );
      }
      // Check for AdjacentFriendsFaint
      if (
        pet == faintedPet.petBehind(null, true) ||
        pet.petBehind(null, true) == faintedPet
      ) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AdjacentFriendsFaint',
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

    // Trigger PostRemovalFaint/PetFainted for the fainted pet explicitly (it may already be removed from the team list)
    this.abilityQueueService.triggerAbility(
      faintedPet,
      'PetFainted',
      faintedPet,
    );
    this.abilityQueueService.triggerAbility(
      faintedPet,
      'PostRemovalFaint',
      faintedPet,
    );

    // Check friends (remaining team)
    const team = this.abilityQueueService.getTeam(faintedPet);
    for (let pet of team) {
      this.abilityQueueService.triggerAbility(pet, 'PetFainted', faintedPet);
      this.abilityQueueService.triggerAbility(pet, 'PostRemovalFriendFaints', faintedPet);
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        faintedPet,
        undefined,
        this.abilityQueueService.getNumberedTriggersForPet(pet, 'PostRemovalFriendFaints'),
      );
    }

    // Check enemies
    const enemyTeam = this.abilityQueueService
      .getTeam(faintedPet.parent?.opponent)
      .filter((p) => p.alive);
    for (let pet of enemyTeam) {
      this.abilityQueueService.triggerAbility(pet, 'EnemyFainted', faintedPet);
      this.abilityQueueService.triggerAbility(pet, 'EnemyFaint', faintedPet);
      this.abilityQueueService.triggerAbility(pet, 'PetFainted', faintedPet);
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



