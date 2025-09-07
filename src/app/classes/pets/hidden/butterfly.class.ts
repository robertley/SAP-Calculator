import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { getOpponent } from "../../../util/helper-functions";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class Butterfly extends Pet {
    name = "Butterly";
    tier = 1;
    pack: Pack = 'Puppy';
    hidden: boolean = true;
    health = 1;
    attack = 1;
    transform(gameApi: GameAPI, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        let opponent = getOpponent(gameApi, this.parent);
        let targetResp = opponent.getStrongestPet(this);
        if (targetResp.pet == null) {
            return;
        }
        this.health = targetResp.pet.health;
        this.attack = targetResp.pet.attack;
        this.logService.createLog({
            message: `${this.name} copied stats from the strongest enemy (${this.attack}/${this.health}).`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })
        this.superTransform(gameApi, tiger);
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