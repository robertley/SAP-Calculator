import { Pet } from '../../../../pet.class';
import { Pack } from '../../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Rock } from 'app/domain/entities/catalog/pets/hidden/rock.class';
import { Equipment } from 'app/domain/entities/equipment.class';


export class Basilisk extends Pet {
  name = 'Basilisk';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 5;
  health = 2;

  constructor(
    logService: LogService,
    abilityService: AbilityService,
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
      const transformedAttack = Math.max(1, friendAhead.attack ?? 1);
      const transformedHealth = Math.max(1, friendAhead.health ?? 1) + hpBonus;
      const rock = new Rock(
        this.logService,
        this.abilityService,
        friendAhead.parent,
        transformedHealth,
        transformedAttack,
        friendAhead.mana,
        friendAhead.exp,
      );

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



