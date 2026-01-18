import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TakinAbility } from "../../../abilities/pets/danger/tier-3/takin-ability.class";

export class Takin extends Pet {
    name = "Takin";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 1;
    health = 2;

    initAbilities(): void {
        this.addAbility(new TakinAbility(this, this.logService));
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