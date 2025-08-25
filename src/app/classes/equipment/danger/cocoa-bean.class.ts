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
        let originalBeforeAttack =pet.beforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi, tiger) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi, tiger);
            }
            
            if (tiger) {
                return;
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
            
            // Create proper Pet instance (equipment consumed)
            let transformedPet = this.petService.createPet({
                name: randomEnemy.name,
                attack: randomEnemy.attack,
                health: randomEnemy.health,
                mana: pet.mana,
                exp: pet.exp,
                equipment: null
            }, pet.parent);
            
            // Copy special state that needs to be preserved
            if (randomEnemy.swallowedPets && randomEnemy.swallowedPets.length > 0) {
                transformedPet.swallowedPets = [];
                // Recreate swallowed pets with correct parent
                for (let swallowedPet of randomEnemy.swallowedPets) {
                    let newSwallowedPet = this.petService.createPet({
                        name: swallowedPet.name,
                        attack: swallowedPet.attack,
                        health: swallowedPet.health,
                        mana: swallowedPet.mana,
                        exp: swallowedPet.exp,
                        equipment: swallowedPet.equipment
                    }, pet.parent);
                    transformedPet.swallowedPets.push(newSwallowedPet);
                }
            }
            
            // Copy private counters if they exist (for counter-based abilities)
            if ((randomEnemy as any).attackCounter !== undefined) {
                (transformedPet as any).attackCounter = (randomEnemy as any).attackCounter;
            }
            
            // Copy ability usage tracking
            transformedPet.abilityUses = 0;
            transformedPet.maxAbilityUses = randomEnemy.maxAbilityUses;

            if ((randomEnemy as any).hurtThisBattle !== undefined) {
                (transformedPet as any).hurtThisBattle = (randomEnemy as any).hurtThisBattle;
            }
            this.logService.createLog({
                message: `${pet.name} transformed into ${transformedPet.name} (Cocoa Bean)`,
                type: 'equipment',
                player: pet.parent,
                randomEvent: enemies.length > 1
            });
            //TO DO: Copy Friend Summoned, frined sold, roll etc
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