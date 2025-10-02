import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { VaquitaAbility } from "../../../abilities/pets/golden/tier-4/vaquita-ability.class";

export class Vaquita extends Pet {
    name = "Vaquita";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new VaquitaAbility(this, this.logService));
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