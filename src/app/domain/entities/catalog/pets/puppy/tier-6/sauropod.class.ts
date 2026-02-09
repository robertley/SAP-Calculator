import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Sauropod extends Pet {
  name = 'Sauropod';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 12;
  initAbilities(): void {
    this.addAbility(
      new SauropodAbility(this, this.logService, this.abilityService),
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


export class SauropodAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;
  private readonly maxUsesPerTurn = 3;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SauropodAbility',
      owner: owner,
      triggers: ['FriendlyGainsPerk', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= this.maxUsesPerTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    const goldGain = this.level;
    this.usesThisTurn++;
    this.logService.createLog({
      message: `${owner.name} will give +${goldGain} gold next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SauropodAbility {
    return new SauropodAbility(newOwner, this.logService, this.abilityService);
  }
}


