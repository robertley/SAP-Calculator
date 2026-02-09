import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Coconut } from 'app/domain/entities/catalog/equipment/turtle/coconut.class';


export class CoconutCrab extends Pet {
  name = 'Coconut Crab';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 4;
  health = 8;
  initAbilities(): void {
    this.addAbility(new CoconutCrabAbility(this, this.logService));
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


export class CoconutCrabAbility extends Ability {
  private logService: LogService;
  private hasCoconut = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Coconut Crab Ability',
      owner: owner,
      triggers: ['Eat2', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    if (context.trigger === 'StartTurn') {
      if (this.hasCoconut) {
        owner.removePerk(true);
        this.hasCoconut = false;
      }
      return;
    }

    if (context.trigger === 'Eat2') {
      const coconut = new Coconut();
      coconut.uses = this.level;
      coconut.originalUses = this.level;
      owner.givePetEquipment(coconut);
      this.hasCoconut = true;

      this.logService.createLog({
        message: `${owner.name} gained Coconut perk that works ${this.level === 1 ? 'once' : this.level === 2 ? 'twice' : 'thrice'} until next turn.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
      this.triggerTigerExecution(context);
    }
  }

  copy(newOwner: Pet): CoconutCrabAbility {
    return new CoconutCrabAbility(newOwner, this.logService);
  }
}



