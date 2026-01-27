import { Player } from '../classes/player.class';
import { Pet } from '../classes/pet.class';

export interface Log {
  message: string;
  type:
    | 'attack'
    | 'move'
    | 'board'
    | 'death'
    | 'ability'
    | 'equipment'
    | 'trumpets';
  player?: Player;
  sourcePet?: Pet;
  targetPet?: Pet;
  randomEvent?: boolean; // assumed false if undefined
  tiger?: boolean;
  puma?: boolean;
  pteranodon?: boolean;
  pantherMultiplier?: number;
  count?: number;
  bold?: boolean;
  rawMessage?: string;
  decorated?: boolean;
}
