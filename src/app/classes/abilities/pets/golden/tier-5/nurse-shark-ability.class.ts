import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class NurseSharkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'NurseSharkAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (owner.parent.trumpets == 0) {
          return false;
        }
        return true;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let power = Math.min(owner.parent.trumpets, 6) * 3;
    let targetResp = owner.parent.opponent.getRandomPets(
      this.level,
      [],
      false,
      true,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }

    owner.parent.spendTrumpets(
      Math.min(owner.parent.trumpets, 6),
      owner,
      pteranodon,
    );
    for (let target of targets) {
      owner.snipePet(target, power, targetResp.random, tiger, pteranodon);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NurseSharkAbility {
    return new NurseSharkAbility(newOwner, this.logService);
  }
}
