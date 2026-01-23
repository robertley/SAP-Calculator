import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Chicken extends Pet {
  name = 'Chicken';
  tier = 5;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new ChickenAbility(this, this.logService, this.abilityService),
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


export class ChickenAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ChickenAbility',
      owner: owner,
      triggers: ['StartTurn'],
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
    const buff = this.level;
    this.logService.createLog({
      message: `${owner.name} gave future shop pets +${buff} attack and +${buff} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChickenAbility {
    return new ChickenAbility(newOwner, this.logService, this.abilityService);
  }
}
