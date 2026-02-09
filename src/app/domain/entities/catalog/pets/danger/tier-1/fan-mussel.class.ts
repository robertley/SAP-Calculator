import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class FanMussel extends Pet {
  name = 'Fan Mussel';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;

  initAbilities(): void {
    this.addAbility(new FanMusselAbility(this));
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


export class FanMusselAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'FanMusselAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
  }

  private executeAbility(context: AbilityContext): void {
    // Empty implementation - to be filled by user
    //this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FanMusselAbility {
    return new FanMusselAbility(newOwner);
  }
}


