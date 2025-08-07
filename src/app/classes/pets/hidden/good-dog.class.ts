import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment } from "../../equipment.class";
import { Blueberry } from "../../equipment/custom/blueberry.class";
import { Donut } from "../../equipment/custom/donut.class";
import { FortuneCookie } from "../../equipment/custom/fortune-cookie.class";
import { Pineapple } from "../../equipment/custom/pineapple.class";
import { Banana } from "../../equipment/golden/banana.class";
import { Cherry } from "../../equipment/golden/cherry.class";
import { ChocolateCake } from "../../equipment/golden/chocolate-cake.class";
import { Durian } from "../../equipment/golden/durian.class";
import { Eggplant } from "../../equipment/golden/eggplant.class";
import { Fig } from "../../equipment/golden/fig.class";
import { Onion } from "../../equipment/golden/onion.class";
import { PitaBread } from "../../equipment/golden/pita-bread.class";
import { Potato } from "../../equipment/golden/potato.class";
import { Tomato } from "../../equipment/golden/tomato.class";
import { Croissant } from "../../equipment/puppy/croissant.class";
import { Egg } from "../../equipment/puppy/egg.class";
import { Lime } from "../../equipment/puppy/lime.class";
import { Lemon } from "../../equipment/puppy/lemon.class";
import { Pancakes } from "../../equipment/puppy/pancakes.class";
import { Pie } from "../../equipment/puppy/pie.class";
import { Rice } from "../../equipment/puppy/rice.class";
import { Salt } from "../../equipment/puppy/salt.class";
import { Skewer } from "../../equipment/puppy/skewer.class";
import { Carrot } from "../../equipment/star/carrot.class";
import { Cheese } from "../../equipment/star/cheese.class";
import { Cucumber } from "../../equipment/star/cucumber.class";
import { Grapes } from "../../equipment/star/grapes.class";
import { Pepper } from "../../equipment/star/pepper.class";
import { Popcorn } from "../../equipment/star/popcorn.class";
import { Strawberry } from "../../equipment/star/strawberry.class";
import { Chili } from "../../equipment/turtle/chili.class";
import { Coconut } from "../../equipment/turtle/coconut.class";
import { Garlic } from "../../equipment/turtle/garlic.class";
import { Honey } from "../../equipment/turtle/honey.class";
import { MeatBone } from "../../equipment/turtle/meat-bone.class";
import { Melon } from "../../equipment/turtle/melon.class";
import { Mushroom } from "../../equipment/turtle/mushroom.class";
import { Peanut } from "../../equipment/turtle/peanut.class";
import { Steak } from "../../equipment/turtle/steak.class";
import { EasterEgg } from "../../equipment/unicorn/easter-egg.class";
import { FairyDust } from "../../equipment/unicorn/fairy-dust.class";
import { GingerbreadMan } from "../../equipment/unicorn/gingerbread-man.class";
import { GoldenEgg } from "../../equipment/unicorn/golden-egg.class";
import { HealthPotion } from "../../equipment/unicorn/health-potion.class";
import { LovePotion } from "../../equipment/unicorn/love-potion.class";
import { MagicBeans } from "../../equipment/unicorn/magic-beans.class";
import { Rambutan } from "../../equipment/unicorn/rambutan.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class GoodDog extends Pet {
    name = "Good Dog";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    hidden: boolean = true;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targets = this.parent.petArray;

        let equipmentMap = this.getInstanceOfAllEquipment();

        let equipmentArray = Array.from(equipmentMap.values());

        for (let pet of targets) {
            let equipment = equipmentArray[Math.floor(Math.random() * equipmentArray.length)];
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${equipment.name}`,
                type: "ability",
                player: this.parent,
                randomEvent: true,
            })
            pet.givePetEquipment(equipment);
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
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
        map.set('Lime', new Lime());
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
        map.set('Fig', new Fig());
        
        map.set('Rambutan', new Rambutan(this.logService));
        map.set('Love Potion', new LovePotion(this.logService));
        map.set('Fairy Dust', new FairyDust(this.logService));
        map.set('Gingerbread Man', new GingerbreadMan(this.logService));
        map.set('Easter Egg', new EasterEgg(this.logService, this.abilityService));
        map.set('Health Potion', new HealthPotion(this.logService));
        map.set('Magic Beans', new MagicBeans());
        map.set('Golden Egg', new GoldenEgg(this.logService, this.abilityService));

        
        return map;
    }
}