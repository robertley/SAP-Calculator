import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class ManaHound extends Pet {
  name = 'Mana Hound';
  tier = 3;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new ManaHoundAbility(this, this.logService));
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


export class ManaHoundAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ManaHoundAbility',
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

    let isPlayer = owner.parent == gameApi.player;
    let rollAmount;
    if (isPlayer) {
      rollAmount = gameApi.playerRollAmount;
    } else {
      rollAmount = gameApi.opponentRollAmount;
    }

    rollAmount = Math.max(0, Math.min(rollAmount ?? 0, 3));
    if (rollAmount === 0) {
      return;
    }

    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
    if (targetsAheadResp.pets.length === 0) {
      return;
    }
    let target = targetsAheadResp.pets[0];
    let manaAmt = rollAmount * this.level * 2;
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${manaAmt} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsAheadResp.random,
    });

    target.increaseMana(manaAmt);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ManaHoundAbility {
    return new ManaHoundAbility(newOwner, this.logService);
  }
}
