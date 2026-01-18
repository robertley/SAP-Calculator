import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PygmyHippoAbility } from "../../../abilities/pets/danger/tier-3/pygmy-hippo-ability.class";

export class PygmyHippo extends Pet {
    name = "Pygmy Hippo";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 7;
    initAbilities(): void {
        this.addAbility(new PygmyHippoAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}