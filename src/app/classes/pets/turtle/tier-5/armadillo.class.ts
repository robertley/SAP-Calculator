import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Armadillo extends Pet {
    name = "Armadillo";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 6;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let boostPets = [
            ...this.parent.petArray,
            ...getOpponent(gameApi, this.parent).petArray
        ];
        for (let pet of boostPets) {
            if (!pet.alive) {
                continue;
            }
            let power = 8 * this.level;
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} increased health of ${pet.name} by ${power}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
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