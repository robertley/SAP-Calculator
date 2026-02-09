import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { minExpForLevel } from 'app/runtime/experience';


export class HoodedSeal extends Pet {
  name = 'Hooded Seal';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 4;
  health = 9;
  initAbilities(): void {
    this.addAbility(new HoodedSealAbility(this, this.logService));
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


export class HoodedSealAbility extends Ability {
  private logService: LogService;
  private usesThisTurn = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Hooded Seal Ability',
      owner: owner,
      triggers: ['FriendTransformed', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      return;
    }

    if (this.usesThisTurn >= 2) {
      this.triggerTigerExecution(context);
      return;
    }

    const transformedPet = context.triggerPet;
    if (!transformedPet) {
      this.triggerTigerExecution(context);
      return;
    }

    this.usesThisTurn++;
    const desiredExp = minExpForLevel(this.level);
    transformedPet.exp = Math.min(transformedPet.exp, desiredExp);
    transformedPet.resetAbilityUses();

    this.logService.createLog({
      message: `${this.owner.name} capped ${transformedPet.name} to level ${this.level}.`,
      type: 'ability',
      player: this.owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HoodedSealAbility {
    return new HoodedSealAbility(newOwner, this.logService);
  }
}





