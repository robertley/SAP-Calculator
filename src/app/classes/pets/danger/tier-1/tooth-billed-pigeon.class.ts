import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class ToothBilledPigeon extends Pet {
  name = 'Tooth Billed Pigeon';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 3;
  health = 1;

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


export class ToothBilledPigeonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ToothBilledPigeonAbility',
      owner: owner,
      triggers: ['ThisSold'],
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
    //this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ToothBilledPigeonAbility {
    return new ToothBilledPigeonAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
