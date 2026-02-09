import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Snake extends Pet {
  name = 'Snake';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 8;
  health = 3;
  initAbilities(): void {
    this.addAbility(new SnakeAbility(this, this.logService));
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


// Friend ahead attacks: Deal 5 damage to one random enemy. Works 5 times per battle.
export class SnakeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SnakeAbility',
      owner: owner,
      triggers: ['FriendAheadAttacked'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 5,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level * 5;
    let targetResp = owner.parent.opponent.getRandomPet(
      [],
      false,
      true,
      false,
      owner,
    );
    if (!targetResp.pet) {
      return;
    }
    owner.snipePet(targetResp.pet, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SnakeAbility {
    return new SnakeAbility(newOwner, this.logService);
  }
}


