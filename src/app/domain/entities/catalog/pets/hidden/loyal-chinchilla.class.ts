import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class LoyalChinchilla extends Pet {
  name = 'Loyal Chinchilla';
  tier = 1;
  pack: Pack = 'Puppy';
  hidden: boolean = true;
  health = 2;
  attack = 2;
  initAbilities(): void {
    this.addAbility(
      new LoyalChinchillaAbility(this, this.logService, this.abilityService),
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


export class LoyalChinchillaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LoyalChinchillaAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    // Empty implementation - vanilla token
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LoyalChinchillaAbility {
    return new LoyalChinchillaAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


