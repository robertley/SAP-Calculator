import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Cat extends Pet {
  name = 'Cat';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new CatAbility(this, this.logService));
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


export class CatAbility extends Ability {
  private logService: LogService;
  private usesThisTurn = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CatAbility',
      owner: owner,
      triggers: ['FoodEatenByFriendly', 'StartTurn'],
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
    const owner = this.owner;
    const { trigger, triggerPet } = context as AbilityContext & {
      trigger?: string;
      triggerPet?: Pet;
    };

    if (trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      return;
    }

    if (this.usesThisTurn >= 2) {
      return;
    }
    this.usesThisTurn++;

    const multiplier = this.level + 1;
    this.logService.createLog({
      message: `${owner.name} boosted ${triggerPet?.name ?? 'a friend'}'s shop food by ${multiplier}x.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CatAbility {
    return new CatAbility(newOwner, this.logService);
  }
}
