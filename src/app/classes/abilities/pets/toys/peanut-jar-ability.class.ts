import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PeanutButter } from 'app/classes/equipment/hidden/peanut-butter';
export class PeanutJarAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PeanutJarAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Peanut Jar toy behavior
    let excludePets = owner.parent.getPetsWithEquipment('Peanut Butter');
    let targetsResp = owner.parent.getLowestAttackPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.givePetEquipment(new PeanutButter());
      this.logService.createLog({
        message: `Peanut Jar Ability gave ${pet.name} PeanutButter.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PeanutJarAbility {
    return new PeanutJarAbility(newOwner, this.logService);
  }
}
