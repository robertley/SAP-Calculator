import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/turtle/garlic.class";
import { Cake } from "../classes/equipment/custom/cake.class";
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
import { InjectorService } from "./injector.service";
import { PetService } from "./pet.service";
import { Blackberry } from "../classes/equipment/puppy/blackberry.class";
import { Croissant } from "../classes/equipment/puppy/croissant.class";
import { Rice } from "../classes/equipment/puppy/rice.class";
import { Egg } from "../classes/equipment/puppy/egg.class";
import { Eucalyptus } from '../classes/equipment/puppy/eucalyptus.class';
import { Lime } from "../classes/equipment/puppy/lime.class";
import { Squash } from "../classes/equipment/puppy/squash.class";
import { Salt } from "../classes/equipment/puppy/salt.class";
import { Pie } from "../classes/equipment/puppy/pie.class";
import { Skewer } from "../classes/equipment/puppy/skewer.class";
import { Lemon } from "../classes/equipment/puppy/lemon.class";
import { Pancakes } from "../classes/equipment/puppy/pancakes.class";
import { Strawberry } from "../classes/equipment/star/strawberry.class";
import { Baguette } from "../classes/equipment/star/baguette.class";
import { Cucumber } from "../classes/equipment/star/cucumber.class";
import { Cheese } from "../classes/equipment/star/cheese.class";
import { Grapes } from "../classes/equipment/star/grapes.class";
import { Pepper } from "../classes/equipment/star/pepper.class";
import { Carrot } from "../classes/equipment/star/carrot.class";
import { Popcorn } from "../classes/equipment/star/popcorn.class";
import { GameService } from "./game.service";
import { Cherry } from "../classes/equipment/golden/cherry.class";
import { BokChoy } from "../classes/equipment/golden/bok-choy.class";
import { ChocolateCake } from "../classes/equipment/golden/chocolate-cake.class";
import { CodRoe } from "../classes/equipment/danger/cod-roe.class";
import { Eggplant } from "../classes/equipment/golden/eggplant.class";
import { Potato } from "../classes/equipment/golden/potato.class";
import { Banana } from "../classes/equipment/golden/banana.class";
import { Onion } from "../classes/equipment/golden/onion.class";
import { PitaBread } from "../classes/equipment/golden/pita-bread.class";
import { Tomato } from "../classes/equipment/golden/tomato.class";
import { SudduthTomato } from "../classes/equipment/danger/sudduth-tomato.class";
import { Unagi } from "../classes/equipment/custom/unagi.class";
import { Durian } from "../classes/equipment/golden/durian.class";
import { GrosMichelBanana } from "../classes/equipment/danger/gros-michel-banana.class";
import { Seaweed } from "../classes/equipment/star/seaweed.class";
import { FortuneCookie } from "../classes/equipment/custom/fortune-cookie.class";
import { Blueberry } from "../classes/equipment/custom/blueberry.class";
import { Donut } from "../classes/equipment/custom/donut.class";
import { CashewNut } from "../classes/equipment/custom/cashew-nut.class";
import { Nachos } from "../classes/equipment/custom/nachos.class";
import { Pumpkin } from "../classes/equipment/custom/pumpkin.class";
import { Kiwifruit } from "../classes/equipment/custom/kiwifruit.class";
import { Pineapple } from "../classes/equipment/custom/pineapple.class";
import { Fig } from "../classes/equipment/golden/fig.class";
import { Caramel } from "../classes/equipment/star/caramel.class";
import { Rambutan } from "../classes/equipment/unicorn/rambutan.class";
import { LovePotion } from "../classes/equipment/unicorn/love-potion.class";
import { FairyDust } from "../classes/equipment/unicorn/fairy-dust.class";
import { GingerbreadMan } from "../classes/equipment/unicorn/gingerbread-man.class";
import { EasterEgg } from "../classes/equipment/unicorn/easter-egg.class";
import { HealthPotion } from "../classes/equipment/unicorn/health-potion.class";
import { MagicBeans } from "../classes/equipment/unicorn/magic-beans.class";
import { GoldenEgg } from "../classes/equipment/unicorn/golden-egg.class";
import { Cold } from "../classes/equipment/ailments/cold.class";
import { Icky } from "../classes/equipment/ailments/icky.class";
import { Crisp } from "../classes/equipment/ailments/crisp.class";
import { Dazed } from "../classes/equipment/ailments/dazed.class";
import { Ink } from "../classes/equipment/ailments/ink.class";
import { Spooked } from "../classes/equipment/ailments/spooked.class";
import { Weak } from "../classes/equipment/ailments/weak.class";
import { Tasty } from "../classes/equipment/ailments/tasty.class";
import { YggdrasilFruit } from "../classes/equipment/unicorn/yggdrasil-fruit.class";
import { HoneydewMelon } from "../classes/equipment/golden/honeydew-melon.class";
import { MapleSyrup, MapleSyrupAttack } from "../classes/equipment/golden/maple-syrup.class";
import { CocoaBean } from "../classes/equipment/danger/cocoa-bean.class";
import { WhiteOkra } from "../classes/equipment/danger/white-okra.class";
import { WhiteTruffle } from "../classes/equipment/danger/white-truffle.class";
import { PeanutButter } from "../classes/equipment/hidden/peanut-butter";
import { CakeSlice } from "../classes/equipment/hidden/cake-slice.class";
import { Ambrosia } from "../classes/equipment/unicorn/ambrosia.class";
import { FaintBread } from "../classes/equipment/unicorn/faint-bread.class";

@Injectable({
    providedIn: "root"
})
export class EquipmentService {

    constructor(private logService: LogService, private abilityService: AbilityService, private gameService: GameService) {}

    // Also update seagull !
    getInstanceOfAllEquipment() {
        const petService = InjectorService.getInjector().get(PetService);
        let map: Map<string, Equipment> = new Map();
        map.set('Garlic', new Garlic());
        map.set('Cake', new Cake());
        map.set('Meat Bone', new MeatBone());
        map.set('Steak', new Steak());
        map.set('Melon', new Melon())
        map.set('Honey', new Honey(this.logService, this.abilityService))
        map.set('Chili', new Chili(this.logService, this.abilityService))
        map.set('Mushroom', new Mushroom(this.logService, petService));
        map.set('Coconut', new Coconut());
        map.set('Peanut', new Peanut());
        map.set('Peanut Butter', new PeanutButter());
        map.set('Cake Slice', new CakeSlice());
        map.set('Blackberry', new Blackberry());
        map.set('Croissant', new Croissant());
        map.set('Rice', new Rice());
        map.set('Eucalyptus', new Eucalyptus());
        map.set('Lime', new Lime());    
        map.set('Egg', new Egg(this.logService));
        map.set('Squash', new Squash(this.logService));
        map.set('Salt', new Salt());
        map.set('Pie', new Pie(this.logService));
        map.set('Skewer', new Skewer(this.logService));
        map.set('Lemon', new Lemon());
        map.set('Pancakes', new Pancakes(this.logService));
        map.set('Strawberry', new Strawberry(this.logService));
        map.set('Baguette', new Baguette(this.logService));
        map.set('Cucumber', new Cucumber());
        map.set('Cheese', new Cheese());
        map.set('Grapes', new Grapes());
        map.set('Carrot', new Carrot());
        map.set('Pepper', new Pepper());
        map.set('Popcorn', new Popcorn(this.logService, petService, this.gameService));
        map.set('Cherry', new Cherry());
        map.set('Bok Choy', new BokChoy());
        map.set('Chocolate Cake', new ChocolateCake(this.logService, this.abilityService));
        map.set('Cod Roe', new CodRoe(this.logService, this.abilityService));
        map.set('Eggplant', new Eggplant(this.logService));
        map.set('Potato', new Potato());
        map.set('Banana', new Banana(this.logService, this.abilityService));
        map.set('Onion', new Onion(this.logService));
        map.set('Pita Bread', new PitaBread(this.logService));
        map.set('Tomato', new Tomato(this.logService));
        map.set('Sudduth Tomato', new SudduthTomato(this.logService));
        map.set('Unagi', new Unagi());
        map.set('Durian', new Durian(this.logService));
        map.set('Gros Michel Banana', new GrosMichelBanana(this.logService, this.abilityService));
        map.set('Seaweed', new Seaweed(this.logService, this.abilityService, petService));
        map.set('Fortune Cookie', new FortuneCookie());
        map.set('Blueberry', new Blueberry());
        map.set('Donut', new Donut());
        map.set('Cashew Nut', new CashewNut(this.logService));
        map.set('Nachos', new Nachos(this.logService));
        map.set('Pumpkin', new Pumpkin());
        map.set('Kiwifruit', new Kiwifruit());
        map.set('Pineapple', new Pineapple());
        map.set('Fig', new Fig(this.logService));
        map.set('Caramel', new Caramel(this.logService));

        map.set('Rambutan', new Rambutan(this.logService));
        map.set('Love Potion', new LovePotion(this.logService));
        map.set('Fairy Dust', new FairyDust(this.logService));
        map.set('Gingerbread Man', new GingerbreadMan(this.logService));
        map.set('Easter Egg', new EasterEgg(this.logService, this.abilityService));
        map.set('Health Potion', new HealthPotion(this.logService));
        map.set('Magic Beans', new MagicBeans());
        map.set('Golden Egg', new GoldenEgg(this.logService));
        map.set('Yggdrasil Fruit', new YggdrasilFruit(this.logService, this.abilityService));
        map.set('Honeydew Melon', new HoneydewMelon());
        map.set('Maple Syrup', new MapleSyrup());
        map.set('Cocoa Bean', new CocoaBean(this.logService, petService));
        map.set('White Okra', new WhiteOkra());
        map.set('White Truffle', new WhiteTruffle(this.logService));
        map.set('Ambrosia', new Ambrosia());
        map.set('Faint Bread', new FaintBread(this.logService, petService));

        return map;
    }

    getInstanceOfAllAilments() {
        let map = new Map();
        map.set('Cold', new Cold());
        map.set('Crisp', new Crisp());
        map.set('Dazed', new Dazed());
        map.set('Icky', new Icky());
        map.set('Ink', new Ink());
        map.set('Spooked', new Spooked());
        map.set('Weak', new Weak());
        map.set('Tasty', new Tasty(this.logService));

        return map;
    }

    //If change this, need change Hare too
    private static readonly USEFUL_PERKS: Map<string, number> = new Map([
        //T1
        ['Honey', 1],
        ['Strawberry', 1],
        ['Egg', 1],
        ['Cake Slice', 1],
        ['Cashew Nut', 1],
        ['Nachos', 1],
        // T2
        ['Lime', 2], 
        ['Meat Bone', 2], 
        ['Cherry', 2], 
        ['Bok Choy', 2],
        ['Kiwifruit', 2],
        ['Fairy Dust', 2],
        // T3  
        ['Garlic', 3], 
        ['Gingerbread Man', 3], 
        ['Fig', 3], 
        ['Cucumber', 3], 
        ['Croissant', 3],
        ['Squash', 3],
        // T4
        ['Banana', 4], 
        ['Love Potion', 4], 
        ['Pie', 4], 
        ['Grapes', 4], 
        ['Cheese', 4], 
        ['Cod Roe', 4],
        ['Salt', 4], 
        ['Fortune Cookie', 4],
        // T5
        ['Easter Egg', 5], 
        ['Magic Beans', 5], 
        ['Chili', 5], 
        ['Lemon', 5], 
        ['Durian', 5],
        ['Honeydew Melon', 5],
        ['Maple Syrup', 5],
        ['Cocoa Bean', 5],
        ['White Okra', 5],
        // T6
        ['Popcorn', 6], 
        ['Steak', 6], 
        ['Pancakes', 6], 
        ['Yggdrasil Fruit', 6], 
        ['Melon', 6], 
        ['Tomato', 6], 
        ['Sudduth Tomato', 6],
        ['Pita Bread', 6],
        // Hidden
        ['Seaweed', 5],
        // Golden  
        ['Caramel', 4],
        // Star
        ['Baguette', 4]
    ]);

    isUsefulPerk(equipmentName: string): boolean {
        return EquipmentService.USEFUL_PERKS.has(equipmentName);
    }

    getUsefulPerksByTier(tier: number): Equipment[] {
        const allEquipment = this.getInstanceOfAllEquipment();
        const usefulPerksForTier: Equipment[] = [];
        
        for (const [name, tierValue] of EquipmentService.USEFUL_PERKS.entries()) {
            if (tierValue === tier && allEquipment.has(name)) {
                usefulPerksForTier.push(allEquipment.get(name)!);
            }
        }
        
        return usefulPerksForTier;
    }

    getUsefulPerks(): Equipment[] {
        const allEquipment = this.getInstanceOfAllEquipment();
        const usefulPerks: Equipment[] = [];
        
        for (const name of EquipmentService.USEFUL_PERKS.keys()) {
            if (allEquipment.has(name)) {
                usefulPerks.push(allEquipment.get(name)!);
            }
        }
        
        return usefulPerks;
    }

}