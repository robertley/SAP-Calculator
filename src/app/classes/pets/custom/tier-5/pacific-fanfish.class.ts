import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class PacificFanfish extends Pet {
  name = 'Pacific Fanfish';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new PacificFanfishAbility(this, this.logService));
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


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
