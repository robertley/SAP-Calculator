import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class AlbatrossAbility extends Ability {
  private logService: LogService;
  private handlingExtraDamage = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Albatross Ability',
      owner: owner,
      triggers: ['EnemyHurt'],
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
    if (this.handlingExtraDamage) {
      this.handlingExtraDamage = false;
      return;
    }

    if (context.trigger !== 'EnemyHurt') {
      return;
    }

    const owner = this.owner;
    const target = context.triggerPet;
    if (!target || !target.alive) {
      return;
    }

    const adjacentPets = [owner.petAhead, owner.petBehind()].filter(
      (pet) =>
        pet && pet.alive && pet.parent === owner.parent && pet.level <= 4,
    );
    if (adjacentPets.length === 0) {
      return;
    }

    const extraDamage = this.level * 3;
    this.handlingExtraDamage = true;
    owner.dealDamage(target, extraDamage);
    this.handlingExtraDamage = false;

    this.logService.createLog({
      message: `${owner.name} boosted adjacent friends for an extra ${extraDamage} damage on ${target.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AlbatrossAbility {
    return new AlbatrossAbility(newOwner, this.logService);
  }
}
