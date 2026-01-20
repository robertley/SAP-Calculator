import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { OrcaAbility } from "../../../abilities/pets/star/tier-6/orca-ability.class";
// TO DO: Update faint pool, and add all faint pets
export class Orca extends Pet {
    name = "Orca";
    tier = 6;
    pack: Pack = 'Star';
    attack = 5;
    health = 7;
    initAbilities(): void {
        this.addAbility(new OrcaAbility(this, this.logService, this.abilityService, this.petService));
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