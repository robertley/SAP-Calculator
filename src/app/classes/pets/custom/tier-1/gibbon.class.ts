import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Player } from "../../../player.class";
import { Pet, Pack } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { GibbonAbility } from "../../../abilities/pets/custom/tier-1/gibbon-ability.class";

export class Gibbon extends Pet {
    name = "Gibbon";
    tier = 1;
    pack: Pack = "Custom";
    health = 2;
    attack = 1;
    initAbilities(): void {
        this.addAbility(new GibbonAbility(this, this.logService, this.abilityService));
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