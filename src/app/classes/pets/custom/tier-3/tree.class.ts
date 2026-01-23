import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Coconut } from 'app/classes/equipment/turtle/coconut.class';


export class Tree extends Pet {
  name = 'Tree';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new TreeAbility(this, this.logService));
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


export class TreeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Tree Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const thresholds = [6, 12, 18];
    const threshold =
      thresholds[Math.min(this.level - 1, thresholds.length - 1)];

    if (owner.attack <= threshold) {
      owner.givePetEquipment(new Coconut());
      this.logService.createLog({
        message: `${owner.name} gained Coconut perk for meeting the ${threshold} attack threshold.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): TreeAbility {
    return new TreeAbility(newOwner, this.logService);
  }
}
