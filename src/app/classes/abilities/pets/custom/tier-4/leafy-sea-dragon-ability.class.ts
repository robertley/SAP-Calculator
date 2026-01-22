import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { getAdjacentAlivePets, logAbility } from '../../../ability-helpers';

export class LeafySeaDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Leafy Sea Dragon Ability',
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const expGain = this.level;
    const adjacent = getAdjacentAlivePets(owner);

    adjacent.forEach((friend) => {
      friend.increaseExp(expGain);
    });

    owner.health = 0;
    owner.parent.handleDeath(owner);
    owner.parent.removeDeadPets();

    const message = `${owner.name} gave ${adjacent.length} adjacent friend${adjacent.length === 1 ? '' : 's'} +${expGain} experience and removed itself.`;
    logAbility(this.logService, owner, message, tiger, pteranodon);

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): LeafySeaDragonAbility {
    return new LeafySeaDragonAbility(newOwner, this.logService);
  }
}
