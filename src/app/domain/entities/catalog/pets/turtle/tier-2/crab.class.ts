import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Crab extends Pet {
  name = 'Crab';
  tier = 2;
  pack: Pack = 'Turtle';
  health = 1;
  attack = 4;
  initAbilities(): void {
    this.addAbility(new CrabAbility(this, this.logService));
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


export class CrabAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CrabAbility',
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

    if (!owner.alive) {
      return;
    }

    let highestHealthResp = owner.parent.getHighestHealthPet(owner, owner);
    if (highestHealthResp.pet == null) {
      return;
    }

    let gainAmmt = Math.ceil(
      highestHealthResp.pet.health * (0.25 * this.level),
    );
    let selfTargetResp = owner.parent.getThis(owner);
    if (selfTargetResp.pet) {
      selfTargetResp.pet.increaseHealth(gainAmmt);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTargetResp.pet.name} ${0.25 * this.level * 100}% of ${highestHealthResp.pet.name}'s health (${gainAmmt})`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CrabAbility {
    return new CrabAbility(newOwner, this.logService);
  }
}


