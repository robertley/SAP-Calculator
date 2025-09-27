import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { LizardAbility } from "../../../abilities/pets/golden/tier-2/lizard-ability.class";

export class Lizard extends Pet {
    name = "Lizard";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 1;
    health = 3;
    initAbilities(): void {
        this.addAbility(new LizardAbility(this, this.logService, this.abilityService));
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