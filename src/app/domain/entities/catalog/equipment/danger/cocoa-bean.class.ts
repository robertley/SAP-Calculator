import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatEquipmentScopedRandomLabel } from 'app/runtime/random-decision-label';

const COCOA_BEAN_SUMMON_POOL = [
  'Wolf',
  'Slug',
  'Sheep',
  'Rooster',
  'Nessie',
  'Deer',
  'Tardigrade',
  'Hirola',
  'Patagonian Mara',
  'Osprey',
  'Anteater',
] as const;


export class CocoaBean extends Equipment {
  name = 'Cocoa Bean';
  tier = 5;
  equipmentClass = 'beforeAttack' as EquipmentClass;
  power = 0;
  originalPower = 0;
  uses = 1;
  originalUses = 1;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Cocoa Bean ability using dedicated ability class
    pet.addAbility(
      new CocoaBeanAbility(pet, equipment, this.logService, this.petService),
    );
  };

  constructor(
    protected logService: LogService,
    protected petService: PetService,
  ) {
    super();
  }
}


export class CocoaBeanAbility extends Ability {
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
      name: 'CocoaBeanAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Equipment is consumed after one use
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
    const summonPool = [...COCOA_BEAN_SUMMON_POOL];
    if (summonPool.length === 0) {
      owner.removePerk();
      return;
    }

    for (let i = 0; i < this.equipment.multiplier; i++) {
      const choice = chooseRandomOption(
        {
          key: 'equipment.cocoa-bean-transform',
          label: formatEquipmentScopedRandomLabel(
            owner,
            'Cocoa Bean',
            'transform',
            i + 1,
          ),
          options: summonPool.map((petName) => ({
            id: petName,
            label: petName,
          })),
        },
        () => getRandomInt(0, summonPool.length - 1),
      );
      const summonPetName = summonPool[choice.index];

      let transformedPet = this.petService.createPet(
        {
          name: summonPetName,
          attack: null,
          health: null,
          mana: owner.mana,
          exp: 0,
          equipment: null,
        },
        owner.parent,
      );
      transformedPet.mana = owner.mana;
      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${owner.name} transformed into ${transformedPet.name} (Cocoa Bean)${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
        randomEvent: choice.randomEvent,
      });

      owner.parent.transformPet(owner, transformedPet);
    }
  }
}





