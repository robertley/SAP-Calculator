import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class CaladriusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Caladrius Ability',
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
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

    // Check if triggerPet is a friend and has enough mana
    if (
      triggerPet &&
      triggerPet.parent === owner.parent &&
      triggerPet !== owner
    ) {
      if (triggerPet.mana >= 3) {
        const buff = 2 * this.level;
        triggerPet.mana -= 3;
        triggerPet.increaseAttack(buff);
        triggerPet.increaseHealth(buff);

        this.logService.createLog({
          message: `${owner.name} spent 3 mana from ${triggerPet.name} to give it +${buff}/+${buff}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
      }
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): CaladriusAbility {
    return new CaladriusAbility(newOwner, this.logService);
  }
}
