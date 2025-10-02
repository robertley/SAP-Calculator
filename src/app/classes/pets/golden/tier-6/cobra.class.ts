import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CobraAbility } from "../../../abilities/pets/golden/tier-6/cobra-ability.class";

export class Cobra extends Pet {
    name = "Cobra";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 12;
    health = 6;
    initAbilities(): void {
        this.addAbility(new CobraAbility(this, this.logService));
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