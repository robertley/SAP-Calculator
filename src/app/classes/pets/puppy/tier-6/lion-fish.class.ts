import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Lionfish extends Pet {
  name = 'Lionfish';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 10;
  health = 4;
  initAbilities(): void {
    this.addAbility(new LionfishAbility(this, this.logService));
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


export class LionfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LionfishAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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
    let snipeAmt = 1 + Math.floor(owner.attack / 10);
    for (let i = 0; i < snipeAmt; i++) {
      let targetResp = opponent.getRandomPet([], false, true, false, owner);
      if (targetResp.pet == null) {
        return;
      }
      let power = this.level * 3;
      owner.snipePet(
        targetResp.pet,
        power,
        targetResp.random,
        tiger,
        pteranodon,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LionfishAbility {
    return new LionfishAbility(newOwner, this.logService);
  }
}
