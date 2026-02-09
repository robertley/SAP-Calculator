import { Pet } from 'app/domain/entities/pet.class';
import { AbilityQueueService } from './ability-queue.service';

export function triggerFoodEvents(
  abilityQueueService: AbilityQueueService,
  eatingPet: Pet,
  foodType?: string,
): void {
  for (const pet of abilityQueueService.getTeam(eatingPet)) {
    abilityQueueService.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
    abilityQueueService.triggerAbility(pet, 'FoodEatenByFriendly', eatingPet);
    if (pet == eatingPet) {
      abilityQueueService.triggerAbility(pet, 'FoodEatenByThis', eatingPet);
      if (foodType === 'apple') {
        abilityQueueService.triggerAbility(pet, 'AppleEatenByThis', eatingPet);
        abilityQueueService.handleNumberedCounterTriggers(
          pet,
          eatingPet,
          undefined,
          abilityQueueService.getNumberedTriggersForPet(pet, 'AppleEatenByThis'),
        );
      } else if (foodType === 'corn') {
        abilityQueueService.triggerAbility(pet, 'CornEatenByThis', eatingPet);
      }
      abilityQueueService.handleNumberedCounterTriggers(
        pet,
        eatingPet,
        undefined,
        abilityQueueService.getNumberedTriggersForPet(pet, 'Eat'),
      );
    } else {
      abilityQueueService.triggerAbility(pet, 'FoodEatenByFriend', eatingPet);
      if (foodType === 'corn') {
        abilityQueueService.triggerAbility(pet, 'CornEatenByFriend', eatingPet);
      }
    }
  }

  for (const pet of abilityQueueService.getTeam(eatingPet.parent?.opponent)) {
    abilityQueueService.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
  }
}

export function triggerPerkGainEvents(
  abilityQueueService: AbilityQueueService,
  perkPet: Pet,
  perkType?: string,
): void {
  for (const pet of abilityQueueService.getTeam(perkPet)) {
    abilityQueueService.triggerAbility(pet, 'FriendlyGainsPerk', perkPet);
    if (perkType === 'Strawberry') {
      abilityQueueService.triggerAbility(pet, 'FriendlyGainedStrawberry', perkPet);
    }
    if (pet == perkPet) {
      abilityQueueService.triggerAbility(pet, 'ThisGainedPerk', perkPet);
      if (perkType === 'Strawberry') {
        abilityQueueService.triggerAbility(pet, 'ThisGainedStrawberry', perkPet);
      }
    } else {
      abilityQueueService.triggerAbility(pet, 'FriendGainsPerk', perkPet);
      if (perkType === 'Strawberry') {
        abilityQueueService.triggerAbility(pet, 'FriendGainedStrawberry', perkPet);
      }
    }
  }
}

export function triggerPerkLossEvents(
  abilityQueueService: AbilityQueueService,
  perkPet: Pet,
  perkType?: string,
): void {
  for (const pet of abilityQueueService.getTeam(perkPet)) {
    abilityQueueService.triggerAbility(pet, 'PetLostPerk', perkPet);
    if (perkType === 'strawberry') {
      abilityQueueService.triggerAbility(pet, 'LostStrawberry', perkPet);
    }
    if (pet == perkPet) {
      abilityQueueService.triggerAbility(pet, 'ThisLostPerk', perkPet);
    } else {
      abilityQueueService.triggerAbility(pet, 'FriendLostPerk', perkPet);
      if (perkType === 'strawberry') {
        abilityQueueService.triggerAbility(pet, 'FriendLostStrawberry', perkPet);
      }
    }
  }

  for (const pet of abilityQueueService.getTeam(perkPet.parent?.opponent)) {
    abilityQueueService.triggerAbility(pet, 'PetLostPerk', perkPet);
  }
}

export function triggerAilmentGainEvents(
  abilityQueueService: AbilityQueueService,
  ailmentPet: Pet,
  ailmentType?: string,
): void {
  for (const pet of abilityQueueService.getTeam(ailmentPet)) {
    abilityQueueService.triggerAbility(pet, 'AnyoneGainedAilment', ailmentPet);
    if (pet == ailmentPet) {
      abilityQueueService.triggerAbility(pet, 'ThisGainedAilment', ailmentPet);
    } else {
      abilityQueueService.triggerAbility(pet, 'FriendGainsAilment', ailmentPet);
    }
    if (ailmentType === 'weak') {
      abilityQueueService.triggerAbility(pet, 'AnyoneGainedWeak', ailmentPet);
    }
  }

  for (const pet of abilityQueueService.getTeam(ailmentPet.parent?.opponent)) {
    abilityQueueService.triggerAbility(pet, 'EnemyGainedAilment', ailmentPet);
    abilityQueueService.triggerAbility(pet, 'AnyoneGainedAilment', ailmentPet);
    if (ailmentType === 'weak') {
      abilityQueueService.triggerAbility(pet, 'AnyoneGainedWeak', ailmentPet);
    }
  }
}
