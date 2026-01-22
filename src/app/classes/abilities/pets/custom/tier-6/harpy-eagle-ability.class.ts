import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';

export class HarpyEagleAbility extends Ability {
  private logService: LogService;
  private petService: PetService;
  private usesThisTurn = 0;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'HarpyEagleAbility',
      owner: owner,
      triggers: ['ThisHurt', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      return;
    }

    if (context.trigger !== 'ThisHurt') {
      return;
    }

    if (this.usesThisTurn >= 3) {
      return;
    }

    this.usesThisTurn++;

    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level * 5;
    let petPool: string[];
    if (owner.parent === gameApi.player) {
      petPool = gameApi.playerPetPool.get(1);
    } else {
      petPool = gameApi.opponentPetPool.get(1);
    }

    let petName = petPool[Math.floor(Math.random() * petPool.length)];
    let summonPet = this.petService.createPet(
      {
        name: petName,
        attack: power,
        health: power,
        equipment: null,
        mana: 0,
        exp: 0,
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
        message: `${owner.name} spawned ${summonPet.name} (${power}/${power}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: true,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HarpyEagleAbility {
    return new HarpyEagleAbility(newOwner, this.logService, this.petService);
  }
}
