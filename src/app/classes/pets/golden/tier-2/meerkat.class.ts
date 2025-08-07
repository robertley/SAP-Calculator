import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class Meerkat extends Pet {
    name = "Meerkat";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let gold;
        if (this.parent == gameApi.player) {
            gold = gameApi.playerGoldSpent;
        } else {
            gold = gameApi.opponentGoldSpent;
        }
        let power = Math.floor(gold / 4) * this.level;
        let targetAhead = this.petAhead;
        let targetBehind = this.petBehind();
        if (targetAhead != null) {
            targetAhead.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${targetAhead.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }
        if (targetBehind != null) {
            targetBehind.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${targetBehind.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
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