import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';

export type RandomEventReason = 'deterministic' | 'tie-broken' | 'true-random';

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
  targetIsOpponent?: boolean;
  randomEvent?: boolean; // assumed false if undefined
  randomEventReason?: RandomEventReason;
  tiger?: boolean;
  puma?: boolean;
  pteranodon?: boolean;
  pantherMultiplier?: number;
  count?: number;
  bold?: boolean;
  rawMessage?: string;
  decorated?: boolean;
}

