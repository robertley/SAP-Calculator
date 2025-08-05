import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { AbilityService } from "../../../services/ability.service";
import { PetService } from "../../../services/pet.service";
import { Panther } from "../../pets/puppy/tier-5/panther.class";
// TODO mushroom bug spawning as level 1 even when level 3?
export class Mushroom extends Equipment {
    name = 'Mushroom';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }
        for (let i = 0; i < multiplier; i++) {
            let newPet = this.petService.createDefaultVersionOfPet(pet, 1, 1);
            this.abilityService.setSpawnEvent({
                callback: () => {       
                    let pantherMessage = '';
                    if (i > 0) {
                        pantherMessage = ` (Panther)`;
                    }

                    this.logService.createLog(
                        {
                            message: `${pet.name} Spawned ${newPet.name} (level ${newPet.level}) (Mushroom)${pantherMessage}`,
                            type: "ability",
                            player: pet.parent
                        }
                    )
            
                    if (pet.parent.summonPet(newPet, pet.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(newPet);
                    }
                },
                priority: -1
            })
        }
        
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super()
    }
}

