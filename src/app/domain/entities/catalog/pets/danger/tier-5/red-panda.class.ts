import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Player } from '../../../../player.class';
import { Pet, Pack } from '../../../../pet.class';
import { Equipment } from '../../../../equipment.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class RedPanda extends Pet {
  name = 'Red Panda';
  tier = 5;
  pack: Pack = 'Danger';
  health = 4;
  attack = 4;

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


export class RedPandaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'RedPandaAbility',
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
    // Empty implementation - to be filled by user
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RedPandaAbility {
    return new RedPandaAbility(newOwner, this.logService, this.abilityService);
  }
}


