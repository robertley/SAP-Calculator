import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';

export class JerboaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private lastTriggeredTurn: number | null = null;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Jerboa Ability',
      owner: owner,
      triggers: ['AppleEatenByThis'],
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
    const { tiger, pteranodon, gameApi } = context;
    const owner = this.owner;
    const turnNumber = gameApi?.turnNumber ?? null;

    if (turnNumber != null && this.lastTriggeredTurn === turnNumber) {
      this.triggerTigerExecution(context);
      return;
    }

    this.lastTriggeredTurn = turnNumber;
    const buff = this.level;
    const player = owner.parent;
    const targets = player.petArray.filter(
      (friend) => friend && friend.alive && friend !== owner,
    );

    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const friend of targets) {
      friend.increaseAttack(buff);
      friend.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} ate an apple and gave friendly pets +${buff}/+${buff}.`,
      type: 'ability',
      player: player,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): JerboaAbility {
    return new JerboaAbility(newOwner, this.logService, this.abilityService);
  }
}
