import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChipmunkAbility } from "../../../abilities/pets/puppy/tier-1/chipmunk-ability.class";

export class Chipmunk extends Pet {
    name = "Chipmunk";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 2;
    initAbilities(): void {
        this.addAbility(new ChipmunkAbility(this, this.logService, this.abilityService));
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