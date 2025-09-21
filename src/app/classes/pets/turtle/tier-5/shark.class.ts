import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SharkAbility } from "../../../abilities/pets/turtle/tier-5/shark-ability.class";

// TODO - fix bug with late trigger on start of battle abilities knocking out pets
export class Shark extends Pet {
    name = "Shark";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    initAbilities(): void {
        this.addAbility(new SharkAbility(this, this.logService));
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