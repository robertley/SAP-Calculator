import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Jerboa extends Pet {
  name = 'Jerboa';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new JerboaAbility(this, this.logService, this.abilityService),
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


export class JerboaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private lastTriggeredTurn: number | null = null;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Jerboa Ability',
      owner: owner,
      triggers: ['AppleEatenByThis'],
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
    const { tiger, pteranodon, gameApi } = context;
    const owner = this.owner;
    const turnNumber = gameApi?.turnNumber ?? null;

    if (turnNumber != null && this.lastTriggeredTurn === turnNumber) {
      this.triggerTigerExecution(context);
      return;
    }

    this.lastTriggeredTurn = turnNumber;
    const buff = this.level;
    const player = owner.parent;
    const targets = player.petArray.filter(
      (friend) => friend && friend.alive && friend !== owner,
    );

    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const friend of targets) {
      friend.increaseAttack(buff);
      friend.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} ate an apple and gave friendly pets +${buff}/+${buff}.`,
      type: 'ability',
      player: player,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): JerboaAbility {
    return new JerboaAbility(newOwner, this.logService, this.abilityService);
  }
}


