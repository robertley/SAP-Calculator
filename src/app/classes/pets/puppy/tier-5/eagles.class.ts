import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Eagle extends Pet {
  name = 'Eagle';
  tier = 5;
  pack: Pack = 'Puppy';
  attack = 6;
  health = 5;
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
  initAbilities(): void {
    this.addAbility(
      new EagleAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }
}


export class EagleAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'EagleAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

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
    let pets = normalizePool(petPool?.get(tier));
    // Fallback to global pool if the per-player pool is missing/empty (e.g. custom packs or unset tier)
    if (!pets?.length) {
      pets = normalizePool(this.petService.allPets.get(tier));
    }
    // Final fallback to tier 1 to avoid crashing if pools are still empty
    if (!pets?.length) {
      pets = normalizePool(this.petService.allPets.get(1));
    }
    if (!pets.length) {
      // Nothing to spawn; still trigger tiger effects to keep ability chain intact
      this.triggerTigerExecution(context);
      return;
    }

    let petName = pets[Math.floor(Math.random() * pets.length)];
    let power = this.level * 5;
    let pet = this.petService.createPet(
      {
        name: petName,
        attack: power,
        health: power,
        exp: owner.minExpForLevel,
        equipment: null,
        mana: 0,
      },
      owner.parent,
    );

    let summonResult = owner.parent.summonPet(
      pet,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${pet.name} Level ${pet.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: true,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): EagleAbility {
    return new EagleAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
