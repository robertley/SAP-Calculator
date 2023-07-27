import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/garlic.class";
import { MeatBone } from "../classes/equipment/meat-bone.class";

@Injectable({
    providedIn: "root"
})
export class EquipmentService {

    constructor() {}

    getInstanceOfAllEquipment() {
        let map: Map<string, Equipment> = new Map();
        map.set('Garlic', new Garlic());
        map.set('Meat Bone', new MeatBone());

        return map;
    }
}