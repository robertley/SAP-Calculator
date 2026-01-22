import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { PetService } from 'app/services/pet/pet.service';

export class OrcaAbility extends Ability {
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
      name: 'OrcaAbility',
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

    for (let i = 0; i < this.level; i++) {
      let faintPet = this.petService.getRandomFaintPet(
        owner.parent,
        undefined,
        [owner.name, 'Quetzalcoatlus'],
      );
      faintPet.attack = 6;
      faintPet.health = 6;

      let summonResult = owner.parent.summonPet(
        faintPet,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a 6/6 ${faintPet.name}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: true,
          pteranodon: pteranodon,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OrcaAbility {
    return new OrcaAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
