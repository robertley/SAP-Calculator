import { clone, cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { TapirAbility } from "../../../abilities/pets/custom/tier-6/tapir-ability.class";

export class Tapir extends Pet {
    name = "Tapir";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    initAbilities(): void {
        this.addAbility(new TapirAbility(this, this.logService, this.abilityService, this.petService));
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