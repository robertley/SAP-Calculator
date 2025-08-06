import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Goose extends Pet {
    name = "Goose";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.opponent.furthestUpPet;
        if (target == null) {
            return;
        }
        let power = this.level;
        target.increaseAttack(-this.level);
        this.logService.createLog({
            message: `${this.name} removed ${power} attack from ${target.name}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
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