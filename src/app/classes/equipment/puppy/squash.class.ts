import { Panther } from "app/classes/pets/puppy/tier-5/panther.class";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Squash extends Equipment {
    name = 'Squash';
    tier = 3;
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }

            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Squash') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
            }
            for (let i = 0; i < multiplier; i++) {           
                // Squash targets the pet being attacked, need to get front pet from opponent
                let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
                let targetPet = opponent.pet0;
                if (targetPet == null || !targetPet.alive) {
                    console.warn("squash didn't find target");
                    return;
                }

                let power = 6;
                let reducedTo = Math.max(1, targetPet.health - power);
                targetPet.health = reducedTo;
                this.logService.createLog({
                    message: `${this.name} reduced ${targetPet.name} health by ${power} (${reducedTo})`,
                    type: 'equipment',
                    player: pet.parent,
                });
            }
            
            // Remove equipment after use
            pet.givePetEquipment(null);
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}