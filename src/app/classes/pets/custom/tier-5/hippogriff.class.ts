import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class Hippogriff extends Pet {
  name = 'Hippogriff';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new HippogriffAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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


export class HippogriffAbility extends Ability {
  private readonly logService: LogService;
  private readonly abilityService: AbilityService;
  private readonly petService: PetService;
  private pendingBuffs: Map<Pet, number> = new Map();

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'Hippogriff Ability',
      owner: owner,
      triggers: ['FriendSummoned', 'EndTurn', 'ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { trigger, triggerPet, gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    if (trigger === 'FriendSummoned') {
      const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
      if (targetResp.pet) {
        this.applyTemporaryBuff(targetResp.pet, context, targetResp.random);
      }
    } else if (trigger === 'EndTurn') {
      this.resetBuffs();
    } else if (trigger === 'ThisDied') {
      this.summonNextTierPet(gameApi, context);
    }

    this.triggerTigerExecution(context);
  }

  private applyTemporaryBuff(
    target: Pet,
    context: AbilityContext,
    randomEvent: boolean,
  ): void {
    const owner = this.owner;
    const buffAmount = this.level;
    target.increaseAttack(buffAmount);

    const previousBuff = this.pendingBuffs.get(target) ?? 0;
    this.pendingBuffs.set(target, previousBuff + buffAmount);

    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} +${buffAmount} attack until next turn.`,
      context.tiger,
      context.pteranodon,
      { randomEvent },
    );
  }

  private resetBuffs(): void {
    for (const [pet, amount] of this.pendingBuffs) {
      if (pet) {
        pet.increaseAttack(-amount);
      }
    }
    this.pendingBuffs.clear();
  }

  private summonNextTierPet(gameApi: GameAPI, context: AbilityContext): void {
    const owner = this.owner;
    if (!gameApi) {
      return;
    }

    const previousTier = Number.isFinite(gameApi.previousShopTier)
      ? gameApi.previousShopTier
      : 1;
    const tier = Math.min(6, Math.max(1, previousTier + 1));

    const normalizePool = (pool?: string[]) =>
      (pool ?? []).filter(
        (petName) =>
          petName &&
          owner.name &&
          petName.toLowerCase() !== owner.name.toLowerCase(),
      );

    const petPool =
      owner.parent === gameApi.player
        ? gameApi.playerPetPool
        : gameApi.opponentPetPool;
    let tierPool = normalizePool(petPool?.get(tier));
    if (!tierPool?.length) {
      tierPool = normalizePool(this.petService.allPets.get(tier));
    }
    if (!tierPool?.length) {
      tierPool = normalizePool(this.petService.allPets.get(1));
    }
    if (!tierPool.length) {
      return;
    }

    const petName = tierPool[Math.floor(Math.random() * tierPool.length)];
    const power = this.level * 5;
    const pet = this.petService.createPet(
      {
        name: petName,
        attack: power,
        equipment: null,
        exp: 0,
        health: power,
        mana: 0,
      },
      owner.parent,
    );

    const summonResult = owner.parent.summonPet(
      pet,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned a ${pet.attack}/${pet.health} ${pet.name} from tier ${tier}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        randomEvent: true,
        pteranodon: context.pteranodon,
      });
    }
  }

  override copy(newOwner: Pet): HippogriffAbility {
    return new HippogriffAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}

