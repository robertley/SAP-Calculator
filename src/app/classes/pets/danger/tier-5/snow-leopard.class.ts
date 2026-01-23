import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class SnowLeopard extends Pet {
  name = 'Snow Leopard';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 3;
  health = 5;

  initAbilities(): void {
    this.addAbility(new SnowLeopardAbility(this, this.logService));
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


export class SnowLeopardAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SnowLeopardAbility',
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

    let statGain = this.level * 5; // 5/10/15
    let targetResp = owner.parent.opponent.getRandomPet(
      [],
      false,
      true,
      false,
      owner,
    );

    // Then jump-attack random enemy
    if (targetResp.pet && targetResp.pet.alive) {
      owner.jumpAttackPrep(targetResp.pet);

      // Apply stat gain to transformed pet if transformed, otherwise use Silly-aware self-targeting
      if (owner.transformed && owner.transformedInto) {
        let selfTargetResp = owner.parent.getThis(owner.transformedInto);
        if (selfTargetResp.pet) {
          owner.transformedInto.increaseAttack(statGain);
          owner.transformedInto.increaseHealth(statGain);
          this.logService.createLog({
            message: `${owner.name} gave ${owner.transformedInto.name} ${statGain} attack and ${statGain} health`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: selfTargetResp.random,
          });
        }
      } else {
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
          selfTargetResp.pet.increaseAttack(statGain);
          selfTargetResp.pet.increaseHealth(statGain);
          this.logService.createLog({
            message: `${owner.name} gave ${selfTargetResp.pet.name} ${statGain} attack and ${statGain} health`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: selfTargetResp.random,
          });
        }
      }
      owner.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SnowLeopardAbility {
    return new SnowLeopardAbility(newOwner, this.logService);
  }
}
