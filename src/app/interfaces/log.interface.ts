import { Player } from "../classes/player.class";

export interface Log {
    message: string;
    type: 'attack' | 'move' | 'board' | 'death' | 'ability',
    player?: Player;
    randomEvent?: boolean; // assumed false if undefined
}