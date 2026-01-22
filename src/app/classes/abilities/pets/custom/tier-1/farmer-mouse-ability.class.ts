import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';

export class FarmerMouseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FarmerMouseAbility',
      owner: owner,
      triggers: ['ThisDied'],
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const targets = owner.getPetsBehind(this.level);
    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      target.givePetEquipment(new Corncob());
      this.logService.createLog({
        message: `${owner.name} fed ${target.name} Corncob.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FarmerMouseAbility {
    return new FarmerMouseAbility(newOwner, this.logService);
  }
}
