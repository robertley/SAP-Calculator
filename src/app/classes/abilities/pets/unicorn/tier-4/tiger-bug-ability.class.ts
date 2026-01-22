import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class TigerBugAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TigerBugAbility',
      owner: owner,
      triggers: ['ClearFront'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let pushTargetResp = owner.parent.getThis(owner);
    let pushTarget = pushTargetResp.pet;
    if (pushTarget == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} pushed ${pushTarget.name} to the front.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    owner.parent.pushPetToFront(pushTarget, true);

    let snipeTargetsResp = owner.parent.opponent.getFurthestUpPets(
      2,
      [],
      owner,
    );
    let snipeTargets = snipeTargetsResp.pets;
    if (snipeTargets.length == 0) {
      return;
    }

    let power = this.level * 3;
    for (let target of snipeTargets) {
      if (target != null) {
        owner.snipePet(target, power, snipeTargetsResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TigerBugAbility {
    return new TigerBugAbility(newOwner, this.logService);
  }
}
