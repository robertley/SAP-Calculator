import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class FoamSwordAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FoamSwordAbility',
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

    // Mirror Foam Sword toy behavior
    let opponent = owner.parent.opponent;
    for (let i = 0; i < this.level; i++) {
      let lowestHealthResp = opponent.getLowestHealthPet();
      owner.snipePet(lowestHealthResp.pet, 5, lowestHealthResp.random, tiger);
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FoamSwordAbility {
    return new FoamSwordAbility(newOwner, this.logService);
  }
}
