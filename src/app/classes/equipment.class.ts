import { Pet } from "./pet.class";

export class Equipment {
    equipmentClass: EquipmentClass;
    name: string;
    power?: number;
    uses?: number;
    originalUses?: number;
    callback: (pet: Pet) => void;
    attackCallback?: (pet: Pet, attackedPet: Pet) => void;

    constructor() {
    }

    reset() {
        this.uses = this.originalUses;
    }
}

export type EquipmentClass = 
    'shop' | 'defense' | 'shield' | 'attack' | 'ailment-defense' | 'ailment-attack' | 'faint' 
    | 'skewer' | 'snipe' | 'beforeStartOfBattle' | 'beforeAttack' | 'startOfBattle' | 'shield-snipe' | 'hurt';