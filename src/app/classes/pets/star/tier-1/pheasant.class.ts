import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Strawberry } from 'app/classes/equipment/star/strawberry.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class Pheasant extends Pet {
  name = 'Pheasant';
  tier = 1;
  pack: Pack = 'Star';
  attack = 2;
  health = 1;

  initAbilities(): void {
    this.addAbility(
      new PheasantAbility(this, this.logService, this.abilityService),
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


export class PheasantAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PheasantAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} a Strawberry.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    target.givePetEquipment(new Strawberry(this.logService));

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PheasantAbility {
    return new PheasantAbility(newOwner, this.logService, this.abilityService);
  }
}

