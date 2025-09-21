import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Cold } from "../../../equipment/ailments/cold.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FrostWolfAbility } from "../../../abilities/pets/unicorn/tier-2/frost-wolf-ability.class";

export class FrostWolf extends Pet {
    name = "Frost Wolf";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    initAbilities(): void {
        this.addAbility(new FrostWolfAbility(this, this.logService));
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