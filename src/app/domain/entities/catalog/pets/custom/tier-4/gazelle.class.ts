import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';


export class Gazelle extends Pet {
  name = 'Gazelle';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 3;
  override initAbilities(): void {
    this.addAbility(new GazelleAbility(this, this.logService));
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


export class GazelleAbility extends Ability {
  private logService: LogService;
  private pendingAttackBuff: number = 0;
  private pendingHealthBuff: number = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Gazelle Ability',
      owner,
      triggers: ['StartTurn', 'EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { trigger, gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    if (trigger === 'StartTurn') {
      this.applyBonus(gameApi, owner, tiger, pteranodon);
    } else if (trigger === 'EndTurn') {
      this.removeBonus(owner);
    }
  }

  private applyBonus(
    gameApi: GameAPI,
    owner: Pet,
    tiger?: boolean,
    pteranodon?: boolean,
  ): void {
    const goldStat =
      owner.parent === gameApi?.player
        ? gameApi.playerGoldSpent
        : gameApi?.opponentGoldSpent;
    const goldOver = Math.max(0, (goldStat ?? 0) - 10);
    if (goldOver <= 0) {
      this.pendingAttackBuff = 0;
      this.pendingHealthBuff = 0;
      return;
    }

    const attackPerGold = [2, 4, 6][Math.min(this.level - 1, 2)];
    const healthPerGold = [1, 2, 3][Math.min(this.level - 1, 2)];
    const attackGain = goldOver * attackPerGold;
    const healthGain = goldOver * healthPerGold;

    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);
    this.pendingAttackBuff = attackGain;
    this.pendingHealthBuff = healthGain;

    this.logService.createLog({
      message: `${owner.name} gained +${attackGain}/+${healthGain} (per gold over 10) from ${goldOver} gold.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });
  }

  private removeBonus(owner: Pet): void {
    if (this.pendingAttackBuff !== 0 || this.pendingHealthBuff !== 0) {
      owner.increaseAttack(-this.pendingAttackBuff);
      owner.increaseHealth(-this.pendingHealthBuff);
      this.pendingAttackBuff = 0;
      this.pendingHealthBuff = 0;
    }
  }

  override copy(newOwner: Pet): GazelleAbility {
    return new GazelleAbility(newOwner, this.logService);
  }
}


