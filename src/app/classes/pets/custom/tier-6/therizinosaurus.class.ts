import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TherizinosaurusAbility } from "../../../abilities/pets/custom/tier-6/therizinosaurus-ability.class";

export class Therizinosaurus extends Pet {
    name = "Therizinosaurus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 3;
    health = 2;
    initAbilities(): void {
        this.addAbility(new TherizinosaurusAbility(this, this.logService));
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