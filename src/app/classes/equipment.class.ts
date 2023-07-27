export class Equipment {
    equipmentClass: EquipmentClass;
    name: string;
    power?: number;
    callback: () => void;

    constructor() {
    }
}

export type EquipmentClass = 'defense' | 'shield' | 'attack' | 'ailment' | 'faint';