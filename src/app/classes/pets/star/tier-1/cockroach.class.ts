import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { SummonedCockroach } from '../../hidden/summoned-cockroach.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Cockroach extends Pet {
  name = 'Cockroach';
  tier = 1;
  pack: Pack = 'Star';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new CockroachAbility(this, this.logService, this.abilityService),
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


export class CockroachAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CockroachAbility',
      owner: owner,
      triggers: ['ThisDied'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const expToGain = this.level;

    const newCockroach = new SummonedCockroach(
      this.logService,
      this.abilityService,
      owner.parent,
      1,
      1,
      0,
      0,
    );

    let summonResult = owner.parent.summonPet(
      newCockroach,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a 1/1 Cockroach.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });

      let targetResp = owner.parent.getSpecificPet(owner, newCockroach);
      targetResp.pet.increaseExp(expToGain);
      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} +${expToGain} exp.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CockroachAbility {
    return new CockroachAbility(newOwner, this.logService, this.abilityService);
  }
}
