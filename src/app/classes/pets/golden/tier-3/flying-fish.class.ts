import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FlyingFishAbility } from "../../../abilities/pets/golden/tier-3/flying-fish-ability.class";

export class FlyingFish extends Pet {
    name = "Flying Fish";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 5;
    health = 2;
    initAbilities(): void {
        this.addAbility(new FlyingFishAbility(this, this.logService));
        super.initAbilities();
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}