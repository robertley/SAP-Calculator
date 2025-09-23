import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { HighlandCowAbility } from "../../../abilities/pets/golden/tier-6/highland-cow-ability.class";

export class HighlandCow extends Pet {
    name = "Highland Cow";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 4;
    health = 12;
    initAbilities(): void {
        this.addAbility(new HighlandCowAbility(this, this.logService));
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