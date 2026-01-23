import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Wasp extends Pet {
  name = 'Wasp';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new WaspAbility(this, this.logService));
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


export class WaspAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Wasp Ability',
      owner: owner,
      triggers: ['ShopUpgrade'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const multiplier = 0.5 * this.level;
    const attackGain = Math.floor(owner.attack * multiplier);

    if (attackGain > 0) {
      owner.increaseAttack(attackGain);

      this.logService.createLog({
        message: `${owner.name} gained +${attackGain} attack from Shop Upgrade.`,
        type: 'ability',
        player: owner.parent,
      });
    }
  }

  override copy(newOwner: Pet): WaspAbility {
    return new WaspAbility(newOwner, this.logService);
  }
}
