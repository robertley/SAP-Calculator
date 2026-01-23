import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Melon } from 'app/classes/equipment/turtle/melon.class';


export class Ox extends Pet {
  name = 'Ox';
  tier = 3;
  pack: Pack = 'Turtle';
  health = 3;
  attack = 1;

  initAbilities(): void {
    this.addAbility(new OxAbility(this, this.logService));
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


export class OxAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'OxAbility',
      owner: owner,
      triggers: ['FriendAheadDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    target.increaseAttack(1);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +1 attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    let melonTargetResp = owner.parent.getThis(owner);
    let melonTarget = melonTargetResp.pet;
    if (melonTarget == null) {
      return;
    }

    melonTarget.givePetEquipment(new Melon());
    this.logService.createLog({
      message: `${owner.name} gave ${melonTarget.name} Melon.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: melonTargetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  copy(newOwner: Pet): OxAbility {
    return new OxAbility(newOwner, this.logService);
  }
}
