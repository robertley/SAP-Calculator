import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Aardvark extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Aardvark';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 2;
    this.health = 3;
  }

  initAbilities(): void {
    this.abilityList = [new AardvarkAbility(this, this.logService)];
    super.initAbilities();
  }
}


export class AardvarkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Aardvark Ability',
      owner: owner,
      triggers: ['EnemySummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const buff = 2 * this.level;
    owner.increaseAttack(buff);
    owner.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gained +${buff}/+${buff} from EnemySummoned.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): AardvarkAbility {
    return new AardvarkAbility(newOwner, this.logService);
  }
}
