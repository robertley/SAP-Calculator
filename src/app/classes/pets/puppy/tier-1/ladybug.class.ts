import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Ladybug extends Pet {
  name = 'Ladybug';
  tier = 1;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new LadybugAbility(this, this.logService));
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


export class LadybugAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LadybugAbility',
      owner: owner,
      triggers: ['FriendlyGainsPerk'],
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

    let power = this.level * 2;
    let selfTargetResp = owner.parent.getThis(owner);
    if (selfTargetResp.pet) {
      selfTargetResp.pet.increaseAttack(power);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTargetResp.pet.name} ${power} attack.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LadybugAbility {
    return new LadybugAbility(newOwner, this.logService);
  }
}
