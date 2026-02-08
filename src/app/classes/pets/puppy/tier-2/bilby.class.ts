import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Garlic } from 'app/classes/equipment/turtle/garlic.class';
import { hasAliveTriggerTarget, resolveTriggerTargetAlive } from 'app/classes/ability-helpers';


export class Bilby extends Pet {
  name = 'Bilby';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new BilbyAbility(this, this.logService));
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


export class BilbyAbility extends Ability {
  private logService: LogService;

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BilbyAbility',
      owner: owner,
      triggers: ['FriendLostPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      precondition: (context: AbilityContext) =>
        hasAliveTriggerTarget(this.owner, context.triggerPet, {
          excludeOwner: true,
        }),
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = resolveTriggerTargetAlive(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Garlic.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });
    target.givePetEquipment(new Garlic());

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BilbyAbility {
    return new BilbyAbility(newOwner, this.logService);
  }
}
