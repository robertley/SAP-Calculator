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
        
        // Get front target
        let targetFrontResp = opponent.getFurthestUpPet(this);
        let targetFront = targetFrontResp.pet;
        
        // Get back target (could be different if Silly)
        let targetBackResp = opponent.getLastPet(undefined, this);
        let targetBack = targetBackResp.pet;
        
        let power =  2 * this.level;
        
        if (targetFront) {
            this.snipePet(targetFront, power, targetFrontResp.random, tiger, pteranodon);
        }
        if (targetBack) {
            this.snipePet(targetBack, power, targetBackResp.random, tiger, pteranodon);
        }
        
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