import { Ability, AbilityContext } from '../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class MimicOctopusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MimicOctopusAbility',
      owner: owner,
      triggers: ['ThisAttacked'],
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

    let targetsResp = owner.parent.opponent.getLowestHealthPets(
      owner.level,
      undefined,
      owner,
    );

    for (let target of targetsResp.pets) {
      let damage = 4;
      owner.snipePet(target, damage, targetsResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MimicOctopusAbility {
    return new MimicOctopusAbility(newOwner, this.logService);
  }
}
