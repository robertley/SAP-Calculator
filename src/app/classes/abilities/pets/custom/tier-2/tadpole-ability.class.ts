import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { InjectorService } from 'app/services/injector.service';
import { levelToExp } from '../../../../../util/leveling';

export class TadpoleAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Tadpole Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const level = owner.level;

    const petService = InjectorService.getInjector().get(PetService);
    const logService = InjectorService.getInjector().get(LogService);
    // Create a new Frog
    const frog = petService.createPet(
      {
        name: 'Frog',
        attack: null,
        health: null,
        mana: 0,
        exp: levelToExp(level),
        equipment: null,
      },
      owner.parent,
    );

    if (frog) {
      // Transformation
      owner.parent.transformPet(owner, frog);

      logService.createLog({
        message: `${owner.name} transformed into a level ${level} Frog.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): TadpoleAbility {
    return new TadpoleAbility(newOwner);
  }
}
