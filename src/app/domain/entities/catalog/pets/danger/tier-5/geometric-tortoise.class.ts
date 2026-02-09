import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GeometricTortoise extends Pet {
  name = 'Geometric Tortoise';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 3;
  health = 10;

  initAbilities(): void {
    this.addAbility(new GeometricTortoiseAbility(this, this.logService));
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


export class GeometricTortoiseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GeometricTortoiseAbility',
      owner: owner,
      triggers: ['ThisHurt'],
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
    const { gameApi, triggerPet, tiger, pteranodon, damageAmount } = context;
    const owner = this.owner;

    if (damageAmount === undefined || damageAmount <= 0) {
      return;
    }

    // Deal percentage of damage taken as damage to one random enemy
    let reflectPercentage = this.level * 0.33; // 33%/66%/100% based on level
    if (owner.level === 3) {
      reflectPercentage = 1;
    }

    let reflectDamage = Math.floor(damageAmount * reflectPercentage);
    if (reflectDamage > 0) {
      let targetResp = owner.parent.opponent.getRandomPet(
        [],
        false,
        true,
        false,
        owner,
      );
      if (targetResp.pet) {
        owner.snipePet(targetResp.pet, reflectDamage, targetResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GeometricTortoiseAbility {
    return new GeometricTortoiseAbility(newOwner, this.logService);
  }
}


