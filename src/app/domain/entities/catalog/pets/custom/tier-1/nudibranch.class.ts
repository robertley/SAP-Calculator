import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Nudibranch extends Pet {
  name = 'Nudibranch';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new NudibranchAbility(this, this.logService));
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


export class NudibranchAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'NudibranchAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const owner = this.owner;
        let petSet: Set<string> = new Set();
        for (const pet of owner.parent.petArray) {
          if (petSet.has(pet.name)) {
            return false;
          }
          petSet.add(pet.name);
        }
        return true;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const attackGain = this.level * 3;
    const healthGain = this.level;
    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gained +${attackGain} attack and +${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NudibranchAbility {
    return new NudibranchAbility(newOwner, this.logService);
  }
}


