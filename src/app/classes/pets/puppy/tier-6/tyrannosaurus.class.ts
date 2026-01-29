import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { getRandomInt } from 'app/util/helper-functions';


export class Tyrannosaurus extends Pet {
  name = 'Tyrannosaurus';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 7;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new TyrannosaurusAbility(this, this.logService, this.abilityService),
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


export class TyrannosaurusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'TyrannosaurusAbility',
      owner: owner,
      triggers: ['StartTurn'],
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
    const candidates = owner.parent.petArray.filter(
      (pet) => pet.alive && pet !== owner && pet.tier >= 5,
    );
    const initialCount = candidates.length;
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets: Pet[] = [];
    while (targets.length < 2 && candidates.length > 0) {
      const index = getRandomInt(0, candidates.length - 1);
      targets.push(candidates[index]);
      candidates.splice(index, 1);
    }

    const buff = this.level * 2;
    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: initialCount > targets.length,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TyrannosaurusAbility {
    return new TyrannosaurusAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
