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
        let nonEquipmentPets = this.parent.getPetsWithEquipment(null).filter(pet => pet !== this);
        let target = nonEquipmentPets[Math.floor(Math.random() * nonEquipmentPets.length)];
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
            randomEvent: nonEquipmentPets.length > 1
        })
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