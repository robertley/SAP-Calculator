import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { getAdjacentAlivePets } from 'app/classes/ability-helpers';


export class PrayingMantis extends Pet {
  name = 'Praying Mantis';
  tier = 4;
  pack: Pack = 'Star';
  attack = 7;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new PrayingMantisAbility(this, this.logService, this.abilityService),
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


export class PrayingMantisAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PrayingMantisAbility',
      owner: owner,
      triggers: ['StartTurn'],
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
    const damage = 50;
    const adjacentPets = getAdjacentAlivePets(owner);
    for (const target of adjacentPets) {
      owner.dealDamage(target, damage);
    }

    const buff = this.level * 2;
    owner.increaseAttack(buff);
    owner.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} dealt ${damage} damage to adjacent friends and gained +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: adjacentPets.length > 1,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PrayingMantisAbility {
    return new PrayingMantisAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
