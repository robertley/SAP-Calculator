import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Strawberry } from '../../../../equipment/star/strawberry.class';

export class HummingbirdAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'HummingbirdAbility',
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

    let excludePets = owner.parent.getPetsWithEquipment('Strawberry');
    let targetsResp = owner.parent.nearestPetsBehind(
      this.level,
      owner,
      excludePets,
    );
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (let target of targetsResp.pets) {
      target.givePetEquipment(new Strawberry(this.logService));
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} strawberry.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HummingbirdAbility {
    return new HummingbirdAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
