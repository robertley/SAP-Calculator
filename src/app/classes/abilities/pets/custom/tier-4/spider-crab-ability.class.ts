import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SpiderCrabAbility extends Ability {
  private logService: LogService;
  private affectedPets = new Set<Pet>();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Spider Crab Ability',
      owner: owner,
      triggers: ['BeforeFriendAttacks', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { triggerPet, tiger, pteranodon } = context;

    if (context.trigger === 'StartTurn') {
      this.affectedPets.clear();
      this.triggerTigerExecution(context);
      return;
    }

    if (!triggerPet || triggerPet.parent !== owner.parent) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.has(triggerPet)) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.size >= this.level) {
      this.triggerTigerExecution(context);
      return;
    }

    triggerPet.increaseHealth(4);
    triggerPet.parent.pushPetToBack(triggerPet);
    this.affectedPets.add(triggerPet);

    this.logService.createLog({
      message: `${owner.name} moved ${triggerPet.name} to the back and gave it +4 health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SpiderCrabAbility {
    return new SpiderCrabAbility(newOwner, this.logService);
  }
}
