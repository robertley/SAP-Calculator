import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { PetService } from 'app/services/pet/pet.service';

export class KappaAbility extends Ability {
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
      name: 'KappaAbility',
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

    let petPool =
      owner.parent == gameApi.player
        ? gameApi.playerPetPool
        : gameApi.opponentPetPool;
    let tier3Pets = petPool.get(3);

    for (let i = 0; i < owner.level; i++) {
      let playerSpawn = tier3Pets[Math.floor(Math.random() * tier3Pets.length)];
      let opponentSpawn =
        tier3Pets[Math.floor(Math.random() * tier3Pets.length)];

      let spawn = this.petService.createPet(
        {
          attack: 14,
          equipment: null,
          exp: 0,
          health: 16,
          mana: 0,
          name: playerSpawn,
        },
        owner.parent,
      );

      let summonResult = owner.parent.summonPet(
        spawn,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a ${spawn.name} (14/16).`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: true,
        });
      }

      let opponentSpawnPet = this.petService.createPet(
        {
          attack: 14,
          equipment: null,
          exp: 0,
          health: 16,
          mana: 0,
          name: opponentSpawn,
        },
        owner.parent.opponent,
      );

      let opponentSummonResult = owner.parent.opponent.summonPet(
        opponentSpawnPet,
        owner.savedPosition,
        false,
        owner,
      );
      if (opponentSummonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a ${opponentSpawnPet.name} (14/16) for the opponent.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: true,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KappaAbility {
    return new KappaAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
