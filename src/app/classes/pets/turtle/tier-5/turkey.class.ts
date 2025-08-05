import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Turkey extends Pet {
    name = "Turkey";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 4;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        let power: Power = {
            attack: 3 * this.level,
            health: 2 * this.level
        }
        try {
            pet.increaseAttack(power.attack);
            pet.increaseHealth(power.health);
        } catch (error) {
            console.error(error);
            console.log(pet);
            throw error;
        }

        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        super.superFriendSummoned(gameApi, pet, tiger);
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