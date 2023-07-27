import { Equipment, EquipmentClass } from "../equipment.class";

export class MeatBone extends Equipment {
    name = 'Meat Bone';
    equipmentClass = 'attack' as EquipmentClass;
    power = 3;
}