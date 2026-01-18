import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MagpieAbility } from "../../../abilities/pets/golden/tier-1/magpie-ability.class";

export class Magpie extends Pet {
    name = "Magpie";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 4;
    initAbilities(): void {
        this.addAbility(new MagpieAbility(this, this.logService, this.abilityService));
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