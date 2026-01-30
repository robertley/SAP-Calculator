import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Stork extends Pet {
  name = 'Stork';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new StorkAbility(
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
      triggers: ['PostRemovalFaint'],
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

