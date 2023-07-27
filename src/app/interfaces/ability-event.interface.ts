import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";

export interface AbilityEvent {
    priority: number;
    callback: (arg?: any) => void;
    callbackPet?: Pet;
    player?: Player;
}