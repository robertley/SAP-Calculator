import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FrigatebirdAbility } from "../../../abilities/pets/custom/tier-2/frigatebird-ability.class";

export class Frigatebird extends Pet {
    name = "Frigatebird";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 2;
    health = 1;

    initAbilities(): void {
        this.addAbility(new FrigatebirdAbility(this, this.logService));
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

    resetPet(): void {
        super.resetPet();
    }

}
