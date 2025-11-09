import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { WhiteTruffleAbility } from "../../abilities/equipment/danger/white-truffle-ability.class";

export class WhiteTruffle extends Equipment {
    name = 'White Truffle';
    equipmentClass = 'faint' as EquipmentClass;

    callback = (pet: Pet) => {
        // Add White Truffle ability using dedicated ability class
        pet.addAbility(new WhiteTruffleAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService,
    ) {
        super();
    }
}