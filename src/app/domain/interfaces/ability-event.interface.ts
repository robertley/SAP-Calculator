import { AbilityTrigger } from 'app/domain/entities/ability.class';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';

export interface AbilityEvent {
  priority: number;
  callback?: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void | boolean;
  player?: Player;
  level?: number;
  pet?: Pet;
  triggerPet?: Pet; // Pet that triggered this ability (e.g., the pet that fainted)
  abilityType?: AbilityTrigger; // Track which ability type this event belongs to
  tieBreaker?: number; // Random number for tie breaking
  customParams?: any; // Custom parameters to pass through context
}

