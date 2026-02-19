import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class AmamiRabbit extends Pet {
  name = 'Amami Rabbit';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(new AmamiRabbitAbility(this, this.logService));
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


export class AmamiRabbitAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmamiRabbitAbility',
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

    let attackGain = this.level * 1;
    let targetResp = owner.parent.opponent.getHighestAttackPet(
      undefined,
      owner,
    );

    // Then jump-attack the highest attack enemy
    if (targetResp.pet && targetResp.pet.alive) {
      owner.jumpAttackPrep(targetResp.pet);

      // Apply attack gain to transformed pet if transformed, otherwise to target pet
      if (owner.transformed && owner.transformedInto) {
        let selfTargetResp = owner.parent.getThis(owner.transformedInto);
        if (selfTargetResp.pet) {
          owner.transformedInto.increaseAttack(attackGain);
          this.logService.createLog({
            message: `${owner.name} gave ${owner.transformedInto.name} ${attackGain} attack`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: selfTargetResp.random,
          });
        }
      } else {
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
          selfTargetResp.pet.increaseAttack(attackGain);
          this.logService.createLog({
            message: `${owner.name} gave ${selfTargetResp.pet.name} ${attackGain} attack`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: selfTargetResp.random,
          });
        }
      }
      owner.jumpAttack(targetResp.pet, tiger, undefined, targetResp.random);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmamiRabbitAbility {
    return new AmamiRabbitAbility(newOwner, this.logService);
  }
}


