import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EelAbility } from "../../../abilities/pets/custom/tier-4/eel-ability.class";

export class Eel extends Pet {
    name = "Eel";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 2;
    initAbilities(): void {
        this.addAbility(new EelAbility(this, this.logService));
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