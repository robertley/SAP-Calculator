import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Llama extends Pet {
  name = 'Llama';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(new LlamaAbility(this, this.logService, this.abilityService));
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


export class LlamaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LlamaAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    let hasEmptySpace = false;
    for (let i = 0; i < 5; i++) {
      if (owner.parent.getPetAtPosition(i) == null) {
        hasEmptySpace = true;
        break;
      }
    }
    if (!hasEmptySpace) {
      this.triggerTigerExecution(context);
      return;
    }

    const attackGain = this.level;
    const healthGain = this.level * 2;
    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gained +${attackGain}/+${healthGain} because there was an empty space.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LlamaAbility {
    return new LlamaAbility(newOwner, this.logService, this.abilityService);
  }
}
