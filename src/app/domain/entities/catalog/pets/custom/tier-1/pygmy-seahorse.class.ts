import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class PygmySeahorse extends Pet {
  name = 'Pygmy Seahorse';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 3;
  health = 1;
  initAbilities(): void {
    this.addAbility(new PygmySeahorseAbility(this, this.logService));
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


export class PygmySeahorseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PygmySeahorseAbility',
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const targetsResp = owner.parent.getRandomPets(
      3,
      [owner],
      false,
      false,
      owner,
    );
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      target.increaseAttack(this.level);
      target.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${this.level} attack and +${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    owner.health = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PygmySeahorseAbility {
    return new PygmySeahorseAbility(newOwner, this.logService);
  }
}


