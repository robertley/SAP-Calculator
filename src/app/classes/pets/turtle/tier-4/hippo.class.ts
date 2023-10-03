import { PetService } from "app/services/pet.service";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hippo extends Pet {
    name = "Hippo";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 7;
    knockOut(gameAPI, pet: Pet, tiger) {
        if (this.health < 1) {
            return;
        }
        let power = 2 * this.level;
        if (pet.tier > 3) {
            power *= 2;
        }
        this.increaseAttack(power);
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superKnockOut(gameAPI, pet, tiger);
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