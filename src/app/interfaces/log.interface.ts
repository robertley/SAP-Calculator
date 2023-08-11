import { Player } from "../classes/player.class";

export interface Log {
    message: string;
    type: 'attack' | 'move' | 'board' | 'death' | 'ability' | 'equipment' | 'trumpets',
    player?: Player;
    randomEvent?: boolean; // assumed false if undefined
    tiger?: boolean;
    puma?: boolean;
    pteranodon?: boolean;
    pantherMultiplier?: number;
}