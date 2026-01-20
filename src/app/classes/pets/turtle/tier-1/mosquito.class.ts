import { cloneDeep } from "lodash-es";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { LogService } from "../../../../services/log.service";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Equipment } from "../../../equipment.class";
import { AbilityService } from "../../../../services/ability/ability.service";
import { MosquitoAbility } from "../../../abilities/pets/turtle/tier-1/mosquito-ability.class";

export class Mosquito extends Pet {
    name = "Mosquito";
    tier = 1;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    initAbilities(): void {
        this.addAbility(new MosquitoAbility(this, this.logService));
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