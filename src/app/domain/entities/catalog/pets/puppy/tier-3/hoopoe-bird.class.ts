import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class HoopoeBird extends Pet {
  name = 'Hoopoe Bird';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new HoopoeBirdAbility(this, this.logService));
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


export class HoopoeBirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HoopoeBirdAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let opponent = owner.parent.opponent;

    // Get front target
    let targetFrontResp = opponent.getFurthestUpPet(owner);
    let targetFront = targetFrontResp.pet;

    // Get back target (could be different if Silly)
    let targetBackResp = opponent.getLastPet(undefined, owner);
    let targetBack = targetBackResp.pet;

    let power = 2 * this.level;

    if (targetFront) {
      owner.snipePet(
        targetFront,
        power,
        targetFrontResp.random,
        tiger,
        pteranodon,
      );
    }
    if (targetBack) {
      owner.snipePet(
        targetBack,
        power,
        targetBackResp.random,
        tiger,
        pteranodon,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HoopoeBirdAbility {
    return new HoopoeBirdAbility(newOwner, this.logService);
  }
}



