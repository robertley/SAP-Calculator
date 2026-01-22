import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { PetService } from 'app/services/pet/pet.service';

export class StorkAbility extends Ability {
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
      name: 'StorkAbility',
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

    let tier = Math.max(1, gameApi.previousShopTier - 1);
    const normalizePool = (pool?: string[]) =>
      (pool ?? []).filter(
        (petName) =>
          petName &&
          owner.name &&
          petName.toLowerCase() !== owner.name.toLowerCase(),
      );
    let summonPetPool = normalizePool(this.petService.allPets.get(tier));
    if (!summonPetPool.length) {
      summonPetPool = normalizePool(this.petService.allPets.get(1));
    }
    if (!summonPetPool.length) {
      // Nothing to spawn; keep ability chain intact
      this.triggerTigerExecution(context);
      return;
    }

    let summonPetName =
      summonPetPool[Math.floor(Math.random() * summonPetPool.length)];
    let oldStork = gameApi.oldStork;
    let summonPet = this.petService.createPet(
      {
        name: summonPetName,
        attack: oldStork ? null : 2 * this.level,
        equipment: null,
        exp: owner.minExpForLevel,
        health: oldStork ? null : 2 * this.level,
        mana: 0,
      },
      owner.parent,
    );

    let summonResult = owner.parent.summonPet(
      summonPet,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${summonPet.name} Level ${this.level}`,
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

  copy(newOwner: Pet): StorkAbility {
    return new StorkAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
