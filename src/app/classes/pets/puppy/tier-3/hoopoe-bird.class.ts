import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class HoopoeBird extends Pet {
    name = "Hoopoe Bird";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let targetFront = opponent.furthestUpPet;
        let targetBack = opponent.getLastPet();
        let power =  2 * this.level;
        if (!targetFront) {
            return;
        }
        this.snipePet(targetFront, power, false, tiger, pteranodon);
        this.snipePet(targetBack, power, false, tiger, pteranodon);
        this.superFaint(gameApi, tiger);
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