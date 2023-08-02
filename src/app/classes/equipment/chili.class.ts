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
        
        let damageResp = pet.calculateDamgae(attackPet, 5);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        attackPet.health -= damage;

        let message = `${pet.name} attacks ${attackPet.name} for ${damage}`;
        if (defenseEquipment != null) {
            attackPet.useDefenseEquipment();
            message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
        }

        this.logService.createLog({
            message: message += ` (Chili).`,
            type: 'attack',
            player: pet.parent
        })
    }

    constructor(private logService: LogService) {
        super()
    }
}