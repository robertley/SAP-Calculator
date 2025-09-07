import { shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
        let excludePets = this.parent.petArray.filter(pet => {
            return pet == this || pet.equipment?.name != 'Strawberry'
        });
        let targetResp = this.parent.getRandomPets(3, excludePets, null, null, this);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return
        }
        for (let target of targets) {
            //TO DO: Double check if this should be possilbe, and change to actually activating strawberry
            if (target.equipment.name != 'Strawberry') {
                continue;
            }
            this.logService.createLog({
                message: `${this.name} activated ${target.name}'s Strawberry.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random,
                pteranodon: pteranodon
            })
            let backMostPetResp = target.parent.getLastPet(null, target);
            let backMostPet = backMostPetResp.pet;
            let power = this.level + backMostPet.equipment.multiplier - 1;
            backMostPet.increaseAttack(power);
            backMostPet.increaseHealth(power);
            this.logService.createLog({
                message: `${target.name} gave ${backMostPet.name} ${power} attack ${power} health (Strawberry) (x${this.level} ${this.name}).`,
                type: 'equipment',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
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