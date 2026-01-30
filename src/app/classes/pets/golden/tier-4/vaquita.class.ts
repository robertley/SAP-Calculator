import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Vaquita extends Pet {
  name = 'Vaquita';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new VaquitaAbility(this, this.logService));
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


export class VaquitaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VaquitaAbility',
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

    let trumpetAmt = Math.max(
      Math.floor(this.level * 0.5 * owner.parent.trumpets),
      this.level * 4,
    );
    const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
    trumpetTargetResp.player.gainTrumpets(
      trumpetAmt,
      owner,
      pteranodon,
      undefined,
      undefined,
      trumpetTargetResp.random,
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VaquitaAbility {
    return new VaquitaAbility(newOwner, this.logService);
  }
}

