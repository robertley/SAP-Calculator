import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TarantulaHawkAbility } from "../../../abilities/pets/custom/tier-6/tarantula-hawk-ability.class";

export class TarantulaHawk extends Pet {
    name = "Tarantula Hawk";
    tier = 6;
    pack: Pack = 'Custom';
    health = 2;
    attack = 10;

    initAbilities(): void {
        this.addAbility(new TarantulaHawkAbility(this, this.logService));
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