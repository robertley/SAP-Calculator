import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Eucalyptus } from 'app/classes/equipment/puppy/eucalyptus.class';
import { hasAliveTriggerTarget, getAliveTriggerTarget } from 'app/classes/ability-helpers';


export class Koala extends Pet {
  name = 'Koala';
  tier = 2;
  pack: Pack = 'Star';
  attack = 4;
  health = 2;
  initAbilities(): void {
    this.addAbility(new KoalaAbility(this, this.logService));
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


export class KoalaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KoalaAbility',
      owner: owner,
      triggers: ['FriendHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      precondition: (context: AbilityContext) =>
        hasAliveTriggerTarget(this.owner, context.triggerPet),
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = getAliveTriggerTarget(owner, triggerPet);
    let target = targetResp.pet;
    if (!target) {
      return;
    }

    target.givePetEquipment(new Eucalyptus());

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Eucalyptus perk.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KoalaAbility {
    return new KoalaAbility(newOwner, this.logService);
  }
}

