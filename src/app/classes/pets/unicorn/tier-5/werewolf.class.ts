import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Werewolf extends Pet {
    name = "Werewolf";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 6;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (gameApi.day) {
            const manaGain = this.level * 6;
            this.increaseMana(manaGain);
            this.logService.createLog({
                message: `${this.name} gained ${manaGain} mana.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        }
        else {
            let power = this.level * 0.5;
            const attackGain = Math.floor(this.attack * power);
            const healthGain = Math.floor(this.health * power);
            let attack = Math.min(50, this.attack + attackGain);
            let health = Math.min(50, this.health + healthGain);
            this.logService.createLog({
                message: `${this.name} increased its stats by ${power * 100}% (${attack}/${health}).`,
                type: "ability",
                player: this.parent,
                tiger: tiger
            });
            this.increaseAttack(this.attack * power);
            this.increaseHealth(this.health * power);
        }

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