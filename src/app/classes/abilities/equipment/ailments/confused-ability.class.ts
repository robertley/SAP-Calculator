import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { PetService } from 'app/services/pet/pet.service';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';

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

    const petName = pool[Math.floor(Math.random() * pool.length)];
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
      randomEvent: true,
    });

    owner.parent.transformPet(owner, transformedPet);
  }
}
