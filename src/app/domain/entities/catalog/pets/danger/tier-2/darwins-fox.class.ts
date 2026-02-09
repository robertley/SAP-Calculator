import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class DarwinsFox extends Pet {
  name = "Darwin's Fox";
  tier = 2;
  pack: Pack = 'Danger';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new DarwinsFoxAbility(this, this.logService));
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


export class DarwinsFoxAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DarwinsFoxAbility',
      owner: owner,
      triggers: ['EnemyHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Find who killed the friend
    if (triggerPet && triggerPet.alive) {
      let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
      let target = targetResp.pet;
      if (!target) {
        return;
      }
      owner.jumpAttackPrep(target);
      owner.jumpAttack(target, tiger, undefined, targetResp.random);
    } else {
      let targetResp = owner.parent.opponent.getFurthestUpPet(owner);
      let target = targetResp.pet;
      if (!target) {
        return;
      }
      owner.jumpAttackPrep(target);
      owner.jumpAttack(target, tiger, undefined, targetResp.random);
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  copy(newOwner: Pet): DarwinsFoxAbility {
    return new DarwinsFoxAbility(newOwner, this.logService);
  }
}


