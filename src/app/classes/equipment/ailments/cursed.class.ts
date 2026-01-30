import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';


export class Cursed extends Equipment {
  name = 'Cursed';
  equipmentClass: EquipmentClass = 'ailment-other';
  callback = (pet: Pet) => {
    pet.addAbility(new CursedAbility(pet));
  };
}


export class CursedAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet) {
    super({
      name: 'CursedAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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

