import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Cockatoo extends Pet {
  name = 'Cockatoo';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 4;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new CockatooAbility(this, this.logService, this.abilityService),
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


export class CockatooAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CockatooAbility',
      owner: owner,
      triggers: ['ThisBought'],
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
    const friends = owner.parent.petArray.filter(
      (pet) => pet.alive && pet !== owner,
    );
    if (friends.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    let maxTier = Math.max(...friends.map((pet) => pet.tier));
    const candidates = friends.filter((pet) => pet.tier === maxTier);
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    const buff = this.level * 2;
    target.increaseAttack(buff);
    target.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: candidates.length > 1,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CockatooAbility {
    return new CockatooAbility(newOwner, this.logService, this.abilityService);
  }
}
