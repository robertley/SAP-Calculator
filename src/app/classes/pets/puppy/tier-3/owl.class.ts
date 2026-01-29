import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Mouse } from 'app/classes/pets/custom/tier-1/mouse.class';


export class Owl extends Pet {
  name = 'Owl';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new OwlAbility(this, this.logService, this.abilityService));
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


export class OwlAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'OwlAbility',
      owner: owner,
      triggers: ['StartTurn'],
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
    const exp = this.minExpForLevel;
    const mouse = new Mouse(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      null,
      exp,
    );

    const summonResult = owner.parent.summonPet(
      mouse,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a level ${this.level} Mouse.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OwlAbility {
    return new OwlAbility(newOwner, this.logService, this.abilityService);
  }
}
