import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Icky } from '../../../../equipment/ailments/icky.class';

export class VisitorAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VisitorAbility',
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

    let targetResp = owner.parent.getPetsWithinXSpaces(owner, this.level);
    let targets = targetResp.pets.filter(
      (pet) => pet.equipment?.name !== 'Icky',
    );
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      target.givePetEquipment(new Icky());
      this.logService.createLog({
        message: `${owner.name} made ${target.name} Icky.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VisitorAbility {
    return new VisitorAbility(newOwner, this.logService);
  }
}
