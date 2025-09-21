import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Beaver } from "../../turtle/tier-1/beaver.class";
import { Duck } from "../../turtle/tier-1/duck.class";
import { PlatypusAbility } from "../../../abilities/pets/star/tier-4/platypus-ability.class";

export class Platypus extends Pet {
    name = "Platypus";
    tier = 4;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;

    initAbilities(): void {
        this.addAbility(new PlatypusAbility(this, this.logService, this.abilityService));
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