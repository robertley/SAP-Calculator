import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { cloneDeep } from "lodash";

export class CocoaBean extends Equipment {
    name = 'Cocoa Bean';
    tier = 5;
    equipmentClass = 'beforeAttack' as EquipmentClass;
    power = 0;
    originalPower = 0;
    uses = 1;
    originalUses = 1;
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Cocoa Bean') {
                return;
            }
            
            // Get random enemy
            let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
            let enemies = opponent.petArray.filter(enemy => enemy.alive);
            if (enemies.length == 0) {
                pet.removePerk();
                return;
            }
            
            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            
            // Create exact copy of enemy (equipment consumed)
            let transformedPet = this.petService.createPet({
                name: randomEnemy.name,
                attack: randomEnemy.attack,
                health: randomEnemy.health,
                mana: randomEnemy.mana,
                exp: randomEnemy.exp,
                equipment: null
            }, pet.parent);
            
            this.logService.createLog({
                message: `${pet.name} transformed into ${transformedPet.name} (Cocoa Bean)`,
                type: 'equipment',
                player: pet.parent,
                randomEvent: enemies.length > 1
            });
            
            pet.parent.transformPet(pet, transformedPet);
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super();
    }
}