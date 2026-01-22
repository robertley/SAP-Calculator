import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../../player.class';
import { DirtyRat } from '../../../../pets/hidden/dirty-rat.class';

export class RatAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'RatAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let opponent = owner.parent.opponent;

    for (let i = 0; i < this.level; i++) {
      let dirtyRat = new DirtyRat(
        this.logService,
        this.abilityService,
        opponent,
        null,
        null,
        0,
        0,
      );

      let summonResult = opponent.summonPet(dirtyRat, 0, false, owner);

      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} Summoned Dirty Rat on Opponent`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RatAbility {
    return new RatAbility(newOwner, this.logService, this.abilityService);
  }
}
