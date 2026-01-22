import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Weak } from '../../../equipment/ailments/weak.class';

export class WitchBroomAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WitchBroomAbility',
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

    // Mirror Witch Broom toy behavior
    let opponent = owner.parent.opponent;
    let excludePets = opponent.getPetsWithEquipment('any');
    let targetsResp = opponent.getRandomPets(
      this.level,
      excludePets,
      false,
      true,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      target.givePetEquipment(new Weak());
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WitchBroomAbility {
    return new WitchBroomAbility(newOwner, this.logService);
  }
}
