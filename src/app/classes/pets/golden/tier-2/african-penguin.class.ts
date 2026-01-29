import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class AfricanPenguin extends Pet {
  name = 'African Penguin';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new AfricanPenguinAbility(this, this.logService, this.abilityService),
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


export class AfricanPenguinAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'AfricanPenguinAbility',
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
    const targetsResp = owner.parent.getRandomPets(3, [owner]);
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }
    const attackGain = this.level;
    for (const target of targets) {
      target.increaseAttack(attackGain);
    }
    this.logService.createLog({
      message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${attackGain} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetsResp.random,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AfricanPenguinAbility {
    return new AfricanPenguinAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
