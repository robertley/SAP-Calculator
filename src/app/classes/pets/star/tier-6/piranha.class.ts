import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PiranhaAbility } from "../../../abilities/pets/star/tier-6/piranha-ability.class";

export class Piranha extends Pet {
    name = "Piranha";
    tier = 6;
    pack: Pack = 'Star';
    attack = 10;
    health = 4;
    initAbilities(): void {
        this.addAbility(new PiranhaAbility(this, this.logService));
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