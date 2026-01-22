import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { FirePup } from '../../../../pets/hidden/fire-pup.class';

export class CerberusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CerberusAbility',
      owner: owner,
      triggers: ['ClearFront'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const owner = this.owner;
        // Check if first pet is null (front space is empty)
        return owner.parent.pet0 == null;
      },
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

    let exp = 5;
    let firePup = new FirePup(
      this.logService,
      this.abilityService,
      owner.parent,
      8,
      8,
      null,
      exp,
    );

    let summonResult = owner.parent.summonPet(firePup, 0, false, owner);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Fire Pup (8/8).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        sourcePet: owner,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  copy(newOwner: Pet): CerberusAbility {
    return new CerberusAbility(newOwner, this.logService, this.abilityService);
  }
}
