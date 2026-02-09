import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { GreatOne } from 'app/domain/entities/catalog/pets/custom/tier-6/great-one.class';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';


export class EvilBook extends Toy {
  name = 'Evil Book';
  tier = 5;
  emptyFromSpace(
    gameApi?: GameAPI,
    puma?: boolean,
    level?: number,
    priority?: number,
  ) {
    let power = {
      attack: level * 6,
      health: level * 6,
    };
    let exp = level == 1 ? 0 : level == 2 ? 2 : 5;

    let greatOne = new GreatOne(
      this.logService,
      this.abilityService,
      this.parent,
      power.health,
      power.attack,
      0,
      exp,
    );
    let message = `${this.name} spawned Great One (${power.attack}/${power.health}).`;

    if (this.parent.summonPet(greatOne, 0).success) {
      this.logService.createLog({
        message: message,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }

    this.used = true;
  }
  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    protected abilityService: AbilityService,
    parent,
    level,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class EvilBookAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'EvilBookAbility',
      owner: owner,
      triggers: ['EmptyFrontSpace'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context): boolean => {
        const owner = this.owner;
        return owner.parent.pet0 == null;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Evil Book toy behavior (emptyFromSpace method)
    let power = {
      attack: this.level * 6,
      health: this.level * 6,
    };

    let greatOne = new GreatOne(
      this.logService,
      this.abilityService,
      owner.parent,
      power.health,
      power.attack,
      0,
      this.minExpForLevel,
    );
    let result = owner.parent.summonPet(greatOne, 0);
    if (result.success) {
      let message = `Evil Book Ability spawned Great One (${power.attack}/${power.health}).`;
      this.logService.createLog({
        message: message,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: result.randomEvent,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): EvilBookAbility {
    return new EvilBookAbility(newOwner, this.logService, this.abilityService);
  }
}




