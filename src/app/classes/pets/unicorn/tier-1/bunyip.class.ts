import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bunyip extends Pet {
    name = "Bunyip";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let isPlayer = this.parent == gameApi.player;
        let rollAmount;
        if (isPlayer) {
            rollAmount = gameApi.playerRollAmount;
        } else {
            rollAmount = gameApi.opponentRollAmount;
        }

        let mult = Math.min(3, rollAmount);

        this.logService.createLog({
            message: `${this.name} gained ${this.level * mult} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.increaseHealth(this.level * mult);

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