import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Orangutan } from 'app/classes/pets/star/tier-3/orangutan.class';
export class MacaqueAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MacaqueAbility',
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

    let power = this.level * 12;
    let monke = new Orangutan(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
      0,
      owner.minExpForLevel,
      owner.equipment,
    );

    let result = owner.parent.summonPetInFront(owner, monke);
    if (result.success) {
      let message = `${owner.name} spawned Orangutan ${monke.attack}/${monke.health}`;
      if (owner.equipment != null) {
        message += ` with ${owner.equipment.name}`;
      }
      message += `.`;

      this.logService.createLog({
        message: message,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: result.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MacaqueAbility {
    return new MacaqueAbility(newOwner, this.logService, this.abilityService);
  }
}
