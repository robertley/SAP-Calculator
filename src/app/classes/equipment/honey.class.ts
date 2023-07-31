import { AbilityService } from "../../services/ability.service";
import { LogService } from "../../services/log.servicee";
import { Equipment, EquipmentClass } from "../equipment.class";
import { Pet } from "../pet.class";
import { Bee } from "../pets/hidden/bee.class";

export class Honey extends Equipment {
    name = 'Honey';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let bee = new Bee(this.logService, this.abilityService, pet.parent, null, null, 0);
        pet.parent.summonPet(bee, pet.savedPosition);

        this.logService.createLog(
            {
                message: `${pet.name} Spawned Bee (Honey)`,
                type: "ability",
                player: pet.parent
            }
        )
        this.abilityService.triggerSummonedEvents(bee);
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super()
    }
}