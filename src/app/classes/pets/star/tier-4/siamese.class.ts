import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Player } from '../../../player.class';
import { Pet, Pack } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { getAdjacentAlivePets } from 'app/classes/ability-helpers';


export class Siamese extends Pet {
  name = 'Siamese';
  tier = 4;
  pack: Pack = 'Star';
  health = 4;
  attack = 1;
  initAbilities(): void {
    this.addAbility(
      new SiameseAbility(this, this.logService, this.abilityService),
    );
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


export class SiameseAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SiameseAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const adjacentPets = getAdjacentAlivePets(owner);
    if (adjacentPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const hasDiscountedFood =
      (context as { discountedFood?: boolean }).discountedFood === true ||
      (context as { shopDiscountedFood?: boolean }).shopDiscountedFood === true;
    const attackGain = this.level;
    const healthGain = hasDiscountedFood ? this.level : 0;

    for (const target of adjacentPets) {
      target.increaseAttack(attackGain);
      if (healthGain > 0) {
        target.increaseHealth(healthGain);
      }
    }

    this.logService.createLog({
      message: `${owner.name} gave adjacent friends +${attackGain} attack${healthGain > 0 ? ` and +${healthGain} health` : ''}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: adjacentPets.length > 1,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SiameseAbility {
    return new SiameseAbility(newOwner, this.logService, this.abilityService);
  }
}
