import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/domain/entities/ability-resolution';


export class Amalgamation extends Pet {
  name = 'Amalgamation';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new AmalgamationAbility(this, this.logService));
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


export class AmalgamationAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmalgamationAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (!triggerPet) {
      return;
    }

    const targetResp = resolveFriendSummonedTarget(
      owner,
      triggerPet,
      (o, pet) => o.parent.getSpecificPet(o, pet),
    );
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    const attackAmount = this.level * 3;
    const manaAmount = this.level * 4;

    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} +${attackAmount} attack, +${manaAmount} mana, and Spooked.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    target.increaseAttack(attackAmount);
    target.increaseMana(manaAmount);
    target.givePetEquipment(new Spooked());

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmalgamationAbility {
    return new AmalgamationAbility(newOwner, this.logService);
  }
}





