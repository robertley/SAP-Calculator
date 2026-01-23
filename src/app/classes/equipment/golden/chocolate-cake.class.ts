import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class ChocolateCake extends Equipment {
  name = 'Chocolate Cake';
  equipmentClass = 'beforeAttack' as EquipmentClass;
  callback = (pet: Pet) => {
    pet.addAbility(
      new ChocolateCakeAbility(pet, this, this.logService, this.abilityService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}


export class ChocolateCakeAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ChocolateCakeAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    let multiplier = this.equipment.multiplier;
    let expGain = 3 * multiplier;

    this.logService.createLog({
      message: `${owner.name} gained ${expGain} exp. (Chocolate Cake)${this.equipment.multiplierMessage}`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.increaseExp(expGain);
    owner.health = 0;

    this.abilityService.triggerKillEvents(owner, owner);
  }
}
