import { Injectable } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import { AbilityQueueService } from './ability-queue.service';

@Injectable({
  providedIn: 'root',
})
export class AttackEventService {
  constructor(private abilityQueueService: AbilityQueueService) {}

  // --- Before Attack ---

  triggerBeforeAttackEvents(attackingPet: Pet) {
    const parent = attackingPet?.parent;
    const friends =
      parent && Array.isArray(parent.petArray) ? parent.petArray : [];

    for (let pet of friends) {
      if (pet.hasTrigger('BeforeFriendlyAttack')) {
        this.abilityQueueService.triggerAbility(
          pet,
          'BeforeFriendlyAttack',
          attackingPet,
          undefined,
        );
        // Note: Legacy passed priority=pet.attack.
        // In new system, triggerAbility delegates to addEventToQueue which uses getPetEventPriority(pet) (includes attack) by default.
        // However, ability.service.ts triggerBeforeAttackEvent passed 'undefined' as triggerPet?
        // Let's check: enqueueAbilityEvent(queue, pet, 'BeforeFriendlyAttack', undefined, pet.attack);
        // The priority argument (pet.attack) overrides default priority in createAbilityEvent.
        // But getPetEventPriority *defaults* to pet.attack (+/- food).
        // So relying on triggerAbility's default priority logic (which uses getPetEventPriority) is correct/consistent.
      }

      if (pet == attackingPet) {
        if (pet.hasTrigger('BeforeThisAttacks')) {
          this.abilityQueueService.triggerAbility(pet, 'BeforeThisAttacks');
        }
        if (pet.hasTrigger('BeforeFirstAttack')) {
          this.abilityQueueService.triggerAbility(pet, 'BeforeFirstAttack');
        }
      } else {
        if (pet.hasTrigger('BeforeFriendAttacks')) {
          this.abilityQueueService.triggerAbility(
            pet,
            'BeforeFriendAttacks',
            attackingPet,
          );
        }
      }

      if (pet == attackingPet.petAhead || pet == attackingPet.petBehind()) {
        if (pet.hasTrigger('BeforeAdjacentFriendAttacked')) {
          this.abilityQueueService.triggerAbility(
            pet,
            'BeforeAdjacentFriendAttacked',
            attackingPet,
          );
        }
      }
    }
  }

  // --- After Attack ---

  triggerAfterAttackEvents(attackingPet: Pet) {
    if (!attackingPet) {
      return;
    }

    const team = this.abilityQueueService.getTeam(attackingPet);

    for (let pet of team) {
      // Numbered counters
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        undefined,
        undefined,
        this.abilityQueueService.getNumberedTriggersForPet(
          pet,
          'FriendlyAttacked',
        ),
      );

      if (pet.hasTrigger('FriendlyAttacked')) {
        this.abilityQueueService.triggerAbility(pet, 'FriendlyAttacked');
      }
      if (pet.hasTrigger('AnyoneAttack')) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyoneAttack',
          attackingPet,
        );
      }

      if (pet == attackingPet) {
        if (pet.hasTrigger('ThisAttacked')) {
          this.abilityQueueService.triggerAbility(pet, 'ThisAttacked');
        }
        if (pet.hasTrigger('ThisFirstAttack')) {
          this.abilityQueueService.triggerAbility(pet, 'ThisFirstAttack');
        }
      } else {
        if (pet.hasTrigger('FriendAttacked')) {
          // "FriendAttacked" = Friend Attacked (Active voice)
          this.abilityQueueService.triggerAbility(
            pet,
            'FriendAttacked',
            attackingPet,
          );
        }
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          undefined,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(
            pet,
            'FriendAttacked',
          ),
        );
      }

      if (pet == attackingPet.petAhead || pet == attackingPet.petBehind()) {
        if (pet.hasTrigger('AdjacentFriendAttacked')) {
          this.abilityQueueService.triggerAbility(
            pet,
            'AdjacentFriendAttacked',
            attackingPet,
          );
        }
      }
      if (pet == attackingPet.petBehind(null, true)) {
        if (pet.hasTrigger('FriendAheadAttacked')) {
          this.abilityQueueService.triggerAbility(
            pet,
            'FriendAheadAttacked',
            attackingPet,
          );
        }
      }
    }

    const opponentTeam = this.abilityQueueService.getTeam(
      attackingPet.parent?.opponent,
    );
    if (!opponentTeam.length) {
      return;
    }
    for (let pet of opponentTeam) {
      if (pet.hasTrigger('AnyoneAttack')) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyoneAttack',
          attackingPet,
        );
      }
      if (pet.hasTrigger('EnemyAttacked')) {
        // "EnemyAttacked" = Enemy [has] Attacked
        this.abilityQueueService.triggerAbility(pet, 'EnemyAttacked');
      }
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        undefined,
        undefined,
        this.abilityQueueService.getNumberedTriggersForPet(
          pet,
          'EnemyAttacked',
        ),
      );
    }
  }
}

