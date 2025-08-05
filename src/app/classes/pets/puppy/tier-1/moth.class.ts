import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Moth extends Pet {
    name = "Moth";
    tier = 1;
    pack: Pack = 'Puppy';
    health = 1;
    attack = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.furthestUpPet;
        let power = 2 * this.level;
        target.increaseAttack(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack.`,
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