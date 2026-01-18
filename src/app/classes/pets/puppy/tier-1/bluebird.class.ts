import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BluebirdAbility } from "../../../abilities/pets/puppy/tier-1/bluebird-ability.class";

export class Bluebird extends Pet {
    name = "Bluebird";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 2
    health = 1;
    initAbilities(): void {
        this.addAbility(new BluebirdAbility(this, this.logService, this.abilityService));
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