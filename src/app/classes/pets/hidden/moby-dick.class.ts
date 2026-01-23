import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext, AbilityTrigger } from 'app/classes/ability.class';


export class MobyDick extends Pet {
  name = 'Moby Dick';
  tier = 1;
  pack: Pack = 'Custom';
  hidden: boolean = true;
  attack = 8;
  health = 8;
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

  initAbilities(): void {
    this.addAbility(
      new MobyDickAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
}


export class MobyDickAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MobyDickAbility',
      owner: owner,
      triggers: [], // Will be overridden by getter
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

  public override get triggers(): AbilityTrigger[] {
    const triggers: AbilityTrigger[] = ['StartBattle'];
    if (this.owner.level > 1) {
      triggers.push('ThisSummoned');
    }
    return triggers;
  }

  private executeAbility(context: AbilityContext): void {
    this.logService.createLog({
      message: `${this.owner.name} removed itself.`,
      type: 'ability',
      player: this.owner.parent,
    });

    // Set removed to true to avoid triggering faint effects
    this.owner.removed = true;

    // Remove from player slot
    const player = this.owner.parent;
    if (player) {
      if (player.pet0 === this.owner) player.pet0 = null;
      if (player.pet1 === this.owner) player.pet1 = null;
      if (player.pet2 === this.owner) player.pet2 = null;
      if (player.pet3 === this.owner) player.pet3 = null;
      if (player.pet4 === this.owner) player.pet4 = null;
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MobyDickAbility {
    return new MobyDickAbility(newOwner, this.logService, this.abilityService);
  }
}
