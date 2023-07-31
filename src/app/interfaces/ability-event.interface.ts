import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";

export interface AbilityEvent {
    priority: number;
    callback: (arg0?: any, arg1?: any, arg2?: any) => void;
    callbackPet?: Pet;
    player?: Player;
}