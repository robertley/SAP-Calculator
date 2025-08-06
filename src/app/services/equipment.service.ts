import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/turtle/garlic.class";
import { MeatBone } from "../classes/equipment/turtle/meat-bone.class";
import { Steak } from "../classes/equipment/turtle/steak.class";
import { Melon } from "../classes/equipment/turtle/melon.class";
import { Honey } from "../classes/equipment/turtle/honey.class";
import { LogService } from "./log.service";
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
import { Strawberry } from "../classes/equipment/star/strawberry.class";
import { Cucumber } from "../classes/equipment/star/cucumber.class";
import { Cheese } from "../classes/equipment/star/cheese.class";
import { Grapes } from "../classes/equipment/star/grapes.class";
import { Pepper } from "../classes/equipment/star/pepper.class";
import { Carrot } from "../classes/equipment/star/carrot.class";
import { Popcorn } from "../classes/equipment/star/popcorn.class";
import { GameService } from "./game.service";
import { Cherry } from "../classes/equipment/golden/cherry.class";
import { ChocolateCake } from "../classes/equipment/golden/chocolate-cake.class";
import { Eggplant } from "../classes/equipment/golden/eggplant.class";
import { Potato } from "../classes/equipment/golden/potato.class";
import { Banana } from "../classes/equipment/golden/banana.class";
import { Onion } from "../classes/equipment/golden/onion.class";
import { PitaBread } from "../classes/equipment/golden/pita-bread.class";
import { Tomato } from "../classes/equipment/golden/tomato.class";
import { Durian } from "../classes/equipment/golden/durian.class";
import { FortuneCookie } from "../classes/equipment/custom/fortune-cookie.class";
import { Blueberry } from "../classes/equipment/custom/blueberry.class";
import { Donut } from "../classes/equipment/custom/donut.class";
import { Pineapple } from "../classes/equipment/custom/pineapple.class";
import { Fig } from "../classes/equipment/golden/fig.class";
import { Rambutan } from "../classes/equipment/unicorn/rambutan.class";
import { LovePotion } from "../classes/equipment/unicorn/love-potion.class";
import { FairyDust } from "../classes/equipment/unicorn/fairy-dust.class";
import { GingerbreadMan } from "../classes/equipment/unicorn/gingerbread-man.class";
import { EasterEgg } from "../classes/equipment/unicorn/easter-egg.class";
import { HealthPotion } from "../classes/equipment/unicorn/health-potion.class";
import { MagicBeans } from "../classes/equipment/unicorn/magic-beans.class";
import { GoldenEgg } from "../classes/equipment/unicorn/golden-egg.class";
import { Cold } from "../classes/equipment/ailments/cold.class";
import { Exposed } from "../classes/equipment/ailments/exposed.class";
import { Crisp } from "../classes/equipment/ailments/crisp.class";
import { Dazed } from "../classes/equipment/ailments/dazed.class";
import { Ink } from "../classes/equipment/ailments/ink.class";
import { Spooked } from "../classes/equipment/ailments/spooked.class";
import { Weak } from "../classes/equipment/ailments/weak.class";
import { YggdrasilFruit } from "../classes/equipment/unicorn/yggdrasil-fruit.class";
import { PeanutButter } from "../classes/equipment/hidden/peanut-butter";

@Injectable({
    providedIn: "root"
})
export class EquipmentService {

    constructor(private logService: LogService, private abilityService: AbilityService, private petService: PetService, private gameService: GameService) {}

    // Also update seagull !
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
        map.set('Peanut Butter', new PeanutButter());
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
        map.set('Chocolate Cake', new ChocolateCake(this.logService, this.abilityService));
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
        map.set('Fig', new Fig())

        map.set('Rambutan', new Rambutan(this.logService));
        map.set('Love Potion', new LovePotion(this.logService));
        map.set('Fairy Dust', new FairyDust(this.logService));
        map.set('Gingerbread Man', new GingerbreadMan(this.logService));
        map.set('Easter Egg', new EasterEgg(this.logService, this.abilityService));
        map.set('Health Potion', new HealthPotion(this.logService));
        map.set('Magic Beans', new MagicBeans());
        map.set('Golden Egg', new GoldenEgg(this.logService, this.abilityService));
        map.set('Yggdrasil Fruit', new YggdrasilFruit(this.logService, this.abilityService));

        return map;
    }

    getInstanceOfAllAilments() {
        let map = new Map();
        map.set('Cold', new Cold());
        map.set('Crisp', new Crisp());
        map.set('Dazed', new Dazed());
        map.set('Exposed', new Exposed());
        map.set('Ink', new Ink());
        map.set('Spooked', new Spooked());
        map.set('Weak', new Weak());

        return map;
    }

    

}