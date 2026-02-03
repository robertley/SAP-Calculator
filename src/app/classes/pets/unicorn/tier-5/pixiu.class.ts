import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pixiu extends Pet {
  name = 'Pixiu';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 5;
  health = 6;
  initAbilities(): void {
    this.addAbility(new PixiuAbility(this, this.logService));
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


export class PixiuAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PixiuAbility',
      owner: owner,
      triggers: ['Faint'],
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

    if (owner.mana < 4) {
      return;
    }

    let power = this.level * 3;
    this.logService.createLog({
      message: `${owner.name} spent 4 mana and gained ${power} gold for next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    owner.mana -= 4;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PixiuAbility {
    return new PixiuAbility(newOwner, this.logService);
  }
}

