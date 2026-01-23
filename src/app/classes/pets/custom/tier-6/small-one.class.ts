import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class SmallOne extends Pet {
  name = 'Small One';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new SmallOneAbility(this, this.logService));
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


export class SmallOneAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SmallOneAbility',
      owner: owner,
      triggers: ['ThisSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { tiger, pteranodon } = context;
    const allPets = owner.parent
      .getAll(true, owner)
      .pets.filter((pet) => pet && pet !== owner);

    if (allPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const damagePerFriendly = 2;
    const damagePerEnemy = damagePerFriendly * 2;
    for (let i = 0; i < this.level; i++) {
      for (const pet of allPets) {
        const damage =
          pet.parent === owner.parent ? damagePerFriendly : damagePerEnemy;
        owner.dealDamage(pet, damage);
      }
    }

    this.logService.createLog({
      message: `${owner.name} dealt ${damagePerFriendly} (${damagePerEnemy} vs enemies) damage ${this.level}x to all other pets.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SmallOneAbility {
    return new SmallOneAbility(newOwner, this.logService);
  }
}
