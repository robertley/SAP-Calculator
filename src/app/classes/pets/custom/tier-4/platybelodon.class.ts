import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Platybelodon extends Pet {
  name = 'Platybelodon';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;

  initAbilities(): void {
    this.addAbility(new PlatybelodonAbility(this, this.logService));
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


export class PlatybelodonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PlatybelodonAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    // Get roll amount from gameApi
    let rollAmount = 0;

    // Determine if this is player's pet or opponent's pet and get appropriate roll count
    if (owner.parent === gameApi.player) {
      rollAmount = gameApi.playerRollAmount || 0;
    } else if (owner.parent === gameApi.opponent) {
      rollAmount = gameApi.opponentRollAmount || 0;
    }

    let trumpetsGained = this.level * Math.min(rollAmount, 8);

    if (trumpetsGained > 0) {
      const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
      trumpetTargetResp.player.gainTrumpets(
        trumpetsGained,
        owner,
        tiger,
        undefined,
        undefined,
        trumpetTargetResp.random,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PlatybelodonAbility {
    return new PlatybelodonAbility(newOwner, this.logService);
  }
}
