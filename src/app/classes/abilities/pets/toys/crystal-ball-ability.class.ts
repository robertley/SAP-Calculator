import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class CrystalBallAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CrystalBallAbility',
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

    // Mirror Crystal Ball toy behavior
    let targetsResp = owner.parent.getFurthestUpPet(owner);
    let target = targetsResp.pet;
    if (target == null) {
      return;
    }
    let power = this.level * 2;
    target.increaseMana(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CrystalBallAbility {
    return new CrystalBallAbility(newOwner, this.logService);
  }
}
