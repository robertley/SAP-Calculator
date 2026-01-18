import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GreatOneAbility } from "../../../abilities/pets/custom/tier-6/great-one-ability.class";

export class GreatOne extends Pet {
    name = "Great One";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 7;
    health = 13;

    initAbilities(): void {
        this.addAbility(new GreatOneAbility(this, this.logService));
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