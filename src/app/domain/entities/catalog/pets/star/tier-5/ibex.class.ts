import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Ibex extends Pet {
  name = 'Ibex';
  tier = 5;
  pack: Pack = 'Star';
  attack = 6;
  health = 7;

  initAbilities(): void {
    this.addAbility(new IbexAbility(this, this.logService));
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


export class IbexAbility extends Ability {
  private logService: LogService;
  private affectedEnemies: Set<Pet> = new Set();
  reset(): void {
    this.maxUses = this.level;
    this.affectedEnemies = new Set();
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'IbexAbility',
      owner: owner,
      triggers: ['EnemyHurt', 'EnemyPushed'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return (
          triggerPet &&
          triggerPet.alive &&
          !this.affectedEnemies.has(triggerPet)
        );
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    // Calculate 70% health reduction
    let healthReduction = Math.floor(triggerPet.health * 0.7);

    // Apply damage
    target.increaseHealth(-healthReduction);

    // Track affected enemy
    this.affectedEnemies.add(target);

    // Log the effect
    this.logService.createLog({
      message: `${owner.name} removed ${healthReduction} health from ${triggerPet.name} (70%)`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): IbexAbility {
    return new IbexAbility(newOwner, this.logService);
  }
}


