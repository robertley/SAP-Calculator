import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getAdjacentAlivePets } from 'app/domain/entities/ability-resolution';


export class WormOfSand extends Pet {
  name = 'Worm of Sand';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new WormOfSandAbility(this, this.logService, this.abilityService),
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


export class WormOfSandAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'WormOfSandAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    const rolls =
      owner.parent === context.gameApi.player
        ? context.gameApi.playerRollAmount
        : context.gameApi.opponentRollAmount;
    const rollCount = Math.min(Math.max(rolls ?? 0, 0), 8);
    const stacks = Math.floor(rollCount / 4);
    if (stacks <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level * stacks;
    const targets = getAdjacentAlivePets(owner);
    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    if (targets.length > 0) {
      this.logService.createLog({
        message: `${owner.name} gave adjacent friends +${buff}/+${buff}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targets.length > 1,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WormOfSandAbility {
    return new WormOfSandAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



