import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SpiderAbility } from "../../../abilities/pets/turtle/tier-2/spider-ability.class";

export class Spider extends Pet {
    name = "Spider";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    initAbilities() {
        this.addAbility(new SpiderAbility(this, this.logService, this.abilityService, this.petService));
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