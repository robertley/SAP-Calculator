import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GuineaPig extends Pet {
  name = 'Guinea Pig';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new GuineaPigAbility(this, this.logService, this.abilityService),
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


export class GuineaPigAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'GuineaPigAbility',
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
    const exp = this.minExpForLevel;
    const power = this.level;
    const guineaPig = new GuineaPig(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
      null,
      exp,
    );

    const summonResult = owner.parent.summonPet(
      guineaPig,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a ${power}/${power} Guinea Pig (level ${this.level}).`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GuineaPigAbility {
    return new GuineaPigAbility(newOwner, this.logService, this.abilityService);
  }
}


