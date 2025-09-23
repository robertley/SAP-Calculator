import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GroundhogAbility } from "../../../abilities/pets/golden/tier-1/groundhog-ability.class";

export class Groundhog extends Pet {
    name = "Groundhog";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 2;
    health = 1;
    initAbilities(): void {
        this.addAbility(new GroundhogAbility(this, this.logService));
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