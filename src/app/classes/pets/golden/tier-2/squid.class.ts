import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SquidAbility } from "../../../abilities/pets/golden/tier-2/squid-ability.class";

export class Squid extends Pet {
    name = "Squid";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 5;
    health = 2;
    initAbilities(): void {
        this.addAbility(new SquidAbility(this, this.logService));
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