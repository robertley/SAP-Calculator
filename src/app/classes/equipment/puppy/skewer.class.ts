import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Skewer extends Equipment {
    name = 'Skewer';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        this.skewer(pet, attackedPet, 1);
        this.skewer(pet, attackedPet, 2);
    }

    constructor(private logService: LogService) {
        super()
    }

    skewer(pet: Pet, attackedPet: Pet, position: number) {
        let attackPet = attackedPet.parent.getPetAtPosition(position);
        if (attackPet == null) {
            return;
        }

        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }
        
        let damageResp = pet.calculateDamgae(attackPet, 3);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage * multiplier;

        attackPet.health -= damage;

        let message = `${pet.name} attacks ${attackPet.name} for ${damage}`;

        if (pet instanceof Panther) {
            message += ` x${multiplier} (Panther)`;
        }

        if (defenseEquipment != null) {
            attackPet.useDefenseEquipment();
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            message += ` (${defenseEquipment.name} ${sign}${power})`;

            if (attackedPet instanceof Panther) {
                let multiplier = 1 + pet.level;
                message += ` x${multiplier} (Panther)`;
            }
    
        }

        this.logService.createLog({
            message: message += ` (Skewer).`,
            type: 'attack',
            player: pet.parent
        })
    }
}