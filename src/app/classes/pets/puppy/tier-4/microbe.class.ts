import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MicrobeAbility } from "../../../abilities/pets/puppy/tier-4/microbe-ability.class";

export class Microbe extends Pet {
    name = "Microbe";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 1;
    initAbilities(): void {
        this.addAbility(new MicrobeAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
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