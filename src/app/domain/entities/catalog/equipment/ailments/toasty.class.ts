import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { EquipmentDamageHandler } from '../../../combat/equipment-damage.handler';
import { InjectorService } from 'app/integrations/injector.service';
import { LogService } from 'app/integrations/log.service';


export class Toasty extends Equipment {
  name = 'Toasty';
  equipmentClass: EquipmentClass = 'ailment-other';
  uses = 1;
  originalUses = 1;
  callback = (pet: Pet) => {
    pet.addAbility(new ToastyAbility(pet));
  };
}

export class ToastyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet) {
    super({
      name: 'ToastyAbility',
      owner,
      triggers: ['AnyoneAttack'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      precondition: () =>
        owner.equipment instanceof Toasty && owner.equipment.uses > 0,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(_context: AbilityContext): void {
    const owner = this.owner;
    EquipmentDamageHandler.applyDamage({
      pet: owner,
      baseDamage: 1,
      perkName: 'Toasty',
      manticoreMultipliers: owner.parent.opponent.getManticoreMult(),
      logService: this.logService,
      afterDamage: (target) => {
        if (!(target.equipment instanceof Toasty)) {
          return;
        }
        target.equipment.uses--;
        if (target.equipment.uses <= 0) {
          target.removePerk();
        }
      },
    });
  }
}
