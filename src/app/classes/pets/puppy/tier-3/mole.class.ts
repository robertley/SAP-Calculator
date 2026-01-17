import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MoleAbility } from "../../../abilities/pets/puppy/tier-3/mole-ability.class";

export class Mole extends Pet {
    name = "Mole";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
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
    initAbilities(): void {
        this.addAbility(new MoleAbility(this, this.logService, this.abilityService));
        super.initAbilities();
    }
}