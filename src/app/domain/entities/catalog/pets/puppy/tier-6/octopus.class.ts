import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Octopus extends Pet {
  name = 'Octopus';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 8;
  health = 8;
  initAbilities(): void {
    this.addAbility(new OctopusAbility(this, this.logService));
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


export class OctopusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'OctopusAbility',
      owner: owner,
      triggers: ['ThisAttacked'],
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

    const targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      [owner],
      null,
      true,
      owner,
    );
    let targets = targetsResp.pets;
    let power = 6;
    for (let target of targets) {
      if (target == null) {
        return;
      }
      owner.snipePet(target, power, targetsResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OctopusAbility {
    return new OctopusAbility(newOwner, this.logService);
  }
}


