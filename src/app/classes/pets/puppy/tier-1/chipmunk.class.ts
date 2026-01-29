import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Chipmunk extends Pet {
  name = 'Chipmunk';
  tier = 1;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new ChipmunkAbility(this, this.logService, this.abilityService),
    );
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


export class ChipmunkAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ChipmunkAbility',
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
    const owner = this.owner;
    const perk = owner.equipment;
    const count = this.level;
    if (!perk) {
      this.logService.createLog({
        message: `${owner.name} had no food perk to stock.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
      this.triggerTigerExecution(context);
      return;
    }

    const plural = count === 1 ? '' : 's';
    this.logService.createLog({
      message: `${owner.name} stocked ${count} free ${perk.name}${plural}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChipmunkAbility {
    return new ChipmunkAbility(newOwner, this.logService, this.abilityService);
  }
}
