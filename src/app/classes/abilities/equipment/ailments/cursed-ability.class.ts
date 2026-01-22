import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Cursed } from 'app/classes/equipment/ailments/cursed.class';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';

export class CursedAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet) {
    super({
      name: 'CursedAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetResp = owner.parent.getRandomPet(
      [owner],
      false,
      false,
      false,
      owner,
    );
    const target = targetResp.pet;

    if (!target) {
      return;
    }

    target.givePetEquipment(new Cursed());
    this.logService.createLog({
      message: `${owner.name} made ${target.name} Cursed.`,
      type: 'equipment',
      player: owner.parent,
      randomEvent: targetResp.random,
    });
  }
}
