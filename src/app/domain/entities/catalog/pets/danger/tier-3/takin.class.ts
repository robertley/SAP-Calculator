import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Takin extends Pet {
  name = 'Takin';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 2;
  health = 3;

  initAbilities(): void {
    this.addAbility(new TakinAbility(this, this.logService));
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


export class TakinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TakinAbility',
      owner: owner,
      triggers: ['AdjacentFriendAttacked'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const multiplier = this.currentUses % 3 === 0 ? 3 : 1;
    let attackGain = this.level * multiplier;
    let healthGain = this.level * multiplier;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;

    target.increaseAttack(attackGain);
    target.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${attackGain} attack and ${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TakinAbility {
    return new TakinAbility(newOwner, this.logService);
  }
}


