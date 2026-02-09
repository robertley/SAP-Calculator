import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Weasel } from 'app/domain/entities/catalog/pets/golden/tier-3/weasel.class';


export class TaitaShrew extends Pet {
  name = 'Taita Shrew';
  tier = 2;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new TaitaShrewAbility(this, this.logService, this.abilityService),
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


export class TaitaShrewAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'TaitaShrewAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;

    if (!target) {
      return;
    }

    let weasel = new Weasel(
      this.logService,
      this.abilityService,
      owner.parent,
      target.health,
      target.attack,
      target.mana,
      target.exp,
      target.equipment,
    );

    this.logService.createLog({
      message: `${owner.name} transformed ${target.name} into ${weasel.name} (level ${this.level}).`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    owner.parent.transformPet(target, weasel);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TaitaShrewAbility {
    return new TaitaShrewAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



