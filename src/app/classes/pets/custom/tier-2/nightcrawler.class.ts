import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Daycrawler } from "../../hidden/daycrawler.class";

export class Nightcrawler extends Pet {
    name = "Nightcrawler";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 1;
    health = 1;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let isPlayer = this.parent == gameApi.player;
        let summonedAmount = isPlayer ? gameApi.playerSummonedAmount : gameApi.opponentSummonedAmount;

        if (summonedAmount == 0) {
            return;
        }

        let health = Math.min(50, this.level * summonedAmount);
        let attack = 6;

        let dayCrawler = new Daycrawler(this.logService, this.abilityService, this.parent, health, attack, 0, 0);

        let summonResult = this.parent.summonPet(dayCrawler, this.savedPosition, false, this);
        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned Daycrawler (${attack}/${health})`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                }
            )

            this.abilityService.triggerFriendSummonedEvents(dayCrawler);
        }

        super.superAfterFaint(gameApi, tiger, pteranodon);
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