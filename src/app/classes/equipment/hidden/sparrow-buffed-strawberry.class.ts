import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Strawberry } from "../star/strawberry.class";

// TO DO: verify what happens when pet with buffed strawberry dies in 1 shot, does it give +1/+1 still?

export class SparrowBuffedStrawberry extends Equipment {
    name = 'Strawberry (Sparrow Buff)';
    equipmentClass: EquipmentClass = 'shield'; 
    uses = 2;
    originalUses = 2;

    public originalEquipment: Equipment;

    callback: (pet: Pet) => void;

    constructor(power: number, originalStrawberry: Strawberry, protected logService: LogService, protected abilityService: AbilityService) {
        super();
        this.power = power;
        this.originalPower = power;
        this.callback = originalStrawberry.callback.bind(this);
        this.originalEquipment = originalStrawberry;
    }
}