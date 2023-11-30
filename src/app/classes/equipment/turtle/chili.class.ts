import { cloneDeep } from "lodash";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Chili extends Equipment {
    name = 'Chili';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let attackPet = attackedPet.parent.getPetAtPosition(1);
        if (attackPet == null) {
            return;
        }

        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }
        
        let damageResp = pet.calculateDamgae(attackPet, 5);
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
            message: message += ` (Chili).`,
            type: 'attack',
            player: pet.parent
        })

        // hurt ability
        if (attackPet.hurt != null && damage > 0) {
            this.abilityService.setHurtEvent({
                callback: attackPet.hurt.bind(attackPet),
                priority: attackPet.attack,
                player: attackPet.parent,
                callbackPet: attackedPet
            })
        }
        // knockout
        if (attackPet.health < 1 && pet.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: pet.knockOut.bind(pet),
                priority: pet.attack,
                callbackPet: attackPet
            })
        }

        // friend hurt ability
        if (attackPet.alive && damage > 0) {
            this.abilityService.triggerFriendHurtEvents(attackedPet.parent, attackedPet);
        }

        // enemy hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(pet.parent, attackPet);
        }
    }

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super()
    }
}