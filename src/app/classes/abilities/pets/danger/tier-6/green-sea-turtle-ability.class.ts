import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Melon } from '../../../../equipment/turtle/melon.class';

export class GreenSeaTurtleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GreenSeaTurtleAbility',
      owner: owner,
      triggers: ['EnemyAttacked5'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Give all friendly pets Melon
    let targetsResp = owner.parent.getAll(false, owner);
    let targets = targetsResp.pets;
    for (let targetPet of targets) {
      targetPet.givePetEquipment(new Melon(), owner.level);
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} Melon.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GreenSeaTurtleAbility {
    return new GreenSeaTurtleAbility(newOwner, this.logService);
  }
}
