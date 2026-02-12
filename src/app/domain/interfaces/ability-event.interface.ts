import {
  AbilityCustomParams,
  AbilityTrigger,
} from 'app/domain/entities/ability.class';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';

export type AbilityEventCallback = {
  bivarianceHack(...args: unknown[]): void | boolean;
}['bivarianceHack'];

export interface AbilityEvent {
  priority: number;
  callback?: AbilityEventCallback;
  player?: Player;
  level?: number;
  pet?: Pet;
  triggerPet?: Pet; // Pet that triggered this ability (e.g., the pet that fainted)
  abilityType?: AbilityTrigger; // Track which ability type this event belongs to
  tieBreaker?: number; // Random number for tie breaking
  customParams?: AbilityCustomParams; // Custom parameters to pass through context
}

