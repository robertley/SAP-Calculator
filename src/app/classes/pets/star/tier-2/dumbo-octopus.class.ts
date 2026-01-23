import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Player } from '../../../player.class';
import { Pet, Pack } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class DumboOctopus extends Pet {
  name = 'Dumbo Octopus';
  tier = 2;
  pack: Pack = 'Star';
  health = 5;
  attack = 2;

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


export class DumboOctopusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'DumboOctopusAbility',
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

  copy(newOwner: Pet): DumboOctopusAbility {
    return new DumboOctopusAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
