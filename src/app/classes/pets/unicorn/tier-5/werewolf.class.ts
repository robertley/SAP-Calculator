import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Werewolf extends Pet {
    name = "Werewolf";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (gameApi.day) {
            return;
        }
        let power = this.level;
        let attack = Math.min(50, this.attack + this.attack * power);
        let health = Math.min(50, this.health + this.health * power);
        this.logService.createLog({
            message: `${this.name} increased its stats by ${power * 100}% (${attack}/${health}).`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        });
        this.increaseAttack(this.attack * power);
        this.increaseHealth(this.health * power);

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