import { flatMap } from "lodash";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Caramel extends Equipment {
    name = 'Caramel';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack =pet.beforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi, tiger) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }

            // Check if equipment is still equipped
            if (pet.equipment !== this) {
                return;
            }
            
            // Find all friendly pets with Caramel equipment
            let caramelPets = pet.parent.petArray.filter(p => 
                p.alive && p.equipment?.name === 'Caramel'
            );
            
            if (caramelPets.length === 0) {
                return;
            }
            
            // Calculate total damage (3 damage per Caramel)
            let totalDamage = caramelPets.length * 3;
            
            // Find highest health enemy
            let opponent = pet.parent === gameApi.player ? gameApi.opponet : gameApi.player;
            let highestHealthResult = opponent.getHighestHealthPet();
            let targetPet = highestHealthResult.pet;
            
            if (targetPet == null) {
                return;
            }
             // Deal combined damage to highest health enemy
            pet.snipePet(targetPet, totalDamage, highestHealthResult.random, tiger, false, true, false);        

            // Remove Caramel equipment from all pets that have it
            for (let caramelPet of caramelPets) {
                caramelPet.removePerk();
                this.logService.createLog({
                    message: `${caramelPet.name} lost Caramel equipment`,
                    type: 'ability',
                    player: pet.parent,
                    tiger: false
                });
            }
           
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}