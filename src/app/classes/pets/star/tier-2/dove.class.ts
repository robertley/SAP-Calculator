import { shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Dove extends Pet {
    name = "Dove";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 1;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = this.parent.getPetsWithEquipment('Strawberry').filter(pet => {
            return pet !== this && pet.alive;
        });
        targets = shuffle(targets);
        let power = this.level * 2;
        let random = false;
        if (targets.length > 2) {
            random = true;
        }
        if (targets.length > 0) {
            let target = targets[0];
            target.increaseAttack(power);
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: random,
                pteranodon: pteranodon
            })
        }
        if (targets.length > 1) {
            let target = targets[1];
            target.increaseAttack(power);
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: random
            })
        }
        this.superFaint(gameApi, tiger);
        
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