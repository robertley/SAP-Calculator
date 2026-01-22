import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Weasel } from '../../../../pets/golden/tier-3/weasel.class';

export class TaitaShrewAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'TaitaShrewAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;

    if (!target) {
      return;
    }

    let weasel = new Weasel(
      this.logService,
      this.abilityService,
      owner.parent,
      target.health,
      target.attack,
      target.mana,
      target.exp,
      target.equipment,
    );

    this.logService.createLog({
      message: `${owner.name} transformed ${target.name} into ${weasel.name} (level ${this.level}).`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    owner.parent.transformPet(target, weasel);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TaitaShrewAbility {
    return new TaitaShrewAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
