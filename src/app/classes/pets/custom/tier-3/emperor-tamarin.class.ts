import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class EmperorTamarin extends Pet {
  name = 'Emperor Tamarin';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new EmperorTamarinAbility(this, this.logService));
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


export class EmperorTamarinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Emperor Tamarin Ability',
      owner: owner,
      triggers: ['ThisSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const percentage = this.level === 1 ? 33 : this.level === 2 ? 66 : 100;

    // Shop logic - log the effect
    this.logService.createLog({
      message: `${owner.name} sold and gave ${percentage}% of its stats to the leftmost shop pet.`,
      type: 'ability',
      player: owner.parent,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): EmperorTamarinAbility {
    return new EmperorTamarinAbility(newOwner, this.logService);
  }
}
