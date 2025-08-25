import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Tasty extends Equipment {
    name = 'Tasty';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalAfterFaint =pet.afterFaint?.bind(pet);
        pet.afterFaint = (gameApi, tiger) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Tasty') {
                return;
            }
            
            // Get random enemy
            let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
            let enemies = opponent.petArray.filter(enemy => enemy.alive);
            if (enemies.length == 0) {
                return;
            }
            
            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            
            // Give random enemy +2 attack and +2 health
            randomEnemy.increaseAttack(2);
            randomEnemy.increaseHealth(2);
            
            this.logService.createLog({
                message: `${pet.name} gave ${randomEnemy.name} +2 attack and +2 health (Tasty)`,
                type: 'equipment',
                player: pet.parent,
                randomEvent: enemies.length > 1
            });
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super();
    }
}