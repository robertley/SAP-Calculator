import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class ThornyDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Thorny Dragon Ability',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const damage = 3 * this.level;

    const opponentPets = owner.parent.opponent.petArray.filter((p) => p.alive);
    if (opponentPets.length === 0) return;

    // Prioritize pets with ailments
    const petsWithAilments = opponentPets.filter((p) => {
      if (!p.equipment) return false;
      return (
        p.equipment.equipmentClass === 'ailment-attack' ||
        p.equipment.equipmentClass === 'ailment-defense' ||
        p.equipment.equipmentClass === 'ailment-other'
      );
    });

    const targetPool =
      petsWithAilments.length > 0 ? petsWithAilments : opponentPets;
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    if (target) {
      owner.snipePet(target, damage, true, tiger, pteranodon);

      this.logService.createLog({
        message: `${owner.name} fainted and dealt ${damage} damage to ${target.name} (prioritizing ailments).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: true,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): ThornyDragonAbility {
    return new ThornyDragonAbility(newOwner, this.logService);
  }
}
