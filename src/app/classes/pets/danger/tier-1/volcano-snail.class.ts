import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { VolcanoSnailAbility } from "../../../abilities/pets/danger/tier-1/volcano-snail-ability.class";

export class VolcanoSnail extends Pet {
    name = "Volcano Snail";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 1;
    health = 4;
    initAbilities(): void {
        this.addAbility(new VolcanoSnailAbility(this, this.logService));
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