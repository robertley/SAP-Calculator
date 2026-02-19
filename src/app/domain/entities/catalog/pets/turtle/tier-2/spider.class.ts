import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getRandomInt } from 'app/runtime/random';


export class Spider extends Pet {
  name = 'Spider';
  tier = 2;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 2;
  initAbilities() {
    this.addAbility(
      new SpiderAbility(
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


export class SpiderAbility extends Ability {
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
      name: 'SpiderAbility',
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

    const activePool =
      owner.parent == gameApi?.player
        ? gameApi?.playerPetPool
        : gameApi?.opponentPetPool;
    const tier3Pets = [...(activePool?.get(3) ?? [])];
    let possibleSpawnPets = tier3Pets.filter((pet) => pet && pet != 'Spider');
    if (possibleSpawnPets.length == 0) {
      possibleSpawnPets = [...(this.petService?.allPets?.get(3) ?? [])].filter(
        (pet) => pet && pet != 'Spider',
      );
    }
    if (possibleSpawnPets.length == 0) {
      return;
    }

    let spawnPetName =
      possibleSpawnPets[getRandomInt(0, possibleSpawnPets.length - 1)];
    if (!spawnPetName) {
      return;
    }
    let level = this.level;
    let exp = this.minExpForLevel;
    let power = this.level * 2;

    let spawnPet = this.petService.createPet(
      {
        attack: power,
        exp: exp,
        equipment: null,
        health: power,
        name: spawnPetName,
        mana: 0,
      },
      owner.parent,
    );

    let summonResult = owner.parent.summonPet(
      spawnPet,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${spawnPet.name} level ${level} (${power}/${power})`,
        type: 'ability',
        player: owner.parent,
        randomEvent: true,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SpiderAbility {
    return new SpiderAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}







