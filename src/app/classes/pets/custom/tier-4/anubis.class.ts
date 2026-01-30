import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext, AbilityType } from 'app/classes/ability.class';


export class Anubis extends Pet {
  name = 'Anubis';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new AnubisAbility(this, this.logService));
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


export class AnubisAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AnubisAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    const thresholds = [2, 4, 6];
    const tierLimit =
      thresholds[Math.min(Math.max(this.level, 1) - 1, thresholds.length - 1)];

    const faintFriends = owner.parent.petArray
      .filter(
        (friend) =>
          friend &&
          friend !== owner &&
          friend.alive &&
          friend.isFaintPet() &&
          friend.tier <= tierLimit,
      )
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .slice(0, 2);

    for (const friend of faintFriends) {
      this.logService.createLog({
        message: `${owner.name} activated ${friend.name}'s faint ability (tier ${friend.tier} <= ${tierLimit}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });

      friend.activateAbilities('PostRemovalFaint', gameApi, 'Pet' as AbilityType);
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AnubisAbility {
    return new AnubisAbility(newOwner, this.logService);
  }
}

