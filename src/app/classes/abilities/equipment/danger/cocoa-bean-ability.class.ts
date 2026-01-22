import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { InjectorService } from 'app/services/injector.service';

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
    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);

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

      let equipmentInstance: Equipment = null;
      if (randomEnemy.equipment) {
        if (randomEnemy.equipment.equipmentClass?.startsWith('ailment')) {
          equipmentInstance = equipmentService
            .getInstanceOfAllAilments()
            .get(randomEnemy.equipment.name);
        } else {
          equipmentInstance = equipmentService
            .getInstanceOfAllEquipment()
            .get(randomEnemy.equipment.name);
        }
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
