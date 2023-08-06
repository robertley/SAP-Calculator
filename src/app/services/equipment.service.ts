import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/turtle/garlic.class";
import { MeatBone } from "../classes/equipment/turtle/meat-bone.class";
import { Steak } from "../classes/equipment/turtle/steak.class";
import { Melon } from "../classes/equipment/turtle/melon.class";
import { Honey } from "../classes/equipment/turtle/honey.class";
import { LogService } from "./log.servicee";
import { Chili } from "../classes/equipment/turtle/chili.class";
import { Mushroom } from "../classes/equipment/turtle/mushroom.class";
import { Coconut } from "../classes/equipment/turtle/coconut.class";
import { Peanut } from "../classes/equipment/turtle/peanut.class";
import { AbilityService } from "./ability.service";
import { PetService } from "./pet.service";
import { Croissant } from "../classes/equipment/puppy/croissant.class";
import { Rice } from "../classes/equipment/puppy/rice.class";
import { Egg } from "../classes/equipment/puppy/egg.class";
import { Salt } from "../classes/equipment/puppy/salt.class";
import { Pie } from "../classes/equipment/puppy/pie.class";
import { Skewer } from "../classes/equipment/puppy/skewer.class";
import { Lemon } from "../classes/equipment/puppy/lemon.class";
import { Pancakes } from "../classes/equipment/puppy/pancakes.class";

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
        map.set('Croissant', new Croissant());
        map.set('Rice', new Rice());
        map.set('Egg', new Egg(this.logService));
        map.set('Salt', new Salt());
        map.set('Pie', new Pie());
        map.set('Skewer', new Skewer(this.logService));
        map.set('Lemon', new Lemon());
        map.set('Pancakes', new Pancakes());
        return map;
    }

}