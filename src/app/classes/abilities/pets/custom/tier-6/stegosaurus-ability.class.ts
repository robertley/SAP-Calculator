import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class StegosaurusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'StegosaurusAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { gameApi, tiger, pteranodon } = context;
    const buffAmount = this.level * 10;
    const target = owner.parent.petArray.find(
      (pet) => pet && pet !== owner && pet.alive && !pet.equipment,
    );

    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    target.increaseAttack(buffAmount);
    target.increaseHealth(buffAmount);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buffAmount}/+${buffAmount} at start of battle.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): StegosaurusAbility {
    return new StegosaurusAbility(newOwner, this.logService);
  }
}
