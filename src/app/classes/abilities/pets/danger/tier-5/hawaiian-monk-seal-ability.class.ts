import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class HawaiianMonkSealAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HawaiianMonkSealAbility',
      owner: owner,
      triggers: ['FriendAttacked'],
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

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let attackingFriend = targetResp.pet;

    if (!attackingFriend || owner.targettedFriends.has(attackingFriend)) {
      return;
    }

    // If still standing, give it +2 health per level. Works on three friends per turn.
    if (owner.targettedFriends.size < 3) {
      if (attackingFriend.alive) {
        let healthBonus = 2 * owner.level;
        attackingFriend.increaseHealth(healthBonus);
        owner.targettedFriends.add(attackingFriend);

        this.logService.createLog({
          message: `${owner.name} gave ${attackingFriend.name} ${healthBonus} health`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: targetResp.random,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HawaiianMonkSealAbility {
    return new HawaiianMonkSealAbility(newOwner, this.logService);
  }
}
