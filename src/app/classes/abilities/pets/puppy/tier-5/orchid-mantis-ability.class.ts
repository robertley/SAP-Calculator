import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { PrayingMantis } from '../../../../pets/star/tier-4/praying-mantis.class';

export class OrchidMantisAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'OrchidMantisAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let attack = Math.min(Math.floor(owner.attack * (this.level * 0.4)), 50);
    let health = Math.min(Math.floor(owner.health * (this.level * 0.4)), 50);
    let mantis = new PrayingMantis(
      this.logService,
      this.abilityService,
      owner.parent,
      health,
      attack,
      0,
      this.minExpForLevel,
      null,
    );

    let result = owner.parent.summonPetInFront(owner, mantis);
    if (result.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Mantis ${mantis.attack}/${mantis.health}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: result.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OrchidMantisAbility {
    return new OrchidMantisAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
