import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Guineafowl extends Pet {
  name = 'Guineafowl';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new GuineafowlAbility(this, this.logService));
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


export class GuineafowlAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GuineafowlAbility',
      owner: owner,
      triggers: ['ThisHurt'],
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
    const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
    trumpetTargetResp.player.gainTrumpets(
      power,
      owner,
      pteranodon,
      undefined,
      undefined,
      trumpetTargetResp.random,
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GuineafowlAbility {
    return new GuineafowlAbility(newOwner, this.logService);
  }
}
