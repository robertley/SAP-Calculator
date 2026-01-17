import { LogService } from "../../../services/log.service";
import { AbilityService } from "../../../services/ability/ability.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { GrosMichelBananaAbility } from "../../abilities/equipment/danger/gros-michel-banana-ability.class";

export class GrosMichelBanana extends Equipment {
    name = 'Gros Michel Banana';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        // Add Gros Michel Banana ability using dedicated ability class
        pet.addAbility(new GrosMichelBananaAbility(pet, this, this.logService, this.abilityService));
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super();
    }
}