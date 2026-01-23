import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class DeerLord extends Pet {
  name = 'Deer Lord';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  override initAbilities(): void {
    this.addAbility(new DeerLordAbility(this, this.logService));
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


export class DeerLordAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Deer Lord Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const friendAhead = owner.petAhead;

    if (friendAhead) {
      // Knock out the friend ahead
      friendAhead.health = 0;

      this.logService.createLog({
        message: `${owner.name} knocked out ${friendAhead.name}.`,
        type: 'ability',
        player: owner.parent,
      });

      // Stock free Bacon
      const amount = this.level;
      this.logService.createLog({
        message: `${owner.name} stocked ${amount} free Bacon.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): DeerLordAbility {
    return new DeerLordAbility(newOwner, this.logService);
  }
}
