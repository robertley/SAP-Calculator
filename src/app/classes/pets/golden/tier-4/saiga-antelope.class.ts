import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SaigaAntelopeAbility } from "../../../abilities/pets/golden/tier-4/saiga-antelope-ability.class";

export class SaigaAntelope extends Pet {
    name = "Saiga Antelope";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 3;
    health = 3;

    initAbilities(): void {
        this.addAbility(new SaigaAntelopeAbility(this, this.logService, this.abilityService));
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