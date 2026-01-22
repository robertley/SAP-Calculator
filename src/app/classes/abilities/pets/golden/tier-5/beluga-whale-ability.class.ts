import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { PetService } from 'app/services/pet/pet.service';

export class BelugaWhaleAbility extends Ability {
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
      name: 'BelugaWhaleAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
      ignoreRepeats: true,
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (owner.belugaSwallowedPet == null || owner.alive) {
      return;
    }

    let spawnPet = this.petService.createPet(
      {
        attack: null,
        equipment: null,
        exp: owner.minExpForLevel,
        health: null,
        name: owner.belugaSwallowedPet,
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
        message: `${owner.name} spawned ${spawnPet.name} Level ${owner.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BelugaWhaleAbility {
    return new BelugaWhaleAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
