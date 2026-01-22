import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SleipnirAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SleipnirAbility',
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

    let manaAmt = Math.floor(owner.attack / 2);
    let targetsResp = owner.parent.getFurthestUpPets(
      this.level,
      [owner],
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      if (target != null) {
        this.logService.createLog({
          message: `${owner.name} gave ${target.name} ${manaAmt} mana.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: targetsResp.random,
        });

        target.increaseMana(manaAmt);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SleipnirAbility {
    return new SleipnirAbility(newOwner, this.logService);
  }
}
