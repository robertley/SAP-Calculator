import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { InjectorService } from 'app/integrations/injector.service';
import { LogService } from 'app/integrations/log.service';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatEquipmentScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Confused extends Equipment {
  name = 'Confused';
  equipmentClass: EquipmentClass = 'ailment-other';
  callback = (pet: Pet) => {
    pet.addAbility(new ConfusedAbility(pet));
  };
}


export class ConfusedAbility extends Ability {
  private petService: PetService;
  private logService: LogService;

  constructor(owner: Pet) {
    super({
      name: 'ConfusedAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1,
      abilitylevel: 1,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.petService = InjectorService.getInjector().get(PetService);
    this.logService = InjectorService.getInjector().get(LogService);
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const tier = Math.max(1, (owner.tier ?? 1) - 1);
    const pool = this.petService.allPets.get(tier) ?? [];

    if (pool.length === 0) {
      owner.removePerk();
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'equipment.confused-transform',
        label: formatEquipmentScopedRandomLabel(owner, 'Confused', 'transform'),
        options: pool.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, pool.length - 1),
    );
    const petName = pool[choice.index];
    owner.removePerk();

    const transformedPet = this.petService.createPet(
      {
        name: petName,
        attack: owner.attack,
        health: owner.health,
        exp: owner.exp ?? 0,
        equipment: null,
        mana: owner.mana,
      },
      owner.parent,
    );

    this.logService.createLog({
      message: `${owner.name} transformed into a ${petName}. (Confused)`,
      type: 'equipment',
      player: owner.parent,
      randomEvent: choice.randomEvent,
    });

    owner.parent.transformPet(owner, transformedPet);
  }
}


