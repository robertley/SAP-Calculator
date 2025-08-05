import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
        let targets = this.parent.opponent.getRandomPets(this.level, null, null, true);
        for (let target of targets) {
            this.snipePet(target, power, true, tiger);
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