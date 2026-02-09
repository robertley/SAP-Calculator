import { Pet } from '../../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BrazillianTreehopper extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Brazillian Treehopper';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 2;
    this.health = 3;
  }

  initAbilities(): void {
    this.abilityList = [new BrazillianTreehopperAbility(this, this.logService)];
    super.initAbilities();
  }
}


export class BrazillianTreehopperAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Brazillian Treehopper Ability',
      owner: owner,
      triggers: ['StartBattle'],
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
    const targetCount = 2 * this.level;
    const targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      targetCount,
      [],
      false,
      false,
      owner,
    );
    const targets = targetsResp.pets;

    if (targets.length > 1) {
      let totalAttack = 0;
      let totalHealth = 0;
      for (const target of targets) {
        totalAttack += target.attack;
        totalHealth += target.health;
      }

      const avgAttack = Math.floor(totalAttack / targets.length);
      const avgHealth = Math.floor(totalHealth / targets.length);

      for (const target of targets) {
        target.attack = Math.max(1, avgAttack);
        target.health = Math.max(1, avgHealth);
      }

      this.logService.createLog({
        message: `${owner.name} averaged stats of ${targets.length} enemies to ${avgAttack}/${avgHealth}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): BrazillianTreehopperAbility {
    return new BrazillianTreehopperAbility(newOwner, this.logService);
  }
}


