import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class MalayTapir extends Pet {
    name = "Malay Tapir";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;

    adjacentAttacked(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }

        let healthGain = this.level * 1;
        this.increaseHealth(healthGain);
        
        this.logService.createLog({
            message: `${this.name} gained ${healthGain} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.superAdjacentAttacked(gameApi, pet, tiger);
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