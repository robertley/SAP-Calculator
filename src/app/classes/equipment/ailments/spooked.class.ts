import { Equipment, EquipmentClass } from "../../equipment.class";

export class Spooked extends Equipment {
    name = 'Spooked';
    equipmentClass: EquipmentClass = 'ailment-defense';
    power = -1;
    originalPower = -1;
}