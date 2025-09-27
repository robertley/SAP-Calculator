import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FalconAbility } from "../../../abilities/pets/golden/tier-4/falcon-ability.class";

export class Falcon extends Pet {
    name = "Falcon";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 5;
    health = 5;
    initAbilities(): void {
        this.addAbility(new FalconAbility(this, this.logService, this.petService, this.abilityService));
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
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}