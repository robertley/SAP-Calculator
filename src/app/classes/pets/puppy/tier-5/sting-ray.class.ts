import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { StingRayAbility } from "../../../abilities/pets/puppy/tier-5/sting-ray-ability.class";

export class StingRay extends Pet {
    name = "Sting Ray";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 5;
    health = 7;
    initAbilities(): void {
        this.addAbility(new StingRayAbility(this, this.logService, this.abilityService));
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
