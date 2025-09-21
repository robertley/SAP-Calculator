import { AbilityTrigger} from "app/classes/ability.class";
import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";

export interface AbilityEvent {
    priority: number;
    callback: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void | boolean;
    player?: Player;
    level?: number;
    pet?: Pet;
    triggerPet?: Pet; // Pet that triggered this ability (e.g., the pet that fainted)
    abilityType?: AbilityTrigger; // Track which ability type this event belongs to
    tieBreaker?: number; // Random number for tie breaking
}