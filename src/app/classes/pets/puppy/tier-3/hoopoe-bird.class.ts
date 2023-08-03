import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HoopoeBird extends Pet {
    name = "Hoopoe Bird";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let targetFront = opponent.furthestUpPet;
        let targetBack = opponent.getLastPet();
        let power =  2 * this.level;
        if (!targetFront) {
            return;
        }
        this.snipePet(targetFront, power, false, tiger);
        this.snipePet(targetBack, power, false, tiger);
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