import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Power } from 'app/domain/interfaces/power.interface';


export class TeamSpirit extends Pet {
  name = 'Team Spirit';
  tier = 6;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new TeamSpiritAbility(this, this.logService));
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


export class TeamSpiritAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TeamSpiritAbility',
      owner: owner,
      triggers: ['FriendLeveledUp'],
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

    let targetResp = owner.parent.getAll(false, owner, true);
    let targets = targetResp.pets;

    let power: Power = {
      attack: owner.level,
      health: owner.level,
    };

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });

      target.increaseAttack(power.attack);
      target.increaseHealth(power.health);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TeamSpiritAbility {
    return new TeamSpiritAbility(newOwner, this.logService);
  }
}


