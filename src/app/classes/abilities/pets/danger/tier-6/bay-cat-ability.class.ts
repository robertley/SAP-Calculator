import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { DANGERS_AND_USEFUL_POOLS } from 'app/data/dangers-and-useful';

export class BayCatAbility extends Ability {
  private logService: LogService;
  private petService: PetService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    petService: PetService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BayCatAbility',
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
    this.petService = petService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let bayPool = DANGERS_AND_USEFUL_POOLS.bayCat;

    for (let i = 0; i < owner.level; i++) {
      let petName = bayPool[Math.floor(Math.random() * bayPool.length)];
      let summonedPet = this.petService.createPet(
        {
          name: petName,
          attack: null,
          health: null,
          equipment: null,
          mana: 0,
          exp: 0,
        },
        owner.parent,
      );

      let summonResult = owner.parent.summonPet(
        summonedPet,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned ${summonedPet.name}`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: true,
        });

        // Activate start of battle ability
        if (summonedPet.hasAbility('StartBattle')) {
          this.logService.createLog({
            message: `${summonedPet.name} activated its start of battle ability`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
          });
          summonedPet.activateAbilities('StartBattle', gameApi, 'Pet');
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BayCatAbility {
    return new BayCatAbility(
      newOwner,
      this.logService,
      this.petService,
      this.abilityService,
    );
  }
}
