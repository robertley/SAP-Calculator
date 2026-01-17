import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { PopcornAbility } from "../../abilities/equipment/star/popcorn-ability.class";

export class Popcorn extends Equipment {
    name = 'Popcorn';
    equipmentClass: EquipmentClass = 'afterFaint';
    callback = (pet: Pet) => {
        // Add Popcorn ability using dedicated ability class
        pet.addAbility(new PopcornAbility(pet, this, this.logService, this.petService));
    }

    constructor(
        protected logService: LogService,
        protected petService: PetService,
        protected gameService: GameService

    ) {
        super()
    }

}