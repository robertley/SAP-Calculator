import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";

// apparently when a pet is kiled from snipes honey spawns are less predictable
// this ensures that honey spawns are in the front, for now
export class Honey extends Equipment {
    name = 'Honey';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint =pet.afterFaint?.bind(pet);
        pet.afterFaint = (gameApi, tiger) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Honey') {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let bee = new Bee(this.logService, this.abilityService, pet.parent, null, null, 0);
                
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned Bee (Honey)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent
                    }
                )
                if (pet.parent.summonPet(bee, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(bee);
                }
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