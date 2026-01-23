import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Player } from '../../../player.class';
import { Pet, Pack } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Siamese extends Pet {
  name = 'Siamese';
  tier = 4;
  pack: Pack = 'Star';
  health = 4;
  attack = 1;

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


export class SiameseAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SiameseAbility',
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

  copy(newOwner: Pet): SiameseAbility {
    return new SiameseAbility(newOwner, this.logService, this.abilityService);
  }
}
