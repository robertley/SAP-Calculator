import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class GoldenEgg extends Equipment {
    name = 'Golden Egg';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Golden Egg') {
                return;
            }
            
            let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
            let opponentPets = opponent.petArray;
            let attackPet: Pet = null;
            for (let opponentPet of opponentPets) {
                if (opponentPet.alive) {
                    attackPet = opponentPet;
                    break;
                }
            }

            if (attackPet == null) {
                console.warn("golden egg didn't find target");
                return;
            }
            
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
            }
            
            for (let i = 0; i < multiplier; i++) {
                let damageResp = pet.calculateDamgae(attackPet, pet.getManticoreMult(), 5, true);
                let defenseEquipment = damageResp.defenseEquipment;
                let damage = damageResp.damage;

                attackPet.health -= damage;

                let message = `${pet.name} sniped ${attackPet.name} for ${damage}`;
                let pantherMessage = '';
                if (pet instanceof Panther && i > 0) {
                    pantherMessage = ` (Panther)`;
                }

                if (defenseEquipment != null) {
                    attackPet.useDefenseEquipment();
                    let power = Math.abs(defenseEquipment.power);
                    let sign = '-';
                    if (defenseEquipment.power < 0) {
                        sign = '+';
                    }
                    message += ` (${defenseEquipment.name} ${sign}${power})`;
                }

                this.logService.createLog({
                    message: message += ` (Golden Egg)${pantherMessage}.`,
                    type: 'attack',
                    player: pet.parent
                })

                // hurt ability
                if (attackPet.hurt != null) {
                    this.abilityService.setHurtEvent({
                        callback: attackPet.hurt.bind(attackPet),
                        priority: pet.attack,
                        player: attackPet.parent,
                        callbackPet: attackPet
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
                if (attackPet.alive) {
                    this.abilityService.triggerFriendHurtEvents(attackPet.parent, attackPet);
                }

                // enemy hurt ability
                if (attackPet.alive && damage > 0) {
                    this.abilityService.triggerEnemyHurtEvents(pet.parent, attackPet);
                }
            }
            
            // Remove equipment after use
            pet.givePetEquipment(null);
        }
    }
    

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}