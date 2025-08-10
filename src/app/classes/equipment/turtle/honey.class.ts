import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

// apparently when a pet is kiled from snipes honey spawns are less predictable
// this ensures that honey spawns are in the front, for now
export class Honey extends Equipment {
    name = 'Honey';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Honey') {
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }

            for (let i = 0; i < multiplier; i++) {
                let bee = new Bee(this.logService, this.abilityService, pet.parent, null, null, 0);
                
                let pantherMessage = '';
                if (i > 0) {
                    pantherMessage = ` (Panther)`;
                }
                
                this.abilityService.setSpawnEvent({
                    callback: () => {
                        this.logService.createLog(
                            {
                                message: `${pet.name} Spawned Bee (Honey)${pantherMessage}`,
                                type: "ability",
                                player: pet.parent
                            }
                        )
                        if (pet.parent.summonPet(bee, pet.savedPosition)) {
                            this.abilityService.triggerSummonedEvents(bee);
                        }
                    },
                    priority: pet.attack
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