import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Rock } from 'app/classes/pets/hidden/rock.class';


export class Basilisk extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Basilisk';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 5;
    this.health = 2;
  }

  override initAbilities(): void {
    this.abilityList = [
      new BasiliskAbility(this, this.logService, this.abilityService),
    ];
    super.initAbilities();
  }
}


export class BasiliskAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Basilisk Ability',
      owner: owner,
      triggers: ['StartBattle'],
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

    const friendAhead = owner.petAhead;

    if (friendAhead && friendAhead.alive) {
      const hpBonus = this.level * 5;
      const rock = new Rock(
        this.logService,
        this.abilityService,
        friendAhead.parent,
      );
      rock.initPet(0, 1 + hpBonus, 0, 0, null);

      owner.parent.transformPet(friendAhead, rock);

      this.logService.createLog({
        message: `${owner.name} transformed ${friendAhead.name} into a Rock with +${hpBonus} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): BasiliskAbility {
    return new BasiliskAbility(newOwner, this.logService, this.abilityService);
  }
}
