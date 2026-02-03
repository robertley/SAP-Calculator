import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { shuffle } from 'app/util/helper-functions';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Tandgnost extends Pet {
  name = 'Tandgnost';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 6;
  health = 2;
  initAbilities(): void {
    this.addAbility(new TandgnostAbility(this, this.logService));
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


export class TandgnostAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Tandgnost Ability',
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
    const owner = this.owner;
    const targets = owner.parent.petArray.filter(
      (pet) => pet && pet.alive && pet.name === 'Tandgrisner',
    );
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const [target] = shuffle([...targets]);
    const buff = Math.max(1, this.level) * 3;
    target.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buff} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TandgnostAbility {
    return new TandgnostAbility(newOwner, this.logService);
  }
}
