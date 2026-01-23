import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Yak extends Pet {
  name = 'Yak';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;

  override initAbilities(): void {
    this.addAbility(new YakAbility(this, this.logService));
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


export class YakAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Yak Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const damage = this.level;
    const attackGain = 2 * this.level;

    // Take damage
    owner.dealDamage(owner, damage);

    // Gain attack
    owner.increaseAttack(attackGain);

    this.logService.createLog({
      message: `${owner.name} took ${damage} damage and gained +${attackGain} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): YakAbility {
    return new YakAbility(newOwner, this.logService);
  }
}
