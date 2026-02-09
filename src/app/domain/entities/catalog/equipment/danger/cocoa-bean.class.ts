import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { cloneEquipment } from 'app/runtime/equipment-clone';


export class CocoaBean extends Equipment {
  name = 'Cocoa Bean';
  tier = 5;
  equipmentClass = 'beforeAttack' as EquipmentClass;
  power = 0;
  originalPower = 0;
  uses = 1;
  originalUses = 1;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Cocoa Bean ability using dedicated ability class
    pet.addAbility(
      new CocoaBeanAbility(pet, equipment, this.logService, this.petService),
    );
  };

  constructor(
    protected logService: LogService,
    protected petService: PetService,
  ) {
    super();
  }
}


export class CocoaBeanAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private petService: PetService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    petService: PetService,
  ) {
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
      },
    });
    this.equipment = equipment;
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      // Get random enemy
      let enemies = owner.parent.opponent.petArray.filter(
        (enemy) => enemy.alive,
      );
      if (enemies.length == 0) {
        owner.removePerk();
        return;
      }

      let randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];

      let equipmentInstance: Equipment | null = null;
      if (randomEnemy.equipment) {
        equipmentInstance = cloneEquipment(randomEnemy.equipment);
      }

      // Create proper Pet instance
      let transformedPet = this.petService.createPet(
        {
          name: randomEnemy.name,
          attack: randomEnemy.attack,
          health: randomEnemy.health,
          mana: owner.mana,
          exp: randomEnemy.exp,
          equipment: equipmentInstance,
        },
        owner.parent,
      );
      transformedPet.mana = owner.mana;

      // Copy special state that needs to be preserved
      if (randomEnemy.swallowedPets && randomEnemy.swallowedPets.length > 0) {
        transformedPet.swallowedPets = [];
        // Recreate swallowed pets with correct parent
        for (let swallowedPet of randomEnemy.swallowedPets) {
          let newSwallowedPet = this.petService.createPet(
            {
              name: swallowedPet.name,
              attack: swallowedPet.attack,
              health: swallowedPet.health,
              mana: swallowedPet.mana,
              exp: swallowedPet.exp,
              equipment: swallowedPet.equipment,
            },
            owner.parent,
          );
          transformedPet.swallowedPets.push(newSwallowedPet);
        }
      }

      transformedPet.abilityCounter = randomEnemy.abilityCounter;
      transformedPet.timesHurt = randomEnemy.timesHurt;
      transformedPet.timesAttacked = randomEnemy.timesAttacked;
      transformedPet.battlesFought = randomEnemy.battlesFought;
      transformedPet.copyAbilities(randomEnemy, 'Pet');
      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${owner.name} transformed into ${transformedPet.name} (Cocoa Bean)${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
        randomEvent: enemies.length > 1,
      });

      owner.parent.transformPet(owner, transformedPet);
    }
  }
}





