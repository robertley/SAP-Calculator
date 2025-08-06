import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class ConeSnail extends Pet {
    name = "Cone Snail";
    tier = 1;
    pack: Pack = 'Golden';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.petBehind();
        if (target == null) {
            return;
        }
        let power = this.level * 2;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} health.`,
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