import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { AbilityService } from "../../../services/ability.service";
import { PetService } from "../../../services/pet.service";
export class Mushroom extends Equipment {
    name = 'Mushroom';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let newPet = this.petService.createDefaultVersionOfPet(pet, 1, 1);
        this.abilityService.setSpawnEvent({
            callback: () => {
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${newPet.name} (level ${newPet.level}) (Mushroom)`,
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

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super()
    }
}

