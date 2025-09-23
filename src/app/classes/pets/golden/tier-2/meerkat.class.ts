import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MeerkatAbility } from "../../../abilities/pets/golden/tier-2/meerkat-ability.class";

export class Meerkat extends Pet {
    name = "Meerkat";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    initAbilities(): void {
        this.addAbility(new MeerkatAbility(this, this.logService));
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