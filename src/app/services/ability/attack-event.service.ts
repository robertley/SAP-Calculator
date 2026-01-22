import { Injectable } from '@angular/core';
import { Pet } from '../../classes/pet.class';
import { AbilityQueueService } from './ability-queue.service';

@Injectable({
  providedIn: 'root',
})
export class AttackEventService {
  constructor(private abilityQueueService: AbilityQueueService) {}

  // --- Before Attack ---

  triggerBeforeAttackEvents(attackingPet: Pet) {
    const parent = attackingPet?.parent as any;
    const friends =
      parent && Array.isArray(parent.petArray) ? parent.petArray : [];

    for (let pet of friends) {
      if (pet.hasTrigger('BeforeFriendlyAttack')) {
        this.abilityQueueService.triggerAbility(
          pet,
          'BeforeFriendlyAttack',
          undefined,
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
          this.abilityQueueService.triggerAbility(pet, 'BeforeFriendAttacks');
        }
      }

      if (pet == attackingPet.petAhead || pet == attackingPet.petBehind()) {
        if (pet.hasTrigger('BeforeAdjacentFriendAttacked')) {
          // Wait, original code said 'BeforeAdjacentFriendAttacked' in triggerBeforeAttackEvent?
          // Line 393: if (pet.hasTrigger('BeforeAdjacentFriendAttacked'))
          // But the context is "Before ATTACK". 'BeforeAdjacentFriendAttacked' sounds wrong?
          // Let's assume the original code was correct in using that trigger name here,
          // maybe it implies "Before Adjacent Friend [initiates] Attack"?
          // Actually, looking at docs/code, usually it's "BeforeAdjacentFriendAttacks"?
          // The legacy code used 'BeforeAdjacentFriendAttacked'. I will preserve it.
          this.abilityQueueService.triggerAbility(
            pet,
            'BeforeAdjacentFriendAttacked',
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
          this.abilityQueueService.triggerAbility(pet, 'FriendAttacked');
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
          this.abilityQueueService.triggerAbility(pet, 'FriendAheadAttacked');
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
