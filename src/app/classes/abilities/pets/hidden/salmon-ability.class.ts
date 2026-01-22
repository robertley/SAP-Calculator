import { Ability, AbilityContext } from '../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SalmonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SalmonAbility',
      owner: owner,
      triggers: ['ThisSummoned'],
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

    // Calculate number of attacks based on health (every 25 health)
    let attacks = 1 + Math.floor(owner.health / 25);

    let damage = this.level * 5;

    for (let i = 0; i < attacks; i++) {
      let targetResp = owner.parent.opponent.getRandomPet(
        [],
        false,
        true,
        false,
        owner,
      );
      if (targetResp.pet) {
        owner.snipePet(targetResp.pet, damage, targetResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SalmonAbility {
    return new SalmonAbility(newOwner, this.logService);
  }
}
