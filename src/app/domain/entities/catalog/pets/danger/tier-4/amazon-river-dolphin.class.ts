import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class AmazonRiverDolphin extends Pet {
  name = 'Amazon River Dolphin';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 4;
  health = 5;

  initAbilities(): void {
    this.addAbility(new AmazonRiverDolphinAbility(this, this.logService));
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


export class AmazonRiverDolphinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmazonRiverDolphinAbility',
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

    // Choice: Deal damage to its target OR gain attack
    let targetResp = owner.parent.getSpecificPet(
      owner,
      triggerPet.currentTarget,
    );
    let target = targetResp.pet;
    if (target && target.alive) {
      let damage = 3 * this.level;
      owner.snipePet(target, damage, targetResp.random, tiger);
    } else {
      let targetResp = owner.parent.getThis(owner);
      let selfTarget = targetResp.pet;

      if (!selfTarget) {
        return;
      }

      let attackBonus = 3 * this.level;
      selfTarget.increaseAttack(attackBonus);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTarget.name} ${attackBonus} attack`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmazonRiverDolphinAbility {
    return new AmazonRiverDolphinAbility(newOwner, this.logService);
  }
}


