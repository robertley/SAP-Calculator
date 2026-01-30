import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Silverfish extends Pet {
  name = 'Silverfish';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 2;
  override initAbilities(): void {
    this.addAbility(new SilverfishAbility(this, this.logService));
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


export class SilverfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Silverfish Ability',
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
    const goldGain = this.level * 2;
    const goldLoss = this.level;

    this.logService.createLog({
      message: `${owner.name} sold for +${goldGain} gold, but will lose ${goldLoss} gold next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SilverfishAbility {
    return new SilverfishAbility(newOwner, this.logService);
  }
}
