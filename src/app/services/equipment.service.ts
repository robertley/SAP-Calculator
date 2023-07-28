import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/garlic.class";
import { MeatBone } from "../classes/equipment/meat-bone.class";
import { Steak } from "../classes/equipment/steak.class";
import { Melon } from "../classes/equipment/melon.class";
import { Honey } from "../classes/equipment/honey.class";
import { LogService } from "./log.servicee";
import { Chili } from "../classes/equipment/chili.class";
import { Mushroom } from "../classes/equipment/mushroom.class";
import { Coconut } from "../classes/equipment/coconut.class";
import { Peanut } from "../classes/equipment/peanut.class";
import { AbilityService } from "./ability.service";
import { PetService } from "./pet.service";

@Injectable({
    providedIn: "root"
})
export class EquipmentService {

    constructor(private logService: LogService, private abilityService: AbilityService, private petService: PetService) {}

    getInstanceOfAllEquipment() {
        let map: Map<string, Equipment> = new Map();
        map.set('Garlic', new Garlic());
        map.set('Meat Bone', new MeatBone());
        map.set('Steak', new Steak());
        map.set('Melon', new Melon())
        map.set('Honey', new Honey(this.logService, this.abilityService))
        map.set('Chili', new Chili(this.logService))
        map.set('Mushroom', new Mushroom(this.logService, this.abilityService, this.petService));
        map.set('Coconut', new Coconut());
        map.set('Peanut', new Peanut());
        return map;
    }
}