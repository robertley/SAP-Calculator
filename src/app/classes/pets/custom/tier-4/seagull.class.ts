import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
import { Blackberry } from "../../../equipment/puppy/blackberry.class";
import { Croissant } from "../../../equipment/puppy/croissant.class";
import { Rice } from "../../../equipment/puppy/rice.class";
import { Egg } from "../../../equipment/puppy/egg.class";
import { Lime } from "../../../equipment/puppy/lime.class";
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
import { Fig } from "../../../equipment/golden/fig.class";
import { EasterEgg } from "../../../equipment/unicorn/easter-egg.class";
import { FairyDust } from "../../../equipment/unicorn/fairy-dust.class";
import { GingerbreadMan } from "../../../equipment/unicorn/gingerbread-man.class";
import { GoldenEgg } from "../../../equipment/unicorn/golden-egg.class";
import { HealthPotion } from "../../../equipment/unicorn/health-potion.class";
import { LovePotion } from "../../../equipment/unicorn/love-potion.class";
import { MagicBeans } from "../../../equipment/unicorn/magic-beans.class";
import { Rambutan } from "../../../equipment/unicorn/rambutan.class";
import { Squash } from "../../../equipment/puppy/squash.class";
import { HoneydewMelon } from "../../../equipment/golden/honeydew-melon.class";
import { Ambrosia } from "../../../equipment/unicorn/ambrosia.class";
import { FaintBread } from "../../../equipment/unicorn/faint-bread.class";
import { Seaweed } from "../../../equipment/star/seaweed.class";
import { Caramel } from "../../../equipment/star/caramel.class";
import { Baguette } from "../../../equipment/star/baguette.class";
import { InjectorService } from "../../../../services/injector.service";

export class Seagull extends Pet {
    name = "Seagull";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    abilityUses: number;
    private get equipmentService(): EquipmentService {
        return InjectorService.getInjector().get(EquipmentService);
    }
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (this.equipment == null) { 
            return;
        }

        pet.givePetEquipment(this.equipmentService.getInstanceOfAllEquipment().get(this.equipment.name));
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} a ${this.equipment.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        this.superFriendSummoned(gameApi, pet, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}