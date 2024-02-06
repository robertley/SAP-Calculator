import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Roc extends Pet {
    name = "Roc";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {

        let targets = [];
        let target = this.petAhead;
        while (target) {
            targets.push(target);
            target = target.petAhead;
        }

        if (targets.length == 0) {
            return;
        }

        for (let i = 0; i < this.level * 3; i++) {
            // get random target
            let targetIndex = Math.floor(Math.random() * targets.length);
            target = targets[targetIndex];
            this.logService.createLog({
                message: `${this.name} gave ${target.name} 3 mana.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targets.length > 1
            })

            target.increaseMana(3);
        }

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