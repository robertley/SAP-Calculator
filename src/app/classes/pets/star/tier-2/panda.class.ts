import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Panda extends Pet {
    name = "Panda";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let percentage = .5 * this.level;
        let power: Power = {
            attack: Math.floor(this.attack * percentage),
            health: Math.floor(this.health * percentage)
        }
        let target = this.petAhead;
        if (target == null) {
            return;
        }
        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);
        this.logService.createLog(
            {
                message: `${this.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            }
        )
        this.health = 0;
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