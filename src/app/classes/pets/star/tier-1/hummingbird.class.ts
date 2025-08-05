import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hummingbird extends Pet {
    name = "Hummingbird";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.parent.getRandomStrawberryPet(this);
        if (target == null) {
            return;
        }
        let power: Power = {
            attack: this.level * 2,
            health: this.level,
        }
        target.increaseHealth(power.health);
        target.increaseAttack(power.attack);
        this.logService.createLog({
            message: `${this.name} increased ${target.name}'s attack by ${power.attack} and health by ${power.health}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
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