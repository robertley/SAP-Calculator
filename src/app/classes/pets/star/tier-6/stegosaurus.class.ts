import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Stegosaurus extends Pet {
    name = "Stegosaurus";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 8;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let equipmentPets = this.parent.petArray.filter(pet => pet.equipment != null);
        let target = this.parent.getRandomPet([...equipmentPets, this], true, false, true);
        if (target == null) {
            return;
        }
        let power = this.level * gameApi.turnNumber;
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
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