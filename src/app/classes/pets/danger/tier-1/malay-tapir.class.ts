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
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        
        if (!target) {
            return;
        }

        let healthGain = this.level * 1;
        target.increaseHealth(healthGain);
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${healthGain} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
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