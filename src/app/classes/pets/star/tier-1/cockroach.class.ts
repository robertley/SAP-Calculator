import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SummonedCockroach } from "../../hidden/summoned-cockroach.class";
import { CockroachAbility } from "../../../abilities/pets/star/tier-1/cockroach-ability.class"; 


export class Cockroach extends Pet {
    name = "Cockroach";
    tier = 1;
    pack: Pack = 'Star';
    attack = 1;
    health = 1;
    initAbilities(): void {
        this.addAbility(new CockroachAbility(this, this.logService, this.abilityService));
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