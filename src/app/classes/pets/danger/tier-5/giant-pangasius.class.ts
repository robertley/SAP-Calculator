import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { hasSilly } from '../../../player/player-utils';


export class GiantPangasius extends Pet {
  name = 'Giant Pangasius';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 4;
  health = 5;

  initAbilities(): void {
    this.addAbility(new GiantPangasiusAbility(this, this.logService));
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


export class GiantPangasiusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GiantPangasiusAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    if (!gameApi) {
      return;
    }

    // Use the correct transformation amount based on which player this pet belongs to
    let transformations: number;
    if (owner.parent === gameApi.player) {
      transformations = gameApi.playerTransformationAmount;
    } else {
      transformations = gameApi.opponentTransformationAmount;
    }

    let damage = this.level * 4; // 4/8/12 damage per level

    if (transformations > 0) {
      for (let i = 0; i < transformations; i++) {
        const useSillyTargeting = hasSilly(owner);
        let targetResp = (useSillyTargeting
          ? owner.parent.getRandomPet([], false, true, false, owner, true)
          : owner.parent.opponent.getRandomPet([], false, true, false, owner)
        );
        if (targetResp.pet) {
          owner.snipePet(targetResp.pet, damage, targetResp.random, tiger);
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GiantPangasiusAbility {
    return new GiantPangasiusAbility(newOwner, this.logService);
  }
}
