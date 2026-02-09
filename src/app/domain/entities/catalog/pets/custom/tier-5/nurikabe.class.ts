import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Nurikabe extends Pet {
  name = 'Nurikabe';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 6;
  maxAbilityUses: number = 3;
  initAbilities(): void {
    this.addAbility(new NurikabeAbility(this));
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


export class NurikabeAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'NurikabeAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context: AbilityContext) =>
        this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    // Damage reduction handled in player combat; no direct execution needed
  }

  copy(newOwner: Pet): NurikabeAbility {
    return new NurikabeAbility(newOwner);
  }
}


