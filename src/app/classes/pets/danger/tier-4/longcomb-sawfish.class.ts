import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class LongcombSawfish extends Pet {
  name = 'Longcomb Sawfish';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 3;
  health = 3;

  initAbilities(): void {
    this.addAbility(new LongcombSawfishAbility(this, this.logService));
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


export class LongcombSawfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LongcombSawfishAbility',
      owner: owner,
      triggers: ['EnemyAttacked5'],
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
    let healthGain = this.level * 4; // 4/8/12 health gain based on level
    let healthRemoval = this.level * -4; // 4/8/12 health removal based on level

    // Gain health for self
    let selfTargetResp = owner.parent.getThis(owner);
    let selfTarget = selfTargetResp.pet;
    if (selfTarget) {
      selfTarget.increaseHealth(healthGain);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTarget.name} ${healthGain} health`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Remove health from all alive enemies
    let targetsResp = owner.parent.opponent.getAll(false, owner);
    let targets = targetsResp.pets;
    for (let targetPet of targets) {
      targetPet.increaseHealth(healthRemoval);
      this.logService.createLog({
        message: `${owner.name} reduced ${targetPet.name} health by ${Math.abs(healthRemoval)}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LongcombSawfishAbility {
    return new LongcombSawfishAbility(newOwner, this.logService);
  }
}
