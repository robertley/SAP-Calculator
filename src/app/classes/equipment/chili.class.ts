import { LogService } from "../../services/log.servicee";
import { Equipment, EquipmentClass } from "../equipment.class";
import { Pet } from "../pet.class";

export class Chili extends Equipment {
    name = 'Chili';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let attackPet = attackedPet.parent.getPetAtPosition(1);
        if (attackPet == null) {
            return;
        }
        
        attackPet.health -= 5;

        this.logService.createLog({
            message: `${pet.name} attacked ${attackPet.name} for 5 (Chili)`,
            type: 'attack',
            player: pet.parent
        })
    }

    constructor(private logService: LogService) {
        super()
    }
}