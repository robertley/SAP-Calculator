import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { MelonSlice } from 'app/classes/equipment/custom/melon-slice.class';
import { hasAliveTriggerTarget, resolveTriggerTargetAlive } from 'app/classes/ability-helpers';


export class YetiCrab extends Pet {
  name = 'Yeti Crab';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(new YetiCrabAbility(this, this.logService));
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


export class YetiCrabAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Yeti Crab Ability',
      owner: owner,
      triggers: ['PetLostPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      precondition: (context: AbilityContext) => {
        const { triggerPet } = context;
        const owner = this.owner;
        if (!triggerPet) {
          return false;
        }
        if (triggerPet.parent !== owner.parent) {
          return triggerPet.alive;
        }
        return hasAliveTriggerTarget(owner, triggerPet);
      },
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const triggerPet = context.triggerPet;
    const { tiger, pteranodon } = context;

    if (!triggerPet) {
      return;
    }

    if (triggerPet.parent === owner.parent) {
      const targetResp = resolveTriggerTargetAlive(owner, triggerPet);
      const target = targetResp.pet;
      if (!target) {
        return;
      }
      const melon = new MelonSlice();
      target.givePetEquipment(melon);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} a Melon Slice after losing a perk.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        randomEvent: targetResp.random,
      });
    } else {
      owner.dealDamage(triggerPet, 6);
      this.logService.createLog({
        message: `${owner.name} dealt 6 damage to ${triggerPet.name} after they lost a perk.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): YetiCrabAbility {
    return new YetiCrabAbility(newOwner, this.logService);
  }
}
