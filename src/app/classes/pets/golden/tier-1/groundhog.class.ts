import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Groundhog extends Pet {
    name = "Groundhog";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 2;
    health = 1;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        this.parent.gainTrumpets(this.level);
        this.logService.createLog({
            message: `${this.name} gained ${this.level} trumpets. (${this.parent.trumpets})`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFaint(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}