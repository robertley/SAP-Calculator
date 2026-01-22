import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { LogService } from 'app/services/log.service';

export class CaramelAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment, logService: LogService) {
    super({
      name: 'CaramelAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Caramel is one-time use (removes all Caramels after use)
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    // Find all friendly pets with Caramel equipment
    let caramelPets = owner.parent.petArray.filter(
      (p) => p.alive && p.equipment?.name === 'Caramel',
    );

    if (caramelPets.length === 0) {
      return;
    }

    // Calculate total damage (3 damage per Caramel)
    let totalDamage = caramelPets.length * 3;

    // Find highest health enemy
    let highestHealthResult = owner.parent.opponent.getHighestHealthPet();
    let targetPet = highestHealthResult.pet;

    if (targetPet == null) {
      return;
    }

    // Deal combined damage to highest health enemy
    owner.snipePet(
      targetPet,
      totalDamage,
      highestHealthResult.random,
      false,
      false,
      true,
      false,
    );

    // Remove Caramel equipment from all pets that have it
    for (let caramelPet of caramelPets) {
      caramelPet.removePerk();
      this.logService.createLog({
        message: `${caramelPet.name} lost Caramel equipment`,
        type: 'ability',
        player: owner.parent,
        tiger: false,
      });
    }
  }
}
