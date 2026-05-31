import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';

export class GeecheeRedPea extends Equipment {
  name = 'Geechee Red Pea';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    pet.addAbility(new GeecheeRedPeaAbility(pet, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}

export class GeecheeRedPeaAbility extends Ability {
  constructor(
    owner: Pet,
    private logService: LogService,
  ) {
    super({
      name: 'GeecheeRedPeaAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const target = owner.parent.opponent?.furthestUpPet;
    if (!target) {
      owner.removePerk();
      return;
    }

    target.increaseAttack(-5);
    this.logService.createLog({
      message: `${owner.name} removed 5 attack from ${target.name}. (Geechee Red Pea)`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.removePerk();
  }
}
