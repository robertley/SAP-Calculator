import { FaintService } from "../../services/faint.service";
import { LogService } from "../../services/log.servicee";
import { SummonedService } from "../../services/summoned.service";
import { Equipment, EquipmentClass } from "../equipment.class";
import { Pet } from "../pet.class";
import { Bee } from "../pets/bee.class";

export class Honey extends Equipment {
    name = 'Honey';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let bee = new Bee(this.logService, this.faintService, this.summonedService, pet.parent, null, null, 0);
        pet.parent.spawnPet(bee, pet);

        this.logService.createLog(
            {
                message: `${pet.name} Spawned Bee (Honey)`,
                type: "ability",
                player: pet.parent
            }
        )
        this.summonedService.triggerSummonedEvents(bee);
    }

    constructor(
        protected logService: LogService,
        protected faintService: FaintService,
        protected summonedService: SummonedService
    ) {
        super()
    }
}