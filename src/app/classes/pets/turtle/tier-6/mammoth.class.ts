import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mammoth extends Pet {
    name = "Mammoth";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 12;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power = this.level * 2;
        for (let pet of this.parent.petArray.filter(pet => {return pet != this && pet.alive})) {
            pet.increaseAttack(power);
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
            })
        }
        super.superFaint(gameApi, tiger);
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