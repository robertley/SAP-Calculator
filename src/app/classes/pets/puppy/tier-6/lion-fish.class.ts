import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Lionfish extends Pet {
    name = "Lionfish";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 4;
    faint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let snipeAmt = 1 + Math.floor(this.attack / 10);
        for (let i = 0; i < snipeAmt; i++) {
            let targetResp = opponent.getRandomPet([], false, true, false, this);
            if (targetResp.pet == null) {
                return;
            }
            let power = this.level * 3;
            this.snipePet(targetResp.pet, power, targetResp.random, tiger, pteranodon);
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