import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Werewolf extends Pet {
  name = 'Werewolf';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 7;
  health = 7;
  initAbilities(): void {
    this.addAbility(new WerewolfAbility(this, this.logService));
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


export class WerewolfAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WerewolfAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (gameApi.day) {
      const manaGain = this.level * 6;
      let targetResp = owner.parent.getThis(owner);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }

      target.increaseMana(manaGain);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${manaGain} mana.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
    } else {
      let targetResp = owner.parent.getThis(owner);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }
      let power = this.level * 0.5;
      const attackGain = Math.floor(owner.attack * power);
      const healthGain = Math.floor(owner.health * power);
      let attack = Math.min(50, owner.attack + attackGain);
      let health = Math.min(50, owner.health + healthGain);
      this.logService.createLog({
        message: `${owner.name} increased ${target.name}'s stats by ${power * 100}% (${attack}/${health}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
      target.increaseAttack(attackGain);
      target.increaseHealth(healthGain);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WerewolfAbility {
    return new WerewolfAbility(newOwner, this.logService);
  }
}


