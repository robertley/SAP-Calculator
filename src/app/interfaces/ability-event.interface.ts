import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";

export interface AbilityEvent {
    priority: number;
    callback: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void | boolean;
    callbackPet?: Pet;
    player?: Player;
    level?: number;
    pet?: Pet;
    abilityType?: string; // Track which ability type this event belongs to
    tieBreaker?: number; // Random number for tie breaking
}