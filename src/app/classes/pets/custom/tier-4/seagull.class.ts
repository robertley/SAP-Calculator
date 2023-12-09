import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EquipmentService } from "../../../../services/equipment.service";
import { Garlic } from "../../../equipment/turtle/garlic.class";
import { MeatBone } from "../../../equipment/turtle/meat-bone.class";
import { Steak } from "../../../equipment/turtle/steak.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Honey } from "../../../equipment/turtle/honey.class";
import { Chili } from "../../../equipment/turtle/chili.class";
import { Mushroom } from "../../../equipment/turtle/mushroom.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Croissant } from "../../../equipment/puppy/croissant.class";
import { Rice } from "../../../equipment/puppy/rice.class";
import { Egg } from "../../../equipment/puppy/egg.class";
import { Pie } from "../../../equipment/puppy/pie.class";
import { Skewer } from "../../../equipment/puppy/skewer.class";
import { Lemon } from "../../../equipment/puppy/lemon.class";
import { Salt } from "../../../equipment/puppy/salt.class";
import { Pancakes } from "../../../equipment/puppy/pancakes.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Cucumber } from "../../../equipment/star/cucumber.class";
import { FortuneCookie } from "../../../equipment/custom/fortune-cookie.class";
import { Banana } from "../../../equipment/golden/banana.class";
import { Cherry } from "../../../equipment/golden/cherry.class";
import { ChocolateCake } from "../../../equipment/golden/chocolate-cake.class";
import { Durian } from "../../../equipment/golden/durian.class";
import { Eggplant } from "../../../equipment/golden/eggplant.class";
import { Onion } from "../../../equipment/golden/onion.class";
import { PitaBread } from "../../../equipment/golden/pita-bread.class";
import { Potato } from "../../../equipment/golden/potato.class";
import { Tomato } from "../../../equipment/golden/tomato.class";
import { Carrot } from "../../../equipment/star/carrot.class";
import { Cheese } from "../../../equipment/star/cheese.class";
import { Grapes } from "../../../equipment/star/grapes.class";
import { Pepper } from "../../../equipment/star/pepper.class";
import { Popcorn } from "../../../equipment/star/popcorn.class";
import { PetService } from "../../../../services/pet.service";
import { GameService } from "../../../../services/game.service";
import { Blueberry } from "../../../equipment/custom/blueberry.class";
import { Donut } from "../../../equipment/custom/donut.class";
import { Pineapple } from "../../../equipment/custom/pineapple.class";

export class Seagull extends Pet {
    name = "Seagull";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    abilityUses: number;
    friendSummoned(pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (this.equipment == null) { 
            return;
        }

        pet.givePetEquipment(this.getInstanceOfAllEquipment().get(this.equipment.name));
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} a ${this.equipment.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        this.superFriendSummoned(pet, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }

    // avoids circular dependency
    getInstanceOfAllEquipment() {
        let map: Map<string, Equipment> = new Map();
        map.set('Garlic', new Garlic());
        map.set('Meat Bone', new MeatBone());
        map.set('Steak', new Steak());
        map.set('Melon', new Melon())
        map.set('Honey', new Honey(this.logService, this.abilityService))
        map.set('Chili', new Chili(this.logService, this.abilityService))
        map.set('Mushroom', new Mushroom(this.logService, this.abilityService, this.petService));
        map.set('Coconut', new Coconut());
        map.set('Peanut', new Peanut());
        map.set('Croissant', new Croissant());
        map.set('Rice', new Rice());
        map.set('Egg', new Egg(this.logService, this.abilityService));
        map.set('Salt', new Salt());
        map.set('Pie', new Pie());
        map.set('Skewer', new Skewer(this.logService));
        map.set('Lemon', new Lemon());
        map.set('Pancakes', new Pancakes());
        map.set('Strawberry', new Strawberry());
        map.set('Cucumber', new Cucumber());
        map.set('Cheese', new Cheese());
        map.set('Grapes', new Grapes());
        map.set('Carrot', new Carrot());
        map.set('Pepper', new Pepper());
        map.set('Popcorn', new Popcorn(this.logService, this.abilityService, this.petService, this.gameService));
        map.set('Cherry', new Cherry());
        map.set('Chocolate Cake', new ChocolateCake(this.logService));
        map.set('Eggplant', new Eggplant(this.logService));
        map.set('Potato', new Potato());
        map.set('Banana', new Banana(this.logService, this.abilityService));
        map.set('Onion', new Onion(this.logService));
        map.set('Pita Bread', new PitaBread(this.logService));
        map.set('Tomato', new Tomato(this.logService, this.abilityService));
        map.set('Durian', new Durian(this.logService, this.abilityService));
        map.set('Fortune Cookie', new FortuneCookie());
        map.set('Blueberry', new Blueberry());
        map.set('Donut', new Donut());
        map.set('Pineapple', new Pineapple());

        return map;
    }
}