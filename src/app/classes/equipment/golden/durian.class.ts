import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Durian extends Equipment {
    name = 'Durian';
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
                
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog({
                    message: `${this.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})${multiplierMessage}`,
                    type: 'ability',
                    player: pet.parent,
                    randomEvent: resp.random
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