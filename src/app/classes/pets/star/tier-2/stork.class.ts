import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { StorkAbility } from "../../../abilities/pets/star/tier-2/stork-ability.class";

export class Stork extends Pet {
    name = "Stork";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    initAbilities(): void {
        this.addAbility(new StorkAbility(this, this.logService, this.abilityService, this.petService));
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