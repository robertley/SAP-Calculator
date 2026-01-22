import { Ability, AbilityContext } from '../../../../../classes/ability.class';
import { LogService } from '../../../../../services/log.service';
import { Pet } from '../../../../../classes/pet.class';
import { CuckooChick } from '../../../../pets/custom/token/cuckoo-chick.class';
import { AbilityService } from '../../../../../services/ability/ability.service';

export class CuckooAbility extends Ability {
  constructor(
    owner: Pet,
    private logService: LogService,
    private abilityService: AbilityService,
  ) {
    super({
      name: 'CuckooAbility',
      owner: owner,
      triggers: ['EnemyFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    const opponent = owner.parent.opponent;

    // Limit 2/4/6 per battle
    const maxUses = this.level * 2;
    if (this.currentUses > maxUses) {
      return;
    }

    let cuckooChick = new CuckooChick(
      this.logService,
      this.abilityService,
      opponent,
    );

    // Initializing stats via initPet
    // Correct order: exp, health, attack, mana, equipment, triggersConsumed
    cuckooChick.initPet(0, 1, 1, 0, null, 0);

    const summonIdx = 0;

    let summonResult = opponent.summonPet(cuckooChick, summonIdx, true, owner);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned Cuckoo Chick for the enemy Early.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Trigger Tiger execution if needed
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CuckooAbility {
    return new CuckooAbility(newOwner, this.logService, this.abilityService);
  }
}
