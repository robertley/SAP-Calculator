import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Coconut } from '../../../equipment/turtle/coconut.class';

export class AirPalmTreeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AirPalmTreeAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    // Mirror Air Palm Tree toy behavior
    let excludePets = owner.parent.getPetsWithEquipment('Coconut');
    let targetsResp = owner.parent.getHighestAttackPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.givePetEquipment(new Coconut());
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Coconut.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AirPalmTreeAbility {
    return new AirPalmTreeAbility(newOwner, this.logService);
  }
}
