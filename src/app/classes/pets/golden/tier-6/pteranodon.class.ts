import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";
import { PteranodonAbility } from "../../../abilities/pets/golden/tier-6/pteranodon-ability.class";

export class Pteranodon extends Pet {
    name = "Pteranodon";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 3;
    health = 5;
    initAbilities(): void {
        this.addAbility(new PteranodonAbility(this, this.logService, this.abilityService, this.petService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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