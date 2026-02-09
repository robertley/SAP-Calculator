import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GreatPotoo extends Pet {
  name = 'Great Potoo';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new GreatPotooAbility(this, this.logService));
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


export class GreatPotooAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Great Potoo Ability',
      owner: owner,
      triggers: ['AnyoneHurt'],
      abilityType: 'Pet',
      native: true,
      maxUses: 5,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;

    // "If nobody has attacked" logic
    // We check if the first physical attack has happened yet.
    const hasAnyoneAttacked = gameApi.FirstNonJumpAttackHappened === true;

    if (!hasAnyoneAttacked) {
      const healthBuff = 2 * this.level;
      owner.increaseHealth(healthBuff);

      this.logService.createLog({
        message: `${owner.name} gained +${healthBuff} health from AnyoneHurt (before any attacks).`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): GreatPotooAbility {
    return new GreatPotooAbility(newOwner, this.logService);
  }
}


