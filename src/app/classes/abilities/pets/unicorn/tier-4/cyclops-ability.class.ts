import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class CyclopsAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CyclopsAbility',
      owner: owner,
      triggers: ['FriendLeveledUp'],
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

    let manaGain = this.level * 2;
    let manaTargetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let manaTarget = manaTargetResp.pet;
    if (manaTarget == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${manaTarget.name} ${manaGain} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: manaTargetResp.random,
    });
    manaTarget.increaseMana(manaGain);

    if (this.currentUses < this.level) {
      let expTargetResp = owner.parent.getSpecificPet(owner, triggerPet);
      let expTarget = expTargetResp.pet;
      this.logService.createLog({
        message: `${owner.name} gave ${expTarget.name} 1 exp.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: expTargetResp.random,
      });

      expTarget.increaseExp(1);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CyclopsAbility {
    return new CyclopsAbility(newOwner, this.logService);
  }
}
