import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { shuffle } from 'app/util/helper-functions';


export class BrahmaChicken extends Pet {
  name = 'Brahma Chicken';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new BrahmaChickenAbility(this, this.logService));
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


export class BrahmaChickenAbility extends Ability {
  private logService: LogService;
  private attackers: Set<Pet> = new Set();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Brahma Chicken Ability',
      owner: owner,
      triggers: ['FriendAttacked', 'ThisDied', 'StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { triggerPet, tiger, pteranodon } = context;

    if (context.trigger === 'StartBattle') {
      this.attackers.clear();
      return;
    }

    if (
      context.trigger === 'FriendAttacked' &&
      triggerPet &&
      triggerPet.parent === owner.parent
    ) {
      this.attackers.add(triggerPet);
      return;
    }

    if (context.trigger === 'ThisDied') {
      const eligible = shuffle(
        Array.from(this.attackers).filter((pet) => pet && pet.alive),
      );
      const buffCount = Math.min(3, eligible.length);
      const buffAmount = this.level;
      const applied = eligible.slice(0, buffCount);

      for (const target of applied) {
        target.increaseAttack(buffAmount);
        target.increaseHealth(buffAmount);
      }

      if (applied.length > 0) {
        this.logService.createLog({
          message: `${owner.name} gave ${applied.map((p) => p.name).join(', ')} +${buffAmount}/+${buffAmount} after fainting.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
      }

      this.triggerTigerExecution(context);
    }
  }

  copy(newOwner: Pet): BrahmaChickenAbility {
    return new BrahmaChickenAbility(newOwner, this.logService);
  }
}
