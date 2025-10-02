import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AmalgamationAbility } from "../../../abilities/pets/unicorn/tier-5/amalgamation-ability.class";

export class Amalgamation extends Pet {
    name = "Amalgamation";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    initAbilities(): void {
        this.addAbility(new AmalgamationAbility(this, this.logService));
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