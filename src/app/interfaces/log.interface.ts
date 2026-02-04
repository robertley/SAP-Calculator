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
  playerIsOpponent?: boolean;
  sourcePet?: Pet;
  targetPet?: Pet;
  sourceIndex?: number;
  targetIndex?: number;
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
