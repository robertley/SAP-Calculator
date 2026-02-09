import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Pet } from '../../../pet.class';
import { GiantEyesDog } from 'app/domain/entities/catalog/pets/hidden/giant-eyes-dog.class';
import { Player } from '../../../player.class';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class TinderBox extends Toy {
  name = 'Tinder Box';
  tier = 4;
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

    let giantEyesDog = new GiantEyesDog(
      this.logService,
      this.abilityService,
      this.parent,
      power.health,
      power.attack,
      0,
      exp,
    );
    let message = `${this.name} spawned Giant Eyes Dog (${power.attack}/${power.health}).`;

    if (this.parent.summonPet(giantEyesDog, 0).success) {
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
    parent: Player,
    level: number,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class TinderBoxAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private used: boolean = false;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'TinderBoxAbility',
      owner: owner,
      triggers: [],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Tinder Box toy behavior (emptyFromSpace method)
    let power = {
      attack: this.level * 6,
      health: this.level * 6,
    };
    let exp = this.level == 1 ? 0 : this.level == 2 ? 2 : 5;

    let giantEyesDog = new GiantEyesDog(
      this.logService,
      this.abilityService,
      owner.parent,
      power.health,
      power.attack,
      0,
      exp,
    );
    let message = `Tinder Box Ability spawned Giant Eyes Dog (${power.attack}/${power.health}).`;

    if (owner.parent.summonPet(giantEyesDog, 0).success) {
      this.logService.createLog({
        message: message,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.used = true;

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TinderBoxAbility {
    return new TinderBoxAbility(newOwner, this.logService, this.abilityService);
  }
}



