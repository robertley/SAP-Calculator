import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PacificFanfishAbility extends Ability {
  constructor(
    owner: Pet,
    private logService: LogService,
  ) {
    super({
      name: 'Pacific Fanfish Ability',
      owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const buffPerFriend = 4 * this.level;
    const eligibleFriends = owner.parent.petArray.filter(
      (friend) =>
        friend && friend !== owner && friend.alive && friend.sellValue >= 3,
    );
    if (eligibleFriends.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const totalBuff = buffPerFriend * eligibleFriends.length;
    owner.increaseAttack(totalBuff);
    owner.increaseHealth(totalBuff);

    this.logService.createLog({
      message: `${owner.name} gained +${totalBuff}/+${totalBuff} from ${eligibleFriends.length} friend(s) with ≥3 sell value.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PacificFanfishAbility {
    return new PacificFanfishAbility(newOwner, this.logService);
  }
}
