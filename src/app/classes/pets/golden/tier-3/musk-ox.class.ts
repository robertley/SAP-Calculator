import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class MuskOx extends Pet {
    name = "Musk Ox";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 2;
    health = 4;
    friendAheadFaints(gameApi: GameAPI, tiger?: boolean): void {
        let power: Power = {
            attack: this.level,
            health: this.level * 2
        }
        this.increaseAttack(power.attack);
        this.increaseHealth(power.health);
        this.logService.createLog({
            message: `${this.name} gained ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendAheadFaints(gameApi, tiger);
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