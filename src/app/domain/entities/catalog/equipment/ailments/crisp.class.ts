import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { EquipmentDamageHandler } from '../../../combat/equipment-damage.handler';
import { InjectorService } from 'app/integrations/injector.service';
import { LogService } from 'app/integrations/log.service';


export class Crisp extends Equipment {
  name = 'Crisp';
  equipmentClass: EquipmentClass = 'ailment-other';
  callback = (pet: Pet) => {
    pet.addAbility(new CrispAbility(pet));
  };
}

export class CrispAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet) {
    super({
      name: 'CrispAbility',
      owner,
      triggers: ['AnyoneAttack'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      precondition: () => owner.equipment instanceof Crisp,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(_context: AbilityContext): void {
    const owner = this.owner;
    EquipmentDamageHandler.applyDamage({
      pet: owner,
      baseDamage: 6,
      perkName: 'Crisp',
      manticoreMultipliers: owner.parent.opponent.getManticoreMult(),
      logService: this.logService,
      afterDamage: (target) => target.removePerk(),
    });
  }
}
