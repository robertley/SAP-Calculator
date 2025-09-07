import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";

export class GoblinShark extends Pet {
    name = "Goblin Shark";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 6;
    health = 3;
    
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let swallowThreshold = this.level * 6;
        
        // Loop through enemy pets from front to back to find first swallowable target
        for (let targetPet of this.parent.opponent.petArray) {
            if (!targetPet.alive) {
                continue;
            }
            
            if (targetPet.health <= swallowThreshold) {
                // Create a copy of the target pet to swallow
                let swallowPet = this.petService.createPet({
                    name: targetPet.name,
                    attack: targetPet.attack,
                    health: targetPet.health,
                    exp: targetPet.exp,
                    equipment: null,
                    mana: 0
                }, this.parent);
                
                this.swallowedPets.push(swallowPet);
                targetPet.health = 0;
                
                this.logService.createLog({
                    message: `${this.name} swallowed ${targetPet.name}`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
                break; // Stop after swallowing one pet
            }
        }
        
        this.superStartOfBattle(gameApi, tiger);
    }
    
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        while (this.swallowedPets.length > 0) {
            let pet = this.swallowedPets.shift();
            let summonResult = this.parent.summonPet(pet, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${this.name} summoned ${pet.name} (level ${pet.level}).`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                })
                
                this.abilityService.triggerFriendSummonedEvents(pet);
            }
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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