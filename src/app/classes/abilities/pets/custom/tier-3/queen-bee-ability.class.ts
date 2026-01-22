import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Player } from '../../../../player.class';

export class QueenBeeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Queen Bee Ability',
      owner: owner,
      triggers: ['BeeSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon, triggerPet } = context;
    const owner = this.owner;
    const bee = triggerPet;

    if (!bee || bee.name !== 'Bee') {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level * 3;
    bee.increaseAttack(buff);
    bee.increaseHealth(buff);

    const removedCount = this.removeOtherQueenBees(owner);

    this.logService.createLog({
      message: `${owner.name} gave ${bee.name} +${buff}/+${buff} and removed ${removedCount} other Queen Bees.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private removeOtherQueenBees(owner: Pet): number {
    const toProcess = [owner.parent, owner.parent.opponent];
    let removed = 0;

    for (const player of toProcess) {
      for (const pet of [...player.petArray]) {
        if (pet !== owner && pet.alive && pet.name === 'Queen Bee') {
          pet.health = 0;
          player.handleDeath(pet);
          removed++;
        }
      }
      player.removeDeadPets();
    }

    return removed;
  }

  override copy(newOwner: Pet): QueenBeeAbility {
    return new QueenBeeAbility(newOwner, this.logService);
  }
}
