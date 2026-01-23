import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Seaweed extends Equipment {
  name = 'Seaweed';
  equipmentClass = 'beforeAttack' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Seaweed ability using dedicated ability class
    pet.addAbility(
      new SeaweedAbility(pet, this, this.logService, this.petService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
  ) {
    super();
  }
}


export class SeaweedAbility extends Ability {
  private equipment: Equipment;
  private logService: LogService;
  private petService: PetService;

  constructor(
    owner: Pet,
    equipment: Equipment,
    logService: LogService,
    petService: PetService,
  ) {
    super({
      name: 'SeaweedAbility',
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
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    // Create Baby Urchin with current pet's stats
    let babyUrchinPet = this.petService.createPet(
      {
        name: 'Baby Urchin',
        attack: owner.attack,
        health: owner.health,
        mana: owner.mana,
        exp: owner.exp,
        equipment: null,
      },
      owner.parent,
    );

    this.logService.createLog({
      message: `${owner.name} transformed into ${babyUrchinPet.name} (Seaweed)`,
      type: 'equipment',
      player: owner.parent,
    });

    owner.parent.transformPet(owner, babyUrchinPet);
  }
}
