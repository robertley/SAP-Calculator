import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class CocoaBeanAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, petService: PetService) {
        super({
            name: 'CocoaBeanAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Equipment is consumed after one use
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            // Get random enemy
            let enemies = owner.parent.opponent.petArray.filter(enemy => enemy.alive);
            if (enemies.length == 0) {
                owner.removePerk();
                return;
            }

            let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];

            // Create proper Pet instance (equipment consumed)
            let transformedPet = this.petService.createPet({
                name: randomEnemy.name,
                attack: randomEnemy.attack,
                health: randomEnemy.health,
                mana: owner.mana,
                exp: owner.exp,
                equipment: null
            }, owner.parent);

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
                    }, owner.parent);
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

            let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';
            this.logService.createLog({
                message: `${owner.name} transformed into ${transformedPet.name} (Cocoa Bean)${multiplierMessage}`,
                type: 'equipment',
                player: owner.parent,
                randomEvent: enemies.length > 1
            });

            // TODO: Copy Friend Summoned, friend sold, roll etc
            owner.parent.transformPet(owner, transformedPet);
        }
    }
}