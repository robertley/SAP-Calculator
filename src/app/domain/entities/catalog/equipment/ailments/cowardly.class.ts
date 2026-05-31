import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';

export class Cowardly extends Equipment {
  name = 'Cowardly';
  equipmentClass: EquipmentClass = 'ailment-other';
  callback = (pet: Pet) => {
    pet.addAbility(new CowardlyAbility(pet, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}

export class CowardlyAbility extends Ability {
  constructor(
    owner: Pet,
    private logService: LogService,
  ) {
    super({
      name: 'CowardlyAbility',
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

    this.logService.createLog({
      message: `${owner.name} moved to the back. (Cowardly)`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.parent.pushPetToBack(owner);
    owner.parent.pushPetsForward();
    owner.removePerk();
  }
}
