import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { RhinoAbility } from "../../../abilities/pets/turtle/tier-5/rhino-ability.class";

export class Rhino extends Pet {
    name = "Rhino";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 9;
    initAbilities(): void {
        this.addAbility(new RhinoAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}