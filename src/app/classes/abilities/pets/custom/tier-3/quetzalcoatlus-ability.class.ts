import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class QuetzalcoatlusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Quetzalcoatlus Ability',
      owner: owner,
      triggers: ['ThisKilled'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (!triggerPet || !triggerPet.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level;
    const targets = triggerPet.parent.petArray.filter((p) => p.alive);

    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} (Faint) gave +${buff}/+${buff} to ${triggerPet.name} and its friends.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): QuetzalcoatlusAbility {
    return new QuetzalcoatlusAbility(newOwner, this.logService);
  }
}
