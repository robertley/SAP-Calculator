import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { logAbility } from 'app/classes/ability-helpers';


export class Hippocampus extends Pet {
  name = 'Hippocampus';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new HippocampusAbility(this, this.logService));
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


export class HippocampusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HippocampusAbility',
      owner: owner,
      triggers: ['FriendAheadFainted'],
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
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    if (!gameApi) {
      this.triggerTigerExecution(context);
      return;
    }

    const rollAmount =
      owner.parent === gameApi.player
        ? gameApi.playerRollAmount || 0
        : gameApi.opponentRollAmount || 0;
    const manaGain = rollAmount * this.level;
    if (manaGain <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.increaseMana(manaGain);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gained ${manaGain} mana from ${rollAmount} rolls this turn.`,
      tiger,
      pteranodon,
    );

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HippocampusAbility {
    return new HippocampusAbility(newOwner, this.logService);
  }
}

