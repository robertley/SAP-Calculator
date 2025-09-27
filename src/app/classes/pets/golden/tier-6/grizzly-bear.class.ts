import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GrizzlyBearAbility } from "../../../abilities/pets/golden/tier-6/grizzly-bear-ability.class";

export class GrizzlyBear extends Pet {
    name = "Grizzly Bear";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 6;
    health = 8;
    
    initAbilities(): void {
        this.addAbility(new GrizzlyBearAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}