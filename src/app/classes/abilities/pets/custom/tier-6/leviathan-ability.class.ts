import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';

export class LeviathanAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'LeviathanAbility',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { tiger, pteranodon } = context;

    const power = this.level * 6;
    const expGain = this.level * 2;
    const fish = this.petService.createPet(
      {
        name: 'Fish',
        attack: power,
        health: power,
        mana: 0,
        exp: 0,
        equipment: null,
        triggersConsumed: 0,
      },
      owner.parent,
    );

    fish.increaseExp(expGain);
    const summonResult = owner.parent.summonPet(
      fish,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned ${fish.name} (${power}/${power}) and granted ${expGain} exp.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LeviathanAbility {
    return new LeviathanAbility(newOwner, this.logService, this.petService);
  }
}
