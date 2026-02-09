import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Ant } from 'app/domain/entities/catalog/pets/turtle/tier-1/ant.class';


export class GrosMichelBanana extends Equipment {
  name = 'Gros Michel Banana';
  equipmentClass = 'beforeAttack' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Gros Michel Banana ability using dedicated ability class
    pet.addAbility(
      new GrosMichelBananaAbility(
        pet,
        this,
        this.logService,
        this.abilityService,
      ),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}


export class GrosMichelBananaAbility extends Ability {
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
      name: 'GrosMichelBananaAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Equipment is used once
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
    const { gameApi } = context;
    const owner = this.owner;

    for (let i = 0; i < this.equipment.multiplier; i++) {
      // Create Ant with current pet's stats
      let antPet = new Ant(
        this.logService,
        this.abilityService,
        owner.parent,
        owner.health,
        owner.attack,
        owner.mana,
        owner.exp,
      );

      let multiplierMessage = i > 0 ? this.equipment.multiplierMessage : '';
      this.logService.createLog({
        message: `${owner.name} transformed into ${antPet.name} (Gros Michel Banana)${multiplierMessage}`,
        type: 'equipment',
        player: owner.parent,
      });

      owner.parent.transformPet(owner, antPet);
    }
  }
}



