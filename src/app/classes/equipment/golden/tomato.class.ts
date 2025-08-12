import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Tomato extends Equipment {
    name = 'Tomato';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Tomato') {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
                let attackPet = opponent.getLastPet();
                if (attackPet == null) {
                    console.warn("tomato didn't find target");
                    continue;
                }
                
                let damageResp = pet.calculateDamgae(attackPet, pet.getManticoreMult(), 10, true);
                let defenseEquipment = damageResp.defenseEquipment;
                let damage = damageResp.damage;

                attackPet.health -= damage;

                let message = `${pet.name} sniped ${attackPet.name} for ${damage}`;
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';

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
                    message: message += ` (Tomato)${multiplierMessage}.`,
                    type: 'attack',
                    player: pet.parent
                })

                // hurt ability
                if (attackPet.hurt != null) {
                    this.abilityService.setHurtEvent({
                        callback: attackPet.hurt.bind(attackPet),
                        priority: attackPet.attack,
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
            pet.removePerk();
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}