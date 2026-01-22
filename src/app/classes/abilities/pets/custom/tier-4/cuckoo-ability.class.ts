import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Chick } from '../../../../pets/hidden/chick.class';

export class CuckooAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Cuckoo Ability',
      owner,
      triggers: ['EnemyDied'],
      abilityType: 'Pet',
      native: true,
      maxUses: owner.level * 2,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    if (!triggerPet || !triggerPet.parent) {
      return;
    }

    const enemyTeam = triggerPet.parent;
    if (!enemyTeam.alive()) {
      return;
    }

    const chick = new Chick(
      this.logService,
      (owner as any).abilityService,
      enemyTeam,
    );
    const summonResult = enemyTeam.summonPet(chick, 0);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a 1/1 Chick for the enemy front.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): CuckooAbility {
    return new CuckooAbility(newOwner, this.logService);
  }
}
