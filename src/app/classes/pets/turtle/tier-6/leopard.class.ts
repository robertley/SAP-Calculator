import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Leopard extends Pet {
    name = "Leopard";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 10;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = Math.floor(this.attack * .5);
        let previousTargets = [];
        for (let i = 0; i < this.level; i++) {
            let target = getOpponent(gameApi, this.parent).getRandomPet(previousTargets);
            if (target == null) {
                return;
            }
            previousTargets.push(target)
            this.snipePet(target, power, true, tiger);
        }
        this.superStartOfBattle(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}