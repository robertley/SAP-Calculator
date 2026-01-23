import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Barnacle extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Barnacle';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 1;
    this.health = 3;
  }

  initAbilities(): void {
    this.abilityList = [new BarnacleAbility(this, this.logService)];
    super.initAbilities();
  }
}


export class BarnacleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Barnacle Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;

    const rolls =
      owner.parent === gameApi.player
        ? gameApi.playerRollAmount || 0
        : gameApi.opponentRollAmount || 0;

    if (rolls === 0) {
      const expGain = this.level;
      owner.increaseExp(expGain);

      this.logService.createLog({
        message: `${owner.name} gained +${expGain} experience (EndTurn, no rolls).`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): BarnacleAbility {
    return new BarnacleAbility(newOwner, this.logService);
  }
}
