import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class TarantulaHawk extends Pet {
  name = 'Tarantula Hawk';
  tier = 6;
  pack: Pack = 'Custom';
  health = 2;
  attack = 10;

  initAbilities(): void {
    this.addAbility(new TarantulaHawkAbility(this, this.logService));
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


export class TarantulaHawkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TarantulaHawkAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Calculate damage per enemy: level * health removed per 10 attack
    let damagePerEnemy = Math.floor(owner.attack / 10) * this.level;

    if (damagePerEnemy <= 0) {
      return;
    }

    // Get all alive enemies
    let enemiesResp = owner.parent.opponent.getAll(false, owner);
    let enemies = enemiesResp.pets;

    if (enemies.length == 0) {
      return;
    }

    // Apply damage to all enemies
    for (let enemy of enemies) {
      enemy.increaseHealth(-damagePerEnemy);
      this.logService.createLog({
        message: `${owner.name} removed ${damagePerEnemy} health from ${enemy.name}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TarantulaHawkAbility {
    return new TarantulaHawkAbility(newOwner, this.logService);
  }
}
