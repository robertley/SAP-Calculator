import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Armadillo extends Pet {
  name = 'Armadillo';
  tier = 5;
  pack: Pack = 'Turtle';
  attack = 4;
  health = 8;
  initAbilities(): void {
    this.addAbility(new ArmadilloAbility(this, this.logService));
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


export class ArmadilloAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ArmadilloAbility',
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

    let targetsResp = owner.parent.getAll(true, owner);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let pet of targets) {
      if (!pet.alive) {
        continue;
      }
      let power = 8 * this.level;
      pet.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} increased health of ${pet.name} by ${power}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ArmadilloAbility {
    return new ArmadilloAbility(newOwner, this.logService);
  }
}


