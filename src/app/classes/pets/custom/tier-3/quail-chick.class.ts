import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Quail } from 'app/classes/pets/hidden/quail.class';


export class QuailChick extends Pet {
  name = 'Quail Chick';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 4;

  override initAbilities(): void {
    this.addAbility(
      new QuailChickAbility(this, this.logService, this.abilityService),
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


export class QuailChickAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Quail Chick Ability',
      owner: owner,
      triggers: ['FoodEatenByThis'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const buffAmount = 2 * this.level * 2;
    const frontFriend = owner.petAhead;

    if (frontFriend && frontFriend.alive) {
      frontFriend.increaseAttack(buffAmount);
      frontFriend.increaseHealth(buffAmount);
    }

    const quail = new Quail(
      this.logService,
      this.abilityService,
      owner.parent,
      undefined,
      undefined,
      undefined,
      owner.exp,
    );

    owner.parent.transformPet(owner, quail);

    if (frontFriend && frontFriend.alive) {
      this.logService.createLog({
        message: `${owner.name} transformed into ${quail.name} and gave ${frontFriend.name} +${buffAmount} attack and +${buffAmount} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    } else {
      this.logService.createLog({
        message: `${owner.name} transformed into ${quail.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): QuailChickAbility {
    return new QuailChickAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
