import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Warf extends Pet {
  name = 'Warf';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 2;

  override initAbilities(): void {
    this.addAbility(new WarfAbility(this, this.logService));
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


export class WarfAbility extends Ability {
  private logService: LogService;
  private usedFirstTrigger = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Warf Ability',
      owner: owner,
      triggers: ['ThisGainedMana', 'StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    if (context.trigger === 'StartBattle') {
      this.usedFirstTrigger = false;
      this.triggerTigerExecution(context);
      return;
    }

    const targetResp = owner.parent.opponent.getRandomPet(
      [],
      false,
      false,
      false,
      owner,
    );
    if (targetResp.pet) {
      const target = targetResp.pet;
      const baseDamage = this.level;
      const damage = this.usedFirstTrigger ? baseDamage : baseDamage * 3;

      owner.snipePet(target, damage, targetResp.random, tiger, pteranodon);

      this.logService.createLog({
        message: `${owner.name} gained mana and dealt ${damage} damage to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetResp.random,
      });

      this.usedFirstTrigger = true;
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): WarfAbility {
    return new WarfAbility(newOwner, this.logService);
  }
}


