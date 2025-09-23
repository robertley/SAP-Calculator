import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BasiliskAbility } from "../../../abilities/pets/custom/tier-1/basilisk-ability.class";

export class Basilisk extends Pet {
    name = "Basilisk";
    tier = 1;
    pack: Pack = 'Custom';
    health = 2;
    attack = 1;
    initAbilities(): void {
        this.addAbility(new BasiliskAbility(this, this.logService, this.abilityService));
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