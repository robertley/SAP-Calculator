import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Baguette extends Equipment {
    name = 'Baguette';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }

            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Baguette') {
                return;
            }
            
            // Find front-most enemy with equipment
            let opponent = pet.parent === gameApi.player ? gameApi.opponet : gameApi.player;
            let frontMostEnemy = pet.parent.opponent.furthestUpPet;
            
            if (frontMostEnemy == null) {
                return;
            }
            
            // Remove the front-most enemy's equipment
            if (frontMostEnemy.equipment != null) {
                let removedEquipment = frontMostEnemy.equipment.name;
                frontMostEnemy.removePerk();
                
                this.logService.createLog({
                    message: `${pet.name} removed ${removedEquipment} from ${frontMostEnemy.name} (Baguette)`,
                    type: 'equipment',
                    player: pet.parent,
                });
                pet.removePerk();
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