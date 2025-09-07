import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Stegosaurus extends Pet {
    name = "Stegosaurus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 3;
    health = 8;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let equipmentPets = this.parent.petArray.filter(pet => pet.equipment != null);
        let targetResp = this.parent.getRandomPet([...equipmentPets, this], true, false, true, this);
        if (targetResp.pet == null) {
            return;
        }
        let power = this.level * gameApi.turnNumber;
        targetResp.pet.increaseAttack(power);
        targetResp.pet.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${targetResp.pet.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })
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