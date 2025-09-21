import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ArmadilloAbility } from "../../../abilities/pets/turtle/tier-5/armadillo-ability.class";

export class Armadillo extends Pet {
    name = "Armadillo";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 10;
    initAbilities(): void {
        this.addAbility(new ArmadilloAbility(this, this.logService));
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