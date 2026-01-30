import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Kappa extends Pet {
  name = 'Kappa';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new KappaAbility(
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

