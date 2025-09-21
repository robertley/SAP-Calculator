import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { CrabAbility } from "../../../abilities/pets/turtle/tier-2/crab-ability.class";

export class Crab extends Pet {
    name = "Crab";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 1;
    attack = 4;
    initAbilities(): void {
        this.addAbility(new CrabAbility(this, this.logService));
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