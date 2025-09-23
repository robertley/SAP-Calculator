import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { NyalaAbility } from "../../../abilities/pets/golden/tier-5/nyala-ability.class";

export class Nyala extends Pet {
    name = "Nyala";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 3;
    health = 4;
    initAbilities(): void {
        this.addAbility(new NyalaAbility(this, this.logService));
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