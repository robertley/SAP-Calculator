import { Power } from "app/interfaces/power.interface";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Boar extends Pet {
    name = "Boar";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 10;
    health = 6;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        let power: Power = {
            attack: this.level * 4,
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
        this.superBeforeAttack(gameApi, tiger);
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