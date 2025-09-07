import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Seahorse extends Pet {
    name = "Seahorse";
    tier = 1;
    pack: Pack = 'Custom';
    attack = 2;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let targetResp = opponent.getLastPet();
        if (targetResp.pet == null) {
            return;
        }
        this.parent.pushPet(targetResp.pet, this.level);
        this.logService.createLog(
            {
                message: `${this.name} pushes ${targetResp.pet.name} forward ${this.level} space(s).`,
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