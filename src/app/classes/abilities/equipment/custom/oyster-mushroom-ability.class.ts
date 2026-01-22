import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';

export class OysterMushroomAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'OysterMushroomAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1,
      abilitylevel: 1,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.equipment = equipment;
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetAttack = Math.max(owner.attack, 9);
    const targetHealth = Math.max(owner.health, 9);

    if (targetAttack !== owner.attack) {
      owner.attack = targetAttack;
    }
    if (targetHealth !== owner.health) {
      owner.health = targetHealth;
    }

    this.logService.createLog({
      message: `${owner.name} set stats to ${owner.attack}/${owner.health}. (Oyster Mushroom)`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.removePerk();
  }
}
