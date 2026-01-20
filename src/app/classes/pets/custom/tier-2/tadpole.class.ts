import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { TadpoleAbility } from "../../../abilities/pets/custom/tier-2/tadpole-ability.class";

export class Tadpole extends Pet {
    name = "Tadpole";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 2;
    health = 2;

    override initAbilities(): void {
        this.addAbility(new TadpoleAbility(this));
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
