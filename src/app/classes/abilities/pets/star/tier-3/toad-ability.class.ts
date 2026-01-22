import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Weak } from '../../../../equipment/ailments/weak.class';

export class ToadAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.owner.level * 2;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ToadAbility',
      owner: owner,
      triggers: ['EnemyHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level * 2,
      condition: (context: AbilityContext) => {
        const { triggerPet } = context;
        return triggerPet && triggerPet.alive;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target?.equipment?.name === 'Weak') {
      let excludePets = owner.parent.opponent.getPetsWithEquipment('Weak');
      targetResp = owner.parent.opponent.getRandomPet(
        excludePets,
        null,
        true,
        null,
        owner,
      );
      target = targetResp.pet;
    }
    if (target == null) {
      return;
    }

    target.givePetEquipment(new Weak());
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Weak.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ToadAbility {
    return new ToadAbility(newOwner, this.logService);
  }
}
