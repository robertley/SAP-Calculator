import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Firefly extends Pet {
    name = "Firefly";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let range = this.level;
        let opponent = getOpponent(gameApi, this.parent);
        let myPlayer = this.parent;
        
        // Get all pets from both teams within range
        let allTargets: Pet[] = [];
        
        // Add opponent pets
        for (let pet of opponent.petArray) {
            if (pet.alive && Math.abs(pet.position - this.savedPosition) <= range) {
                allTargets.push(pet);
            }
        }
        
        // Add friendly pets
        for (let pet of myPlayer.petArray) {
            if (pet.alive && pet !== this && Math.abs(pet.position - this.savedPosition) <= range) {
                allTargets.push(pet);
            }
        }
        
        // Deal 1 damage to all targets
        for (let target of allTargets) {
            this.snipePet(target, 1, true, tiger);
        }
        
        this.logService.createLog(
            {
                message: `${this.name} deals 1 damage to ALL pets within ${range} space${range > 1 ? 's' : ''}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        );
        
        super.superAfterFaint(gameApi, tiger, pteranodon);
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