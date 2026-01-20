import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HumpheadWrasseAbility } from "../../../abilities/pets/danger/tier-4/humphead-wrasse-ability.class";

export class HumpheadWrasse extends Pet {
    name = "Humphead Wrasse";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 6;
    health = 4;

    initAbilities(): void {
        this.addAbility(new HumpheadWrasseAbility(this, this.logService));
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