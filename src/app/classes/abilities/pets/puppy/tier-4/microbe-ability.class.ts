import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Weak } from '../../../../equipment/ailments/weak.class';

export class MicrobeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MicrobeAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let targetsResp = owner.parent.getPetsWithinXSpaces(owner, this.level * 3);
    let targets = targetsResp.pets.filter(
      (pet) => pet.equipment?.name !== 'Weak',
    );
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      if (!pet.alive) {
        continue;
      }
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
      pet.givePetEquipment(new Weak());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MicrobeAbility {
    return new MicrobeAbility(newOwner, this.logService);
  }
}
