import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TucuxiAbility } from "../../../abilities/pets/danger/tier-3/tucuxi-ability.class";

export class Tucuxi extends Pet {
    name = "Tucuxi";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    initAbilities(): void {
        this.addAbility(new TucuxiAbility(this, this.logService));
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