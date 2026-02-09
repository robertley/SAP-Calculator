import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Trout extends Pet {
  name = 'Trout';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new TroutAbility(this, this.logService));
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


export class TroutAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Trout Ability',
      owner: owner,
      triggers: ['FriendSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const soldPet = context.triggerPet;

    if (!soldPet || soldPet.sellValue < 3) {
      this.triggerTigerExecution(context);
      return;
    }

    const attackGain = Math.max(1, this.level);
    const healthGain = attackGain * 2;
    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gained +${attackGain}/+${healthGain} after ${soldPet.name} was sold.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TroutAbility {
    return new TroutAbility(newOwner, this.logService);
  }
}


