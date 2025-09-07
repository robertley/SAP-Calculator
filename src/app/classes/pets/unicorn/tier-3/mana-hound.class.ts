import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class ManaHound extends Pet {
    name = "Mana Hound";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let isPlayer = this.parent == gameApi.player;
        let rollAmount;
        if (isPlayer) {
            rollAmount = gameApi.playerRollAmount;
        } else {
            rollAmount = gameApi.opponentRollAmount;
        }

        rollAmount = Math.min(rollAmount, 5);

        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        let manaAmt = rollAmount * this.level;
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${manaAmt} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        })

        target.increaseMana(manaAmt);

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