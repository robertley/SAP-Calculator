import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Daycrawler } from 'app/classes/pets/hidden/daycrawler.class';


export class Nightcrawler extends Pet {
  name = 'Nightcrawler';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new NightcrawlerAbility(this, this.logService, this.abilityService),
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


export class NightcrawlerAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'NightcrawlerAbility',
      owner: owner,
      triggers: ['ThisDied'],
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

    let isPlayer = owner.parent == gameApi.player;
    let summonedAmount = isPlayer
      ? gameApi.playerSummonedAmount
      : gameApi.opponentSummonedAmount;

    if (summonedAmount == 0) {
      return;
    }

    let health = Math.min(50, this.level * summonedAmount);
    let attack = 6;

    let dayCrawler = new Daycrawler(
      this.logService,
      this.abilityService,
      owner.parent,
      health,
      attack,
      0,
      0,
    );

    let summonResult = owner.parent.summonPet(
      dayCrawler,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Daycrawler (${attack}/${health})`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NightcrawlerAbility {
    return new NightcrawlerAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
