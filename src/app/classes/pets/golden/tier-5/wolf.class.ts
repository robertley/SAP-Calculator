import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";
import { WolfAbility } from "../../../abilities/pets/golden/tier-5/wolf-ability.class";

export class Wolf extends Pet {
    name = "Wolf";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 4;
    health = 4;
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
    initAbilities(): void {
        this.addAbility(new WolfAbility(this, this.logService, this.abilityService, this.petService));
        super.initAbilities();
    }
}