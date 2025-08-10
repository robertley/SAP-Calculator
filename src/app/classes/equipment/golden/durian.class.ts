import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Durian extends Equipment {
    name = 'Durian';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Durian') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
            }
            
            for (let i = 0; i < multiplier; i++) {
                let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
                let resp = opponent.getHighestHealthPet();
                let targetPet = resp.pet;
                if (targetPet == null) {
                    console.warn("durian didn't find target");
                    continue;
                }

                let power = .33;
                let reducedTo = Math.max(1, Math.floor(targetPet.health * (1 - power)));
                targetPet.health = reducedTo;
                
                let pantherMessage = '';
                if (pet instanceof Panther && i > 0) {
                    pantherMessage = ' (Panther)';
                }
                
                this.logService.createLog({
                    message: `${this.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})${pantherMessage}`,
                    type: 'ability',
                    player: pet.parent,
                    randomEvent: resp.random
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