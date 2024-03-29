import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Seahorse extends Pet {
    name = "Seahorse";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let target = opponent.getLastPet();
        this.parent.pushPet(target, this.level);
        let s = this.level > 1 ? 's' : '';
        this.logService.createLog(
            {
                message: `${this.name} pushes ${target.name} forward ${this.level} space${s}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            }
        );
        this.superStartOfBattle(gameApi, tiger);
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