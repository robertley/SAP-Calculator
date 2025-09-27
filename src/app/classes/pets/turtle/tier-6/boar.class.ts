import { Power } from "app/interfaces/power.interface";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BoarAbility } from "../../../abilities/pets/turtle/tier-6/boar-ability.class";

export class Boar extends Pet {
    name = "Boar";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 10;
    health = 6;
    initAbilities(): void {
        this.addAbility(new BoarAbility(this, this.logService));
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