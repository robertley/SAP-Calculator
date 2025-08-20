import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Strawberry } from "../../../equipment/star/strawberry.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pelican extends Pet {
    name = "Pelican";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let swallowCount = this.level;
        let swallowed = 0;
        
        // Look for friends ahead with Strawberry equipment
        let currentPet = this.petAhead;
        while (currentPet && swallowed < swallowCount) {
            if (currentPet.equipment instanceof Strawberry) {
                // Create Salmon copy to swallow (transform the swallowed pet into Salmon)
                let salmon = this.petService.createPet({
                    name: 'Salmon',
                    attack: currentPet.attack,
                    health: currentPet.health,
                    exp: this.minExpForLevel,
                    equipment: null,
                    mana: 0
                }, this.parent);
                
                this.swallowedPets.push(salmon);
                currentPet.health = 0;
                
                this.logService.createLog({
                    message: `${this.name} swallowed ${currentPet.name}`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
                
                swallowed++;
            }
            currentPet = currentPet.petAhead;
        }
        
        this.superStartOfBattle(gameApi, tiger);
    }

    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        while (this.swallowedPets.length > 0) {
            let pet = this.swallowedPets.shift();
            this.logService.createLog({
                message: `${this.name} summoned ${pet.name} (level ${pet.level}).`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
            if (this.parent.summonPet(pet, this.savedPosition)) {
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