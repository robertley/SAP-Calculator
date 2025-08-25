import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Squash extends Equipment {
    name = 'Squash';
    tier = 3;
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
            
            for (let i = 0; i < this.multiplier; i++) {           
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
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                this.logService.createLog({
                    message: `${this.name} reduced ${targetPet.name} health by ${power} (${reducedTo})${multiplierMessage}`,
                    type: 'equipment',
                    player: pet.parent,
                });
            }
            
            // Remove equipment after use
            pet.removePerk();
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}