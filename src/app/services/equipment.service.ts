import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/garlic.class";
import { MeatBone } from "../classes/equipment/meat-bone.class";
import { Steak } from "../classes/equipment/steak.class";
import { Melon } from "../classes/equipment/melon.class";
import { Honey } from "../classes/equipment/honey.class";
import { LogService } from "./log.servicee";
import { FaintService } from "./faint.service";
import { SummonedService } from "./summoned.service";
import { Chili } from "../classes/equipment/chili.class";
import { Mushroom } from "../classes/equipment/mushroom.class";
import { Coconut } from "../classes/equipment/coconut.class";
import { Peanut } from "../classes/equipment/peanut.class";

@Injectable({
    providedIn: "root"
})
export class EquipmentService {

    constructor(private logService: LogService, private faintService: FaintService, private summonedService: SummonedService) {}

    getInstanceOfAllEquipment() {
        let map: Map<string, Equipment> = new Map();
        map.set('Garlic', new Garlic());
        map.set('Meat Bone', new MeatBone());
        map.set('Steak', new Steak());
        map.set('Melon', new Melon())
        map.set('Honey', new Honey(this.logService, this.faintService, this.summonedService))
        map.set('Chili', new Chili(this.logService))
        map.set('Mushroom', new Mushroom(this.logService, this.faintService, this.summonedService));
        map.set('Coconut', new Coconut());
        map.set('Peanut', new Peanut());
        return map;
    }
}