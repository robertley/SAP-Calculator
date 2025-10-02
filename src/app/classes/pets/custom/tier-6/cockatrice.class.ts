import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CockatriceAbility } from "../../../abilities/pets/custom/tier-6/cockatrice-ability.class";

export class Cockatrice extends Pet {
    name = "Cockatrice";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 5;
    health = 7;
    initAbilities(): void {
        this.addAbility(new CockatriceAbility(this, this.logService, this.abilityService));
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