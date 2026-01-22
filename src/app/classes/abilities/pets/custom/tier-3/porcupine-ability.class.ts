import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PorcupineAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Porcupine Ability',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet } = context;
    const owner = this.owner;

    if (triggerPet && triggerPet.alive && triggerPet.parent !== owner.parent) {
      const damage = 3 * this.level;

      owner.dealDamage(triggerPet, damage);

      this.logService.createLog({
        message: `${owner.name} reflected ${damage} damage to ${triggerPet.name}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PorcupineAbility {
    return new PorcupineAbility(newOwner, this.logService);
  }
}
